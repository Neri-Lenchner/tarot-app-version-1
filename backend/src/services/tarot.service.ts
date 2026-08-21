import axios from "axios";
import { appConfig } from "../utils/app-config";
import { ISpreadCard } from "../dto/tarot.dto";
import { tarotCombinations } from "../data/combinations";
import { riderWaiteCards } from "../data/riderWaite";
import { healthIndicators } from "../data/health";
import { healthCombinations } from "../data/health-combinations";

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

const HEALTH_KEYWORDS = [
    'health', 'sick', 'illness', 'disease', 'medical', 'doctor', 'hospital',
    'pain', 'body', 'physical', 'heal', 'recover', 'diagnosis', 'symptom',
    'condition', 'wellbeing', 'well-being', 'surgery', 'treatment', 'medication',
    'injury', 'accident', 'depression', 'anxiety', 'mental', 'diet', 'exercise',
    'weight', 'energy', 'fatigue', 'tired', 'chronic', 'בריאות', 'מחלה', 'כאב',
    'רופא', 'טיפול', 'ניתוח', 'עייפות', 'גוף', 'תרופה',
];

function isHealthQuestion(question: string): boolean {
    const q = question.toLowerCase();
    return HEALTH_KEYWORDS.some(kw => q.includes(kw));
}

function findHealthSignals(cards: ISpreadCard[]): string[] {
    const spreadBaseNames = new Set(cards.map(c => c.name.replace(/ Rx$/i, '').toLowerCase()));
    const signals: string[] = [];

    for (const combo of healthCombinations) {
        if (combo.cards.every(c => spreadBaseNames.has(c.replace(/ Rx$/i, '').toLowerCase()))) {
            signals.push(`• Combination detected — ${combo.meaning}`);
        }
    }

    return signals;
}

const THIRD_PERSON_PRONOUNS = ['he ', 'she ', 'him ', 'her ', 'his ', 'they ', 'them ', 'their '];
const THIRD_PERSON_RELATIONSHIPS = [
    'my friend', 'my partner', 'my mother', 'my father', 'my brother', 'my sister',
    'my boyfriend', 'my girlfriend', 'my husband', 'my wife', 'my ex', 'my boss',
    'my colleague', 'my coworker', 'my manager', 'my employee', 'my neighbor',
    'my son', 'my daughter', 'my child', 'my aunt', 'my uncle',
    'my grandmother', 'my grandfather', 'my grandma', 'my grandpa', 'my teacher',
    'my family', 'my ex-husband', 'my ex-wife', 'my ex-boyfriend', 'my ex-girlfriend',
    'my roommate', 'my classmate', 'my mentor', 'my therapist', 'my client',
    'my crush', 'my date', 'my lover', 'my superior', 'my subordinate',
    'about him', 'about her', 'about them', 'affect him', 'affect her', 'affect them',
    'affects him', 'affects her', 'affects them', 'affecting him', 'affecting her',
    // Hebrew
    'החבר שלי', 'החברה שלי', 'האמא שלי', 'האבא שלי', 'האח שלי', 'האחות שלי',
    'הבוס שלי', 'הבן זוג שלי', 'הבת זוג שלי', 'הבעל שלי', 'האישה שלי',
    'הילד שלי', 'הבן שלי', 'הבת שלי', 'הסבתא שלי', 'הסבא שלי',
    'הקולגה שלי', 'השכן שלי', 'הגיס שלי', 'הגיסה שלי',
    'המשפחה שלי', 'הגרוש שלי', 'הגרושה שלי', 'השותף שלי', 'הרום שלי',
];

function isThirdPersonQuestion(question: string): boolean {
    const q = question.toLowerCase();
    if (THIRD_PERSON_PRONOUNS.some(p => q.includes(p) || q.startsWith(p.trim()))) return true;
    if (THIRD_PERSON_RELATIONSHIPS.some(r => q.includes(r.toLowerCase()))) return true;
    return false;
}

const MAJOR_ARCANA = new Set([
    'the fool', 'the magician', 'the high priestess', 'the empress', 'the emperor',
    'the hierophant', 'the lovers', 'the chariot', 'strength', 'the hermit',
    'wheel of fortune', 'justice', 'the hanged man', 'death', 'temperance',
    'the devil', 'the tower', 'the star', 'the moon', 'the sun', 'judgement', 'the world'
]);

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

const CELTIC_POSITION_GUIDE = `
Position guide for the Celtic Cross spread:
1. Positive Energy — The support, people, or forces actively helping the querent in this situation.
2. Negative Energy — The obstacles, interference, or destructive forces working against the querent.
3. Past — Where this situation began; the context and origin of the matter.
4. Present — The core of the situation as it stands right now.
5. Near Future — How things will unfold in the short term if nothing changes.
6. Distant Future — The ultimate direction this situation is heading long-term.
7. Inner World — How the querent truly feels inside; their private emotional reality.
8. Outer World — How the querent presents themselves externally; their public face. Note any contradiction with position 7.
9. Fears — The querent's deepest anxieties about this situation.
10. Potential — The ultimate outcome or highest potential of the situation.
`.trim();

class TarotService {
    public async interpretSpread(spreadType: string, cards: ISpreadCard[], language: "en" | "he" = "en", question?: string): Promise<string> {
        const spreadName = spreadType === "celtic" ? "Celtic Cross" : "Old Gipsy";

        const questionLine = question?.trim()
            ? `The querent's question is: "${question.trim()}"\n\n`
            : "";

        const isThirdPerson = question?.trim() ? isThirdPersonQuestion(question.trim()) : false;
        const thirdPersonSection = isThirdPerson
            ? `=== THIRD-PERSON READING — THIS OVERRIDES ALL OTHER FRAMING ===\nThe querent is asking about ANOTHER PERSON. This spread has been laid for that other person, not for the querent. Treat this exactly as if the OTHER PERSON sat down and asked their own question — every card, every position, every sentence describes THEIR life, THEIR emotions, THEIR past, THEIR future, THEIR fears.\n\nMANDATORY RULES — violating any of these is an error:\n1. NEVER say "you are", "you feel", "you have", "your situation" — these phrases must NEVER appear. The querent is the observer, not the subject.\n2. ALWAYS refer to the subject as "they", "them", "their", or by the specific relationship mentioned (e.g. "your partner", "your mother", "your friend"). If no relationship was named, use "the person you asked about".\n3. Every card position describes what is happening in the OTHER PERSON's life. "Past" = their past. "Fears" = their fears. "Inner World" = their inner world. "Potential" = their potential outcome.\n4. The querent appears in the reading ONLY as context — e.g. "their relationship with you", "how they feel about you". They are never the main subject.\n5. Do NOT slip. Read through your response before finishing — if you wrote "you" referring to the querent as the main subject anywhere, replace it.\n\nExample correct phrasing: "In the Past position, your partner has gone through...", "Right now, they are dealing with...", "Their deepest fear is...", "The potential outcome for the person you asked about is..."\n===\n\n`
            : "";

        const isHealth = question?.trim() ? isHealthQuestion(question.trim()) : false;

        // Build per-card health body area lookup (court cards + major arcana only)
        const COURT_PREFIXES = ['King of', 'Queen of', 'Knight of', 'Page of'];
        function isCourtOrMajor(name: string): boolean {
            const base = name.replace(/ Rx$/i, '');
            return COURT_PREFIXES.some(p => base.startsWith(p)) || MAJOR_ARCANA.has(base.toLowerCase());
        }

        const healthCardBodyMap = new Map<string, string>();
        if (isHealth) {
            for (const card of cards) {
                if (!isCourtOrMajor(card.name)) continue;
                const baseName = card.name.replace(/ Rx$/i, '').toLowerCase();
                const match = healthIndicators.find(ind =>
                    ind.cards.some(c => c.replace(/ Rx$/i, '').toLowerCase() === baseName)
                );
                healthCardBodyMap.set(baseName, match ? match.health : '0');
            }
        }

        const cardList = cards
            .map((card, i) => {
                const data = riderWaiteCards.find(c => c.name.toLowerCase() === card.name.toLowerCase());
                const baseName = card.name.replace(/ Rx$/i, '').toLowerCase();
                const bodyArea = healthCardBodyMap.get(baseName);
                const healthNote = bodyArea !== undefined
                    ? ` [body area: ${bodyArea}]`
                    : '';
                return `${i + 1}. ${card.position} — ${card.name}${healthNote}: ${data?.meaning_up ?? ""}`;
            })
            .join("\n");

        const healthSignals = isHealth ? findHealthSignals(cards) : [];
        const healthSection = isHealth
            ? `=== HEALTH READING — TEST MODE ===\nIGNORE ALL OTHER FORMATTING INSTRUCTIONS. Do not write any interpretation. For each card in the list, output ONE line only in this exact format:\n[position name]: [body area value from the tag]\nIf a card has no [body area] tag, write:\n[position name]: 0\nNothing else. No paragraphs. No conclusion. No opening sentence. Just these lines.\n===\n\n`
            : "";

        const majorArcanaSection = spreadType === "celtic" ? getMajorArcanaSection(cards) : "";

        const matchedCombos = findMatchingCombinations(cards);
        const combinationsSection = matchedCombos.length > 0
            ? `=== CRITICAL — ESTABLISHED CARD COMBINATIONS DETECTED IN THIS SPREAD ===\nThe following well-known tarot combinations appear in the drawn cards. These are the SINGLE MOST IMPORTANT finding of this reading. They must be explicitly named, explained in depth, and treated as the central message the cards are delivering — above and beyond any individual card meaning:\n\n${matchedCombos.join("\n")}\n\nDo NOT bury these in passing. They are the headline of this reading.\n===\n\n`
            : "";

        const positionGuide = spreadType === "celtic" ? `\n\n${CELTIC_POSITION_GUIDE}` : "";

        const positionInstruction = language === "he"
            ? "Translate each position name into Hebrew (e.g. Past→עבר, Present→הווה, Future→עתיד, Positive Energy→אנרגיה חיובית, Negative Energy→אנרגיה שלילית, Near Future→עתיד קרוב, Distant Future→עתיד רחוק, Inner World→עולם פנימי, Outer World→עולם חיצוני, Fears→פחדים, Potential→פוטנציאל). Do NOT write 'Position 1', 'Position 2', etc. When writing 'In the X position' use the word 'מיקום' (NOT 'מצב') — e.g. 'במיקום האנרגיה החיובית'. IMPORTANT: Always write card names in English (do NOT translate them) — e.g. 'יש לך את הקלף The Fool'."
            : "Use the position name exactly as provided in the list above.";

        const openingContext = question?.trim() ? " in relation to the querent's question" : "";
        const combosCount = matchedCombos.length;
        const formatOpening = combosCount > 0
            ? combosCount === 1
                ? `1. A dedicated CENTERPIECE paragraph about the card combination — this is the FIRST and most important thing the querent reads. Start with: "Importantly, the combination of [cards] appearing together in your spread is a powerful sign of [meaning]." Explain in 2-3 vivid sentences what this means concretely in the querent's real life.\n\n2. One opening sentence giving an overall impression of what this reading is about${openingContext}.\n\n3.`
                : `1. A dedicated CENTERPIECE section with EXACTLY ${combosCount} separate paragraphs — ONE PARAGRAPH PER COMBINATION, in the order listed above. This section is the FIRST and most important thing the querent reads. Each paragraph must:\n   - Begin: "Importantly, the combination of [cards] appearing together in your spread is a powerful sign of [meaning]."\n   - Then explain in 2-3 vivid sentences what this specific combination means concretely in the querent's real life.\n   CRITICAL: Every single combination listed above MUST get its own paragraph. Do NOT merge any of them. Do NOT skip any.\n\n2. One opening sentence giving an overall impression of what this reading is about${openingContext}.\n\n3.`
            : `1. One opening sentence giving an overall impression of what this reading is about${openingContext}.\n\n2.`;

        const conclusionStep = combosCount > 0 ? "4." : "3.";
        const conclusionInstruction = combosCount > 0
            ? `2-3 sentences telling the querent what they should focus on or do to fulfil the potential this spread reveals, explicitly tying back to ${combosCount > 1 ? `all ${combosCount} of the card combinations` : "the card combination"} as the central message.`
            : "2-3 sentences telling the querent what they should focus on or do to fulfil the potential this spread reveals. Give direct, personal, actionable guidance.";

        const energyNote = spreadType === "celtic"
            ? "\n\nIMPORTANT: Positions 1 (Positive Energy) and 2 (Negative Energy) are NOT events — they are active forces or energies currently surrounding the querent. Do NOT use time-frame language for these two positions. Instead describe them as forces, influences, or currents that are present and at work right now (e.g. \"The energy supporting you is...\", \"The force working against you is...\"). All other positions should still include clear time-frame language." +
              "\n\nSPECIAL RULE FOR POSITION 1 (Positive Energy): If the card here is traditionally difficult or dark (e.g. Death, The Tower, The Devil, 10 of Swords, 9 of Swords, 3 of Swords, 5 of Cups, 8 of Swords, etc.), do NOT soften it or pretend it is gentle. The card remains exactly as dark and difficult as it is. Explain how this harsh energy is nonetheless functioning as a supporting force — it may be compelling the querent to face an unavoidable truth, stripping away illusions, forcing a necessary ending, or pushing them through pain toward something real. Acknowledge directly that this 'support' will feel uncomfortable or even painful. The message is: this hard thing is on your side — not because it is easy, but because it is necessary." +
              "\n\nSPECIAL RULE FOR POSITION 2 (Negative Energy): If the card here is traditionally positive or fortunate (e.g. The Star, The Sun, The World, 10 of Cups, 10 of Pentacles, Ace of any suit, 6 of Wands, etc.), do NOT celebrate it or treat it as good news. The card remains exactly as bright and appealing as it is. Explain how this seemingly positive energy is functioning as the obstacle or interference — it may be creating false hope, encouraging complacency, making the querent cling to a comfortable illusion, or tempting them away from what they truly need to do. Acknowledge that the querent will likely perceive this force as welcome and pleasant — that is precisely what makes it dangerous. The message is: this good-looking thing is working against you, not because it is evil, but because it is a distraction or a trap." +
              "\n\nCRITICAL RULE FOR ALL CARDS IN POSITION 2 (applies to every card, dark or bright): Do NOT stay abstract or philosophical. You must name the SPECIFIC CONCRETE BEHAVIOR or impulse this card represents that is working against the querent. Tell them exactly what to avoid or resist. Examples: if the card is Death — warn them explicitly that the urge to burn everything down, make a total sudden break, or end things completely is the enemy right now; partial change is possible but total destruction is not the answer. If the card is The Tower — warn against forcing a dramatic collapse. If the card is The Devil — warn against a specific compulsion or attachment. If the card is a Sword card — name the specific mental pattern to stop. The querent should finish reading this paragraph knowing exactly what concrete action or impulse to resist — not just that 'a challenging energy surrounds them'."
            : "";

        const cardFormatInstruction = isThirdPerson
            ? `For each card, one paragraph using this exact phrasing:\n"In the [position name] position, the person you asked about has the '[card name]' card, which means [2-3 sentences: describe what is actually happening in THEIR life — use 'they', 'them', 'their' throughout. Clearly state whether this is from their past, their present, their near future, or their distant future. Do NOT use 'you' to refer to the subject at any point in this paragraph]."`
            : `For each card, one paragraph using this exact phrasing:\n"In the [position name] position you have the '[card name]' card, which means [2-3 sentences: real event or energy this position reveals, clearly stating whether it is from the past, the present, the near future, or the distant future]."`;

        const userMessage = `${questionLine}${thirdPersonSection}${healthSection}${majorArcanaSection}${combinationsSection}I have drawn a ${spreadName} tarot spread. Here are the cards:\n\n${cardList}${positionGuide}\n\nWrite the interpretation as a flowing personal narrative in exactly this structure:\n\n${formatOpening} ${cardFormatInstruction}\n\n${positionInstruction}${energyNote}\n\n${conclusionStep} End with:\n**Conclusion**\n[${conclusionInstruction}]`;

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: isThirdPerson
                            ? `You are a wise and insightful tarot reader. This is a THIRD-PERSON reading — the cards describe another person's life, not the querent's. Every single card and position refers to THAT OTHER PERSON. Speak in vivid, concrete terms about what is actually happening in THEIR life. Always use 'they', 'them', 'their' for the subject. The word 'you' refers ONLY to the querent as observer — NEVER as the subject of the cards. Never write "you are facing", "you feel", "you have" to describe the reading subject — always say "they are facing", "they feel", "they have". Anchor each card to a clear time frame in THEIR life: their past, their present, what is coming for them. Be direct and personal — speak as if you know their story. Respond entirely in ${language === "he" ? "Hebrew" : "English"}.`
                            : `You are a wise and insightful tarot reader who speaks in vivid, concrete terms about real life events. Never describe what a card "symbolizes" or "represents" in abstract terms. Instead describe what is actually happening or has happened or will happen in the person's life — real situations, relationships, decisions, turning points. Always anchor each card to a clear time frame: past events that shaped the situation, what is happening right now, what is coming soon, and what lies further ahead. Be explicit: "This happened in your past...", "Right now you are facing...", "In the near future...", "Further down the road...". Ground everything in human experience: heartbreak, career shifts, family tensions, personal growth, financial pressure, new beginnings, loss. Be direct, warm, and personal — speak as if you know their story. Respond entirely in ${language === "he" ? "Hebrew" : "English"}.`,
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

    public checkCombinations(cardNames: string[]): import("../dto/tarot.dto").ICombinationMatch[] {
        const nameSet = new Set(cardNames.map(n => n.toLowerCase()));
        const matches: import("../dto/tarot.dto").ICombinationMatch[] = [];

        for (const category of tarotCombinations) {
            for (const combo of category.combinations) {
                if (combo.cards.every(c => nameSet.has(c.toLowerCase()))) {
                    matches.push({ cards: combo.cards, meaning: combo.meaning, source: "general", category: category.category });
                }
            }
        }

        for (const combo of healthCombinations) {
            if (combo.cards.every(c => nameSet.has(c.replace(/ Rx$/i, "").toLowerCase()))) {
                matches.push({ cards: combo.cards, meaning: combo.meaning, source: "health", category: combo.category });
            }
        }

        return matches;
    }
}

export const tarotService = new TarotService();
