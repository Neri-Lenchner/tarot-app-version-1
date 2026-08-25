import { ISpreadCard } from "../dto/tarot.dto";
import { tarotCombinations } from "../data/combinations";
import { personalCardNotes } from "../data/personal-card-notes";
import { healthIndicators } from "../data/health";
import {
    HEALTH_KEYWORDS,
    THIRD_PERSON_PRONOUNS,
    THIRD_PERSON_RELATIONSHIPS,
    COURT_CARDS,
    MAJOR_ARCANA,
    CATEGORY_KEYWORDS,
    Adjacency,
    CELTIC_POSITION_INDEX,
    CELTIC_ADJACENCY,
    THREE_CARDS_POSITION_INDEX,
    THREE_CARDS_ADJACENCY,
} from "../utils/prompt-constants";

// ── Card Combinations ───────────────────────────────────────────────────────
// Same connectivity rule as frontend/src/services/CombinationsService.ts —
// a combination only counts if its cards are adjacent to each other in the
// spread, not merely present anywhere in it.
function isConnectedInSpread(comboCards: string[], cards: ISpreadCard[], positionIndex: Record<string, number>, adjacency: Adjacency): boolean {
    const positions: number[] = [];
    for (const comboCardName of comboCards) {
        const card = cards.find(
            c => c.name.replace(/ Rx$/i, '').toLowerCase() === comboCardName.replace(/ Rx$/i, '').toLowerCase()
        );
        const idx = card ? positionIndex[card.position.toLowerCase()] : undefined;
        if (idx === undefined) return false;
        positions.push(idx);
    }
    if (positions.length <= 1) return true;

    const posSet = new Set(positions);
    const visited = new Set<number>([positions[0]]);
    const queue = [positions[0]];
    while (queue.length > 0) {
        const curr = queue.shift()!;
        for (const neighbor of (adjacency[curr] ?? [])) {
            if (posSet.has(neighbor) && !visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
    return visited.size === posSet.size;
}

export function findMatchingCombinations(cards: ISpreadCard[], spreadType: string): string[] {
    const nameSet = new Set(cards.map(c => c.name.toLowerCase()));
    const positionIndex = spreadType === "celtic" ? CELTIC_POSITION_INDEX : THREE_CARDS_POSITION_INDEX;
    const adjacency = spreadType === "celtic" ? CELTIC_ADJACENCY : THREE_CARDS_ADJACENCY;
    const matches: string[] = [];
    for (const category of tarotCombinations) {
        for (const combo of category.combinations) {
            if (combo.cards.every(name => nameSet.has(name.toLowerCase())) && isConnectedInSpread(combo.cards, cards, positionIndex, adjacency)) {
                matches.push(`• ${combo.cards.join(" + ")} → ${combo.meaning} [${category.category}]`);
            }
        }
    }
    return matches;
}

// ── Health Detection ────────────────────────────────────────────────────────
export function isHealthQuestion(question: string): boolean {
    const q = question.toLowerCase();
    return HEALTH_KEYWORDS.some(kw => q.includes(kw));
}

export function findHealthIndicators(cards: ISpreadCard[]): string[] {
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

// ── Third-Person Detection ──────────────────────────────────────────────────
export function isThirdPersonQuestion(question: string): boolean {
    const q = question.toLowerCase();
    if (THIRD_PERSON_PRONOUNS.some(p => q.includes(p) || q.startsWith(p.trim()))) return true;
    if (THIRD_PERSON_RELATIONSHIPS.some(r => q.includes(r.toLowerCase()))) return true;
    return false;
}

// ── Court Cards ──────────────────────────────────────────────────────────────
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

export function getCourtCardsSection(cards: ISpreadCard[], gender?: "male" | "female", spreadType?: string, question?: string): string {
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

// ── Suit Dominance ───────────────────────────────────────────────────────────
const SUIT_WORLDS: Record<string, { name: string; domain: string }> = {
    cups:      { name: 'Cups',      domain: 'the emotional world — relationships, feelings, intuition, and the heart' },
    wands:     { name: 'Wands',     domain: 'the inspirational world — passion, creativity, ambition, and inner drive' },
    swords:    { name: 'Swords',    domain: 'the mental world — thoughts, decisions, conflict, and the power of the mind' },
    pentacles: { name: 'Pentacles', domain: 'the material world — money, career, physical reality, and practical matters' },
};

export function getSuitDominanceSection(cards: ISpreadCard[]): string {
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

// ── Major Arcana ─────────────────────────────────────────────────────────────
export function isAllMajorArcana(cards: string[]): boolean {
    return cards.every(c => MAJOR_ARCANA.has(c.replace(/ Rx$/i, '').toLowerCase()));
}

export function isCategoryRelevant(category: string, question: string): boolean {
    const q = question.toLowerCase();
    return (CATEGORY_KEYWORDS[category] ?? []).some(kw => q.includes(kw.toLowerCase()));
}

export function getMajorArcanaSection(cards: ISpreadCard[]): string {
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

// ── Personal Card Notes ──────────────────────────────────────────────────────
export function getPersonalNotesSection(cards: ISpreadCard[]): string {
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
