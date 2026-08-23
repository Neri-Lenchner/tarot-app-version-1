import axios from "axios";
import { appConfig } from "../utils/app-config";
import { ISpreadCard } from "../dto/tarot.dto";
import { tarotCombinations } from "../data/combinations";
import { riderWaiteCards } from "../data/riderWaite";
import { personalCardNotes } from "../data/personal-card-notes";
import { healthIndicators } from "../data/health";
import { healthCombinations } from "../data/health-combinations";
import {
    HEALTH_KEYWORDS,
    THIRD_PERSON_PRONOUNS,
    THIRD_PERSON_RELATIONSHIPS,
    COURT_CARDS,
    MAJOR_ARCANA,
    CATEGORY_KEYWORDS,
    CELTIC_POSITION_GUIDE,
} from "../utils/prompt-constants";

function findMatchingCombinations(cards: ISpreadCard[]): string[] {
    const nameSet = new Set(cards.map(c => c.name.toLowerCase()));
    const matches: string[] = [];
    for (const category of tarotCombinations) {
        for (const combo of category.combinations) {
            if (combo.cards.every(name => nameSet.has(name.toLowerCase()))) {
                matches.push(`• ${combo.cards.join(" + ")} → ${combo.meaning} [${category.category}]`);
            }
        }
    }
    return matches;
}

function isHealthQuestion(question: string): boolean {
    const q = question.toLowerCase();
    return HEALTH_KEYWORDS.some(kw => q.includes(kw));
}

function findHealthIndicators(cards: ISpreadCard[]): string[] {
    const nameSet = new Set(cards.map(c => c.name.toLowerCase()));
    const matches: string[] = [];
    for (const indicator of healthIndicators) {
        const matchCount = indicator.cards.filter(c =>
            nameSet.has(c.replace(/ Rx$/i, '').toLowerCase())
        ).length;
        const threshold = indicator.cards.length === 1 ? 1 : 2;
        if (matchCount >= threshold) {
            matches.push(`• ${indicator.health}`);
        }
    }
    return matches;
}

function isThirdPersonQuestion(question: string): boolean {
    const q = question.toLowerCase();
    if (THIRD_PERSON_PRONOUNS.some(p => q.includes(p) || q.startsWith(p.trim()))) return true;
    if (THIRD_PERSON_RELATIONSHIPS.some(r => q.includes(r.toLowerCase()))) return true;
    return false;
}

const CELTIC_SELF_POSITIONS = new Set(['positive energy', 'negative energy', 'inside', 'outside']);

// Romantic question detection
const ROMANTIC_KEYWORDS = ['love', 'relationship', 'partner', 'romance', 'romantic', 'marriage', 'marry', 'boyfriend', 'girlfriend', 'husband', 'wife', 'dating', 'soulmate', 'together', 'couple', 'breakup', 'divorce', 'אהבה', 'זוגיות', 'נישואים', 'חבר', 'חברה', 'בן זוג', 'בת זוג', 'יחסים', 'פרידה'];
const CELTIC_ROMANTIC_POSITIONS = new Set(['past', 'present', 'near future', 'far future']);
// Major Arcana cards carrying a female figure/energy
const MA_FEMALE_FIGURES = new Set(['the high priestess', 'the empress', 'justice', 'strength', 'the star', 'the world']);
// Major Arcana cards carrying a male figure/energy
const MA_MALE_FIGURES = new Set(['the magician', 'the emperor', 'the hierophant', 'the chariot', 'the hermit', 'the hanged man', 'death', 'the devil']);

function isRomanticQuestion(question: string): boolean {
    const q = question.toLowerCase();
    return ROMANTIC_KEYWORDS.some(kw => q.includes(kw));
}

function getCourtCardsSection(cards: ISpreadCard[], gender?: "male" | "female", spreadType?: string, question?: string): string {
    const courtCards = cards.filter(c => COURT_CARDS.has(c.name.replace(/ Rx$/i, '').toLowerCase()));
    if (courtCards.length === 0) return '';

    const isFemaleFigure = (c: ISpreadCard) => c.name.replace(/ Rx$/i, '').toLowerCase().startsWith('queen');

    // Pre-compute romantic context once
    const isRomantic = !!(question?.trim() && isRomanticQuestion(question) && spreadType === 'celtic' && gender);
    const hasLovers = isRomantic && cards.some(c => c.name.toLowerCase().replace(/ rx$/i, '') === 'the lovers');
    const hasOppGenderMA = isRomantic && (
        gender === 'male'
            ? cards.some(c => MA_FEMALE_FIGURES.has(c.name.toLowerCase().replace(/ rx$/i, '')))
            : cards.some(c => MA_MALE_FIGURES.has(c.name.toLowerCase().replace(/ rx$/i, '')))
    );
    const loversException = hasLovers && hasOppGenderMA;
    const maExampleList = gender === 'male'
        ? 'The High Priestess, The Empress, Justice, Strength, The Star, The World'
        : 'The Magician, The Emperor, The Hierophant, The Chariot, The Hermit, The Hanged Man, Death, The Devil';

    const lines: string[] = [];

    const KNIGHT_SUIT_THOUGHTS: Record<string, string> = {
        'knight of cups':      'emotions, love, and relationships',
        'knight of wands':     'passion, inspiration, and ambition',
        'knight of swords':    'conflict, decisions, and mental clarity',
        'knight of pentacles': 'work, money, and practical matters',
    };

    for (const card of courtCards) {
        const pos = card.position;
        const cardBaseName = card.name.replace(/ Rx$/i, '').toLowerCase();
        const isKnight = cardBaseName.startsWith('knight');
        const fig = isFemaleFigure(card) ? 'female' : 'male';
        const isInSelfPos = spreadType === 'celtic' && CELTIC_SELF_POSITIONS.has(pos.toLowerCase());
        const isInRomanticPos = isRomantic && CELTIC_ROMANTIC_POSITIONS.has(pos.toLowerCase());
        const isSameGender = !!gender && fig === gender;
        const oppWord = gender === 'male' ? 'woman' : 'man';
        const sameWord = gender === 'male' ? 'man' : 'woman';
        const relExamples = gender === 'male'
            ? 'romantic partner, mother, sister, colleague, friend'
            : 'romantic partner, father, brother, colleague, friend';

        let ruling: string;

        // Positions 3-6 in Celtic (Past/Present/Near Future/Far Future) or any position in Three Cards
        const KNIGHT_AMBIGUOUS_POSITIONS = new Set(['past', 'present', 'near future', 'far future', 'future']);

        if (isKnight) {
            const thoughtDomain = KNIGHT_SUIT_THOUGHTS[cardBaseName] ?? 'a specific area of life';
            const isAmbiguousPos = KNIGHT_AMBIGUOUS_POSITIONS.has(pos.toLowerCase());

            if (isAmbiguousPos) {
                ruling = `RULING — KNIGHT IN STORY POSITION (PERSON OR THOUGHTS — YOU DECIDE): In this position a Knight can represent EITHER a real, specific person in the querent's life OR active thoughts of ${thoughtDomain} — but not both. Read the full spread and the question, then commit to one interpretation. If it is a person: describe them as a driven, fast-moving individual who embodies the energy of ${card.name} — who they are, how they move, and how they affect the querent's situation. If it is thoughts: tell the querent explicitly that there are strong, consuming thoughts of ${thoughtDomain} at work — "you are thinking intensely about...", "very powerful thoughts of... are moving through this". State your choice clearly and do not leave it vague.`;
            } else {
                ruling = `RULING — KNIGHT (THOUGHTS ONLY): This card does NOT represent a specific person in this position. Knights are the bridge between the world of thought and the world of matter — they signal active, powerful thoughts in motion. There are strong, consuming thoughts of ${thoughtDomain} at work here. Tell the querent explicitly — "there are strong thoughts of...", "you are thinking intensely about...", "very powerful thoughts of... are shaping this" — that this mental energy is real, active, and influencing the situation. The suit defines the subject: Cups = emotions/love/relationships, Wands = passion/goals/inspiration, Swords = conflict/decisions/tension, Pentacles = work/money/practical matters. Do NOT describe this card as a specific person.`;
            }
        } else if (isInSelfPos) {
            const isEnergyPos = pos.toLowerCase() === 'positive energy' || pos.toLowerCase() === 'negative energy';
            if (isEnergyPos) {
                ruling = `RULING — ENERGY POSITION: Position "${pos}" represents an impersonal energy or force active in the querent's life — not a person. This court card embodies the quality or nature of that force (${fig} figure, querent is ${gender ?? 'unknown gender'}). Do NOT name an external person here. Describe what energetic quality this card brings to this position: what kind of force, drive, or current is it, and how is it operating in the querent's circumstances?`;
            } else {
                ruling = `RULING — ALWAYS THE QUERENT: Position "${pos}" is exclusively about the querent's own inner world. This card IS THE QUERENT — even though the figure is ${fig} and the querent is ${gender ?? 'unknown gender'}. Do NOT name an external person here. Interpret this card as a direct mirror of who the querent is.`;
            }
        } else if (!gender) {
            ruling = `${fig === 'female' ? 'Female' : 'Male'} figure. Interpret as a real, specific ${fig} person in the querent's life — never an abstract quality.`;
        } else if (isSameGender) {
            if (isInRomanticPos) {
                if (loversException) {
                    ruling = `RULING — SAME GENDER, ROMANTIC POSITION (LOVERS EXCEPTION ACTIVE): ${fig} figure, querent is ${gender}. Normally a same-gender card here cannot be the lover. BUT The Lovers card AND a ${oppWord === 'woman' ? 'female' : 'male'} Major Arcana figure are both present — together they open the possibility of a romantic partner. DECIDE based on the full spread: is this the querent's lover, or another ${sameWord} in their life? State your answer explicitly.`;
                } else {
                    ruling = `RULING — SAME GENDER, ROMANTIC POSITION: ${fig} figure, querent is ${gender}. In a romantic question, a same-gender court card in this position IS NOT the querent's romantic partner or lover. It is either the querent themselves or another ${sameWord} in their life (friend, sibling, colleague) — but NOT a love interest. (Exception would apply only if The Lovers card AND a ${oppWord === 'woman' ? 'female' : 'male'} Major Arcana such as ${maExampleList} both appeared — they do not.)`;
                }
            } else {
                ruling = `RULING — SAME GENDER: ${fig} figure, querent is ${gender}. This card could be the querent themselves OR a specific ${sameWord} in their life. YOU MUST DECIDE which one by reading the full spread. Commit to one answer and state it explicitly: either "this card is you" or "this card represents [specific person]." Do not leave it vague.`;
            }
        } else {
            ruling = `RULING — OPPOSITE GENDER: ${fig} figure, querent is ${gender}. This card CANNOT be the querent. It is a specific ${oppWord} in their life (e.g. ${relExamples}). Name and describe this person clearly — who they are, their energy, and how they affect the querent's situation.`;
        }

        lines.push(`• ${card.name} — position: ${pos}\n  ${ruling}`);
    }

    return `=== COURT CARDS — MANDATORY PER-CARD RULINGS ===\nKings, Queens, and Pages represent real, specific people. Knights in story positions (Past/Present/Near Future/Far Future) can be either a person OR active thoughts — AI decides. Knights in all other positions represent thoughts only, never a person. Apply each ruling exactly as written.\n\n${lines.join('\n\n')}\n\nRANK GUIDE: King = mature authority figure. Queen = mature figure of emotional/intellectual strength. Knight = active thoughts bridging mind and matter; may also be a person in story positions. Page = young/inexperienced — a messenger or newcomer.\nSUIT GUIDE: Wands = passionate, fiery, creative. Cups = emotional, empathic, intuitive. Swords = sharp, intellectual, communicative. Pentacles = practical, grounded, financially reliable.\n===\n\n`;
}

const SUIT_WORLDS: Record<string, { name: string; domain: string }> = {
    cups:      { name: 'Cups',      domain: 'the emotional world — relationships, feelings, intuition, and the heart' },
    wands:     { name: 'Wands',     domain: 'the inspirational world — passion, creativity, ambition, and inner drive' },
    swords:    { name: 'Swords',    domain: 'the mental world — thoughts, decisions, conflict, and the power of the mind' },
    pentacles: { name: 'Pentacles', domain: 'the material world — money, career, physical reality, and practical matters' },
};

function getSuitDominanceSection(cards: ISpreadCard[]): string {
    const counts: Record<string, number> = { cups: 0, wands: 0, swords: 0, pentacles: 0 };
    for (const card of cards) {
        const name = card.name.toLowerCase();
        for (const suit of Object.keys(counts)) {
            if (name.includes(`of ${suit}`)) { counts[suit]++; break; }
        }
    }
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    if (total === 0) return ''; // all major arcana

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const [topSuit, topCount] = sorted[0];
    const [, secondCount] = sorted[1];

    // Only flag dominance if the top suit has at least 2 cards and leads by at least 1
    if (topCount < 2 || topCount === secondCount) return '';

    const { name, domain } = SUIT_WORLDS[topSuit];
    const breakdown = sorted
        .filter(([, n]) => n > 0)
        .map(([s, n]) => `${SUIT_WORLDS[s].name}: ${n}`)
        .join(', ');

    return `=== DOMINANT SUIT — SHAPES THE ENTIRE READING ===\nSuit count: ${breakdown}.\n${name} dominates this spread with ${topCount} out of ${total} Minor Arcana cards. This is a decisive signal: whatever the querent is asking about, the answer lives primarily in ${domain}. You MUST reflect this in your interpretation — open with a clear statement that this reading is rooted in ${domain}, and let that world colour every card you interpret. The querent's situation, their challenge, and the path forward are all filtered through this lens.\n===\n\n`;
}

function isAllMajorArcana(cards: string[]): boolean {
    return cards.every(c => MAJOR_ARCANA.has(c.replace(/ Rx$/i, '').toLowerCase()));
}

function isCategoryRelevant(category: string, question: string): boolean {
    const q = question.toLowerCase();
    return (CATEGORY_KEYWORDS[category] ?? []).some(kw => q.includes(kw.toLowerCase()));
}

function getMajorArcanaSection(cards: ISpreadCard[]): string {
    const majorCards = cards.filter(c => MAJOR_ARCANA.has(c.name.toLowerCase()));
    const count = majorCards.length;
    const total = cards.length;
    if (count === 0) return "";

    const names = majorCards.map(c => c.name).join(", ");
    const ratio = count / total;

    // Profound: ≥65% of cards are major arcana (e.g. 7/10 or 3/3)
    if (ratio >= 0.65) {
        return `=== PROFOUND FATE READING — OPEN WITH THIS ===\n${count} of ${total} cards are Major Arcana: ${names}.\nThis is an extraordinary, destiny-laden reading. You MUST open your interpretation with a dedicated paragraph explicitly telling the querent: (1) their spread is dominated by Major Arcana, (2) this signals they stand at a genuine karmic crossroads — a life-defining moment, not a passing concern, (3) the forces at play are larger than everyday circumstances — fate and soul-level forces are shaping their path. Use powerful, direct language: "destiny", "karmic turning point", "the universe is speaking unmistakably". Each Major Arcana card in this spread must receive deeper and more emphatic interpretation than any Minor Arcana.\n===\n\n`;
    }

    // Significant: ≥40% of cards, or 2+ in a 3-card spread
    if (ratio >= 0.40 || (total <= 3 && count >= 2)) {
        return `=== DESTINY MARK DETECTED ===\n${count} of ${total} cards are Major Arcana: ${names}.\nEarly in your interpretation — in the opening or the first card paragraph — include a clear statement to the querent that the significant presence of Major Arcana shows this question carries real depth and karmic weight. This is not a trivial matter; forces larger than day-to-day life are involved. Each Major Arcana card must receive noticeably deeper and more emphatic treatment than any Minor Arcana card.\n===\n\n`;
    }

    // Minor: low ratio — just instruct the AI to weight them more, no user notification needed
    return `Note: The following card(s) are Major Arcana and carry greater karmic weight than the Minor Arcana in this spread — give them noticeably more depth and emphasis: ${names}.\n\n`;
}

function getPersonalNotesSection(cards: ISpreadCard[]): string {
    const noteMap = new Map(
        personalCardNotes
            .filter(n => n.note.trim() !== '')
            .map(n => [n.card.toLowerCase(), n.note.trim()])
    );
    const active = cards
        .map(c => ({ name: c.name, note: noteMap.get(c.name.replace(/ Rx$/i, '').toLowerCase()) }))
        .filter(x => x.note);
    if (active.length === 0) return '';
    const lines = active.map(x => `• ${x.name}: ${x.note}`).join('\n');
    return `=== PERSONAL CARD RULES — MANDATORY ===\nThe following cards have owner-defined interpretive rules. These OVERRIDE any general tarot tradition for the cards listed. Apply them exactly and make them central to your interpretation of each affected card:\n\n${lines}\n===\n\n`;
}

class TarotService {
    public async interpretSpread(spreadType: string, cards: ISpreadCard[], language: "en" | "he" = "en", question?: string, isThirdPerson?: boolean, confirmedCombination?: import("../dto/tarot.dto").ICombinationMatch, gender?: "male" | "female"): Promise<string> {
        const spreadName = spreadType === "celtic" ? "Celtic Cross" : "Old Gipsy";

        const cardList = cards
            .map((card, i) => {
                const data = riderWaiteCards.find(c => c.name.toLowerCase() === card.name.toLowerCase());
                return `${i + 1}. ${card.position} — ${card.name}: ${data?.meaning_up ?? ""}`;
            })
            .join("\n");

        const questionLine = question?.trim()
            ? `The querent's question is: "${question.trim()}"\n\n`
            : "";

        const celticThirdPersonPositions = spreadType === "celtic"
            ? "\n- IMPORTANT — Celtic Cross positions 7 (Inside), 8 (Outside), 9 (Fears), 10 (Potential) are especially revealing: they expose that person's private inner world, how they present themselves to others, what they are afraid of, and what their highest potential is. Treat these four positions as the deepest window into who this person truly is."
            : "";
        const thirdPersonSection = isThirdPerson
            ? `=== THIRD-PERSON READING ===\nThe querent is asking about ANOTHER PERSON, not about themselves. Adjust your ENTIRE interpretation accordingly:\n- The ENTIRE spread — every card and every position — describes that OTHER PERSON's life, situation, emotions, and trajectory, not the querent's own.\n- Speak to the querent as the observer. Refer to the subject as "the person you asked about", "they", or by the relationship if mentioned (e.g. "your friend", "your partner", "your mother").\n- Never say "you are facing" — say "the person you asked about is facing", "they feel", "their fear is", etc.${celticThirdPersonPositions}\n===\n\n`
            : "";

        const healthMatches = question?.trim() && isHealthQuestion(question.trim())
            ? findHealthIndicators(cards)
            : [];
        const healthSection = healthMatches.length > 0
            ? `=== HEALTH QUESTION DETECTED — READ THIS FIRST ===\nThe querent is asking about health. The cards in this spread indicate the following health conditions:\n\n${healthMatches.join("\n")}\n\nThese health indicators carry the HIGHEST priority. Lead your entire interpretation with the health dimension. Be specific, compassionate, and direct about what the cards are showing regarding the querent's physical or mental wellbeing.\n===\n\n`
            : "";

        const majorArcanaSection = spreadType === "celtic" ? getMajorArcanaSection(cards) : "";
        const courtCardsSection = getCourtCardsSection(cards, gender, spreadType, question);

        const confirmedComboSection = confirmedCombination
            ? `=== USER-CONFIRMED LIFE CONTEXT ===\nThe user was shown a detected combination and confirmed it is directly relevant to their current life situation:\n${confirmedCombination.cards.join(' + ')} → ${language === 'he' ? confirmedCombination.meaning_he : confirmedCombination.meaning}\nThis is the most important context in this entire reading. Treat this confirmed combination as the central truth of the spread. Reference it explicitly throughout your interpretation — especially in the opening and the conclusion — and show how each card connects back to this theme.\n===\n\n`
            : '';

        const matchedCombos = findMatchingCombinations(cards);
        const combinationsSection = matchedCombos.length > 0
            ? `=== CRITICAL — ESTABLISHED CARD COMBINATIONS DETECTED IN THIS SPREAD ===\nThe following well-known tarot combinations appear in the drawn cards. These are the SINGLE MOST IMPORTANT finding of this reading. They must be explicitly named, explained in depth, and treated as the central message the cards are delivering — above and beyond any individual card meaning:\n\n${matchedCombos.join("\n")}\n\nDo NOT bury these in passing. They are the headline of this reading.\n===\n\n`
            : "";

        const suitDominanceSection = getSuitDominanceSection(cards);
        const personalNotesSection = getPersonalNotesSection(cards);
        const positionGuide = spreadType === "celtic" ? `\n\n${CELTIC_POSITION_GUIDE}` : "";

        const positionInstruction = language === "he"
            ? "Translate each position name into Hebrew (e.g. Past→עבר, Present→הווה, Future→עתיד, Positive Energy→אנרגיה חיובית, Negative Energy→אנרגיה שלילית, Near Future→עתיד קרוב, Far Future→עתיד רחוק, Inside→עולם פנימי, Outside→עולם חיצוני, Fears→פחדים, Potential→פוטנציאל). Do NOT write 'Position 1', 'Position 2', etc. When writing 'In the X position' use the word 'מיקום' (NOT 'מצב') — e.g. 'במיקום האנרגיה החיובית'. IMPORTANT: Always write card names in English (do NOT translate them) — e.g. 'יש לך את הקלף The Fool'."
            : "Use the position name exactly as provided in the list above.";

        const openingContext = question?.trim() ? " in relation to the querent's question" : "";
        const combosCount = matchedCombos.length;
        const formatOpening = combosCount > 0
            ? combosCount === 1
                ? `1. A dedicated CENTERPIECE paragraph about the card combination — this is the FIRST and most important thing the querent reads. Begin with a sentence (in the response language) conveying that the combination of [cards] appearing together is a powerful sign of [meaning]. Then explain in 2-3 vivid sentences what this means concretely in the querent's real life.\n\n2. One opening sentence giving an overall impression of what this reading is about${openingContext}.\n\n3.`
                : `1. A dedicated CENTERPIECE section with EXACTLY ${combosCount} separate paragraphs — ONE PARAGRAPH PER COMBINATION, in the order listed above. This section is the FIRST and most important thing the querent reads. Each paragraph must:\n   - Begin with a sentence (in the response language) conveying that the combination of [cards] appearing together is a powerful sign of [meaning].\n   - Then explain in 2-3 vivid sentences what this specific combination means concretely in the querent's real life.\n   CRITICAL: Every single combination listed above MUST get its own paragraph. Do NOT merge any of them. Do NOT skip any.\n\n2. One opening sentence giving an overall impression of what this reading is about${openingContext}.\n\n3.`
            : `1. One opening sentence giving an overall impression of what this reading is about${openingContext}.\n\n2.`;

        const conclusionStep = combosCount > 0 ? "4." : "3.";
        const conclusionInstruction = combosCount > 0
            ? `2-3 sentences telling the querent what they should focus on or do to fulfil the potential this spread reveals, explicitly tying back to ${combosCount > 1 ? `all ${combosCount} of the card combinations` : "the card combination"} as the central message.`
            : "2-3 sentences telling the querent what they should focus on or do to fulfil the potential this spread reveals. Give direct, personal, actionable guidance.";

        const energyNote = spreadType === "celtic"
            ? "\n\nIMPORTANT: Positions 1 (Positive Energy) and 2 (Negative Energy) are NOT events, NOT feelings, NOT emotions, and NOT internal states of the querent. They are impersonal forces or energies that exist and operate in the querent's life — like currents in the air around them. Do NOT say things like \"you feel\", \"you sense\", \"you are experiencing\", \"you are afraid\", \"you hope\", or any language implying this is about the querent's inner emotional world. Instead speak about the energy itself as a living force: what it is doing, how it is acting, what it is pushing or pulling. Use language like: \"The energy at work here is...\", \"A force of [quality] is operating in your life...\", \"This current is shaping your circumstances by...\", \"The momentum driving your situation is...\". All other positions should still include clear time-frame language." +
              "\n\nSPECIAL RULE FOR POSITION 1 (Positive Energy): If the card here is traditionally difficult or dark (e.g. Death, The Tower, The Devil, 10 of Swords, 9 of Swords, 3 of Swords, 5 of Cups, 8 of Swords, etc.), do NOT soften it, reframe it as gentle, or search for hidden silver linings in the card itself. The card remains exactly as dark and difficult as it is — keep its full weight. The correct interpretation is: the difficult situation or force this card describes is exactly what is working IN the querent's favour. The bad thing that is happening IS the positive energy. The collapse, the loss, the pain, the conflict — whatever this card literally means — THAT is what is benefiting the querent right now, as strange as it sounds. State this plainly: tell the querent that the difficult situation described by this card is the positive force in their life, and explain WHY this particular hardship is actually serving or advancing them." +
              "\n\nRULE FOR POSITION 2 (Negative Energy) — applies to ALL cards: Whatever card appears here, its energy is working AGAINST the querent. This is non-negotiable regardless of whether the card is traditionally good or bad. Crucially: the advantage or benefit this card normally provides is NOT available to the querent — it is being directed against them, or is simply out of reach. If the card is a dark or difficult card, its harsh energy is an opposing force — straightforward. If the card is a positive or fortunate card (e.g. The Star, The Sun, 10 of Cups, Ace of any suit, etc.), do NOT celebrate it. The card's positive power is real, but the querent is on the wrong side of it — it is not helping them, it is working against them. Tell the querent plainly: this energy is opposing you, and whatever advantage this card represents is not yours to use right now." +
              "\n\nPOSITION 10 (Potential) IS THE DESTINATION OF POSITIONS 1 AND 2: Both the positive energy (position 1) and the negative energy (position 2) are active forces driving toward the outcome shown in position 10. When interpreting position 10, explicitly reference both energies and show how each one is pushing toward this potential. Then encourage the querent to consciously amplify the positive energy — because that is the lever that determines whether the best or worst version of this potential is realised."
            : "";

        const positionDescriptions = spreadType === "celtic"
            ? isThirdPerson
                ? `- Positive Energy → what energy or force is actively operating in their life right now, carrying or propelling their situation? Describe the energy itself as a living force — NOT their feelings about it.\n- Negative Energy → what energy or force is opposing, obstructing, or creating friction in their life right now? Describe the energy itself as a living force — NOT their feelings about it.\n- Past → what already happened that started or shaped this situation for them?\n- Present → what are they experiencing or facing right now?\n- Near Future → what is concretely coming for them in the short term?\n- Far Future → where is this heading long-term for them?\n- Inside → what is their private, unspoken emotional truth?\n- Outside → how do they appear to others; how do they present themselves to the world?\n- Fears → what do they dread, and how is that fear showing up?\n- Potential → open by stating clearly what the potential IS — name it directly in one sentence (e.g. "The potential here is [X]"). Then expand: show both the best and worst this situation can produce. Connect it to the two energy positions — both the positive force (position 1) and the negative force (position 2) are pushing toward this outcome. Close with a direct encouragement to lean into the positive energy, because that is what unlocks the best version of this potential.`
                : `- Positive Energy → what energy or force is actively operating in your life right now, carrying or propelling your situation? Describe the energy itself as a living force — NOT your feelings about it.\n- Negative Energy → what energy or force is working against you right now? Whatever card is here — good or bad — its power is opposing you and its advantage is not available to you. Describe this opposing force plainly and directly.\n- Past → what already happened that started or shaped this situation?\n- Present → what are you experiencing or facing right now?\n- Near Future → what is concretely coming for you in the short term?\n- Far Future → where is this heading long-term; what is the ultimate direction?\n- Inside → what is your private, unspoken emotional truth that you may not be voicing?\n- Outside → how do you appear to others; how do you present yourself to the world?\n- Fears → what do you dread, and how is that fear showing up in this situation?\n- Potential → open by stating clearly what the potential IS — name it directly in one sentence (e.g. "The potential here is [X]"). Then expand: show both the best and worst this situation can produce. Connect it to the two energy positions — both the positive force (position 1) and the negative force (position 2) are pushing toward this outcome. Close with a direct encouragement to lean into the positive energy, because that is what unlocks the best version of this potential.`
            : isThirdPerson
                ? `- Past → what already happened that started or shaped this situation for them?\n- Present → what are they experiencing or facing right now?\n- Future → what is coming for them?`
                : `- Past → what already happened that started or shaped this situation?\n- Present → what are you experiencing or facing right now?\n- Future → what is coming for you?`;

        const userMessage = `${questionLine}${confirmedComboSection}${thirdPersonSection}${healthSection}${majorArcanaSection}${suitDominanceSection}${courtCardsSection}${combinationsSection}${personalNotesSection}I have drawn a ${spreadName} tarot spread. Here are the cards:\n\n${cardList}${positionGuide}\n\nWrite the interpretation as a flowing personal narrative in exactly this structure:\n\n${formatOpening} For each card, one paragraph. Open with a sentence (in the response language) saying: in the [position name] position, the card is [card name]. Then write 2–3 sentences interpreting the card through the angle of its position — the position name defines the narrative frame and the specific question the paragraph must answer:\n${positionDescriptions}\nEach paragraph must feel like it is answering the specific question its position poses — not a generic card description with a label attached.\n\n${positionInstruction}${energyNote}\n\n${conclusionStep} End with the EXACT marker below on its own line (do not translate or change it, even when writing in Hebrew), followed by the conclusion text:\n**Conclusion**\n[${conclusionInstruction}]`;

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content:
                            `${language === "he" ? "CRITICAL — LANGUAGE RULE: You MUST write your ENTIRE response in Hebrew. Every sentence, every structural phrase, every opening line must be in Hebrew. Do NOT write any sentence in English. The ONLY exception: keep card names in English (e.g. 'The Fool', 'Nine of Wands'). If an instruction gives you an example sentence in English, translate that sentence into Hebrew — do not copy it literally.\n\n" : ""}You are a wise and insightful tarot reader who speaks in vivid, concrete terms about real life events. Never describe what a card "symbolizes" or "represents" in abstract terms. Instead describe what is actually happening or has happened or will happen in the person's life — real situations, relationships, decisions, turning points. Always anchor each card to a clear time frame: past events that shaped the situation, what is happening right now, what is coming soon, and what lies further ahead. Be explicit: "This happened in your past...", "Right now you are facing...", "In the near future...", "Further down the road...". Ground everything in human experience: heartbreak, career shifts, family tensions, personal growth, financial pressure, new beginnings, loss. Be direct, warm, and personal — speak as if you know their story.${gender === "male" ? " The querent is male. Always speak to them directly in second person — in English say 'you', 'your'; in Hebrew say 'אתה' (you, masculine) and NEVER 'הוא' (he). All Hebrew verbs, adjectives, and participles addressing the querent must be in masculine grammatical form (לשון זכר). Example: say 'אתה עומד בפני' NOT 'הוא עומד בפני'." : gender === "female" ? " The querent is female. Always speak to them directly in second person — in English say 'you', 'your'; in Hebrew say 'את' (you, feminine) and NEVER 'היא' (she). All Hebrew verbs, adjectives, and participles addressing the querent must be in feminine grammatical form (לשון נקבה). Example: say 'את עומדת בפני' NOT 'היא עומדת בפני'." : ""} Respond entirely in ${language === "he" ? "Hebrew" : "English"}.`,
                    },
                    { role: "user", content: userMessage },
                ],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${appConfig.openAiApiKey}`,
                },
            }
        );

        return response.data.choices[0].message.content as string;
    }

    public async followupQuestion(question: string, interpretation: string, language: "en" | "he" = "en"): Promise<string> {
        const langRule = language === "he"
            ? "CRITICAL — LANGUAGE RULE: You MUST write your ENTIRE response in Hebrew. The ONLY exception: keep tarot card names in English.\n\n"
            : "";

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `${langRule}You are a tarot reader who has just completed a reading. The querent has a follow-up question. Answer it based ONLY on what the cards in the reading revealed — do not invent new meanings beyond the reading. Be direct, warm, and personal. 2–3 sentences maximum. Respond entirely in ${language === "he" ? "Hebrew" : "English"}.`,
                    },
                    {
                        role: "user",
                        content: `Here is the tarot reading that was given:\n\n${interpretation}\n\nThe querent now asks: "${question}"\n\nAnswer in 2–3 sentences, drawing only from what this reading revealed.`,
                    },
                ],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${appConfig.openAiApiKey}`,
                },
            }
        );

        return response.data.choices[0].message.content as string;
    }

    public checkCombinations(cardNames: string[], question?: string): import("../dto/tarot.dto").ICombinationMatch[] {
        const nameSet = new Set(cardNames.map(n => n.toLowerCase()));
        const matches: import("../dto/tarot.dto").ICombinationMatch[] = [];
        const q = question?.trim() ?? '';

        const HEALTH_CATEGORY_HE: Record<string, string> = { health: "בריאות", mental_health: "בריאות נפשית" };

        for (const category of tarotCombinations) {
            for (const combo of category.combinations) {
                if (combo.cards.every(c => nameSet.has(c.toLowerCase()))) {
                    if (isAllMajorArcana(combo.cards) || (q && isCategoryRelevant(category.category, q))) {
                        matches.push({ cards: combo.cards, meaning: combo.meaning, meaning_he: combo.meaning_he, source: "general", category: category.category, category_he: category.category_he });
                    }
                }
            }
        }

        for (const combo of healthCombinations) {
            if (combo.cards.every(c => nameSet.has(c.replace(/ Rx$/i, "").toLowerCase()))) {
                if (isAllMajorArcana(combo.cards) || (q && isCategoryRelevant(combo.category, q))) {
                    matches.push({ cards: combo.cards, meaning: combo.meaning, meaning_he: combo.meaning_he, source: "health", category: combo.category, category_he: HEALTH_CATEGORY_HE[combo.category] ?? combo.category });
                }
            }
        }

        return matches;
    }
}

export const tarotService = new TarotService();
