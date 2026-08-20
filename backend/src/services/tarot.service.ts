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

const THIRD_PERSON_PRONOUNS = ['he ', 'she ', 'him ', 'her ', 'his ', 'they ', 'them ', 'their '];
const THIRD_PERSON_RELATIONSHIPS = [
    'my friend', 'my partner', 'my mother', 'my father', 'my brother', 'my sister',
    'my boyfriend', 'my girlfriend', 'my husband', 'my wife', 'my ex', 'my boss',
    'my colleague', 'my coworker', 'my manager', 'my employee', 'my neighbor',
    'my son', 'my daughter', 'my child', 'my aunt', 'my uncle',
    'my grandmother', 'my grandfather', 'my grandma', 'my grandpa', 'my teacher',
    'about him', 'about her', 'about them',
    // Hebrew
    'החבר שלי', 'החברה שלי', 'האמא שלי', 'האבא שלי', 'האח שלי', 'האחות שלי',
    'הבוס שלי', 'הבן זוג שלי', 'הבת זוג שלי', 'הבעל שלי', 'האישה שלי',
    'הילד שלי', 'הבן שלי', 'הבת שלי', 'הסבתא שלי', 'הסבא שלי',
    'הקולגה שלי', 'השכן שלי', 'הגיס שלי', 'הגיסה שלי',
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
        const spreadName = spreadType === "celtic" ? "Celtic Cross" : "Three Cards";

        const cardList = cards
            .map((card, i) => {
                const data = riderWaiteCards.find(c => c.name.toLowerCase() === card.name.toLowerCase());
                return `${i + 1}. ${card.position} — ${card.name}: ${data?.meaning_up ?? ""}`;
            })
            .join("\n");

        const questionLine = question?.trim()
            ? `The querent's question is: "${question.trim()}"\n\n`
            : "";

        const isThirdPerson = question?.trim() ? isThirdPersonQuestion(question.trim()) : false;
        const thirdPersonSection = isThirdPerson
            ? `=== THIRD-PERSON READING ===\nThe querent is asking about ANOTHER PERSON, not about themselves. Adjust your ENTIRE interpretation accordingly:\n- The spread reflects that OTHER PERSON's life, situation, emotions, and trajectory — not the querent's own.\n- Speak to the querent as the observer. Refer to the subject as "the person you asked about", "they", or by the relationship if it was mentioned (e.g. "your friend", "your partner", "your mother").\n- Every card, position, and event describes what is happening in THAT PERSON's life. Never say "you are facing" — say "the person you asked about is facing".\n- Example phrasing: "In the Past position, the person you asked about has gone through...", "Right now, they are dealing with...", "In the near future, your partner will likely..."\n===\n\n`
            : "";

        const healthMatches = question?.trim() && isHealthQuestion(question.trim())
            ? findHealthIndicators(cards)
            : [];
        const healthSection = healthMatches.length > 0
            ? `=== HEALTH QUESTION DETECTED — READ THIS FIRST ===\nThe querent is asking about health. The cards in this spread indicate the following health conditions:\n\n${healthMatches.join("\n")}\n\nThese health indicators carry the HIGHEST priority. Lead your entire interpretation with the health dimension. Be specific, compassionate, and direct about what the cards are showing regarding the querent's physical or mental wellbeing.\n===\n\n`
            : "";

        const majorArcanaSection = getMajorArcanaSection(cards);

        const matchedCombos = findMatchingCombinations(cards);
        const combinationsSection = matchedCombos.length > 0
            ? `=== CRITICAL — ESTABLISHED CARD COMBINATIONS DETECTED IN THIS SPREAD ===\nThe following well-known tarot combinations appear in the drawn cards. These are the SINGLE MOST IMPORTANT finding of this reading. They must be explicitly named, explained in depth, and treated as the central message the cards are delivering — above and beyond any individual card meaning:\n\n${matchedCombos.join("\n")}\n\nDo NOT bury these in passing. They are the headline of this reading.\n===\n\n`
            : "";

        const positionGuide = spreadType === "celtic" ? `\n\n${CELTIC_POSITION_GUIDE}` : "";

        const positionInstruction = language === "he"
            ? "Translate each position name into Hebrew (e.g. Past→עבר, Present→הווה, Future→עתיד, Positive Energy→אנרגיה חיובית, Negative Energy→אנרגיה שלילית, Near Future→עתיד קרוב, Distant Future→עתיד רחוק, Inner World→עולם פנימי, Outer World→עולם חיצוני, Fears→פחדים, Potential→פוטנציאל). Do NOT write 'Position 1', 'Position 2', etc. When writing 'In the X position' use the word 'מיקום' (NOT 'מצב') — e.g. 'במיקום האנרגיה החיובית'. IMPORTANT: Always write card names in English (do NOT translate them) — e.g. 'יש לך את הקלף The Fool'."
            : "Use the position name exactly as provided in the list above.";

        const openingContext = question?.trim() ? " in relation to the querent's question" : "";
        const formatOpening = matchedCombos.length > 0
            ? `1. A dedicated CENTERPIECE paragraph about the card combination(s) — this is the FIRST and most important thing the querent reads. Start with: "Importantly, the combination of [cards] appearing together in your spread is a powerful sign of [meaning]." Explain in 2-3 vivid sentences what this means concretely in the querent's real life.\n\n2. One opening sentence giving an overall impression of what this reading is about${openingContext}.\n\n3.`
            : `1. One opening sentence giving an overall impression of what this reading is about${openingContext}.\n\n2.`;

        const conclusionStep = matchedCombos.length > 0 ? "4." : "3.";
        const conclusionInstruction = matchedCombos.length > 0
            ? "2-3 sentences telling the querent what they should focus on or do to fulfil the potential this spread reveals, explicitly tying back to the card combination(s) as the central message."
            : "2-3 sentences telling the querent what they should focus on or do to fulfil the potential this spread reveals. Give direct, personal, actionable guidance.";

        const energyNote = spreadType === "celtic"
            ? "\n\nIMPORTANT: Positions 1 (Positive Energy) and 2 (Negative Energy) are NOT events — they are active forces or energies currently surrounding the querent. Do NOT use time-frame language for these two positions. Instead describe them as forces, influences, or currents that are present and at work right now (e.g. \"The energy supporting you is...\", \"The force working against you is...\"). All other positions should still include clear time-frame language."
            : "";

        const userMessage = `${questionLine}${thirdPersonSection}${healthSection}${majorArcanaSection}${combinationsSection}I have drawn a ${spreadName} tarot spread. Here are the cards:\n\n${cardList}${positionGuide}\n\nWrite the interpretation as a flowing personal narrative in exactly this structure:\n\n${formatOpening} For each card, one paragraph using this exact phrasing:\n"In the [position name] position you have the '[card name]' card, which means [2-3 sentences: real event or energy this position reveals, clearly stating whether it is from the past, the present, the near future, or the distant future]."\n\n${positionInstruction}${energyNote}\n\n${conclusionStep} End with:\n**Conclusion**\n[${conclusionInstruction}]`;

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content:
                            `You are a wise and insightful tarot reader who speaks in vivid, concrete terms about real life events. Never describe what a card "symbolizes" or "represents" in abstract terms. Instead describe what is actually happening or has happened or will happen in the person's life — real situations, relationships, decisions, turning points. Always anchor each card to a clear time frame: past events that shaped the situation, what is happening right now, what is coming soon, and what lies further ahead. Be explicit: "This happened in your past...", "Right now you are facing...", "In the near future...", "Further down the road...". Ground everything in human experience: heartbreak, career shifts, family tensions, personal growth, financial pressure, new beginnings, loss. Be direct, warm, and personal — speak as if you know their story. Respond entirely in ${language === "he" ? "Hebrew" : "English"}.`,
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
