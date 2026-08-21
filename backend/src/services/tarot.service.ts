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

const GROUP_KEYWORDS = [
    'my family', 'my parents', 'my children', 'my kids', 'my siblings',
    'my brothers', 'my sisters', 'my relatives', 'my in-laws', 'my grandparents',
    'my friends', 'my colleagues', 'my coworkers', 'my team', 'my classmates',
    'both of them', 'all of them', 'the whole family', 'the family',
    // Hebrew
    'המשפחה שלי', 'ההורים שלי', 'הילדים שלי', 'האחים שלי', 'הקרובים שלי',
    'החברים שלי', 'הקולגות שלי', 'הצוות שלי', 'כולם', 'שניהם',
];

function isGroupQuestion(question: string): boolean {
    const q = question.toLowerCase();
    return GROUP_KEYWORDS.some(kw => q.includes(kw.toLowerCase()));
}

const COURT_PREFIXES = ['King of', 'Queen of', 'Knight of', 'Page of'];
function isCourtOrMajor(name: string): boolean {
    const base = name.replace(/ Rx$/i, '');
    return COURT_PREFIXES.some(p => base.startsWith(p)) || MAJOR_ARCANA.has(base.toLowerCase());
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

    if (ratio >= 0.65) {
        return `=== PROFOUND FATE READING — OPEN WITH THIS ===\n${count}/${total} cards are Major Arcana: ${names}.\nOpen with a dedicated paragraph: tell the querent their spread is dominated by Major Arcana — they stand at a genuine karmic crossroads, a life-defining moment. Fate-level forces are at work. Use language like "destiny", "karmic turning point". Each Major Arcana card gets deeper, more emphatic treatment than any Minor Arcana.\n===\n\n`;
    }
    if (ratio >= 0.40 || (total <= 3 && count >= 2)) {
        return `=== DESTINY MARK ===\n${count}/${total} cards are Major Arcana: ${names}.\nEarly in your interpretation, note that this significant Major Arcana presence signals real karmic weight — forces larger than daily life are involved. Each Major Arcana card gets noticeably deeper treatment than Minor Arcana.\n===\n\n`;
    }
    return `Note: Major Arcana present (give these more depth and emphasis): ${names}.\n\n`;
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
        const isGroup = isThirdPerson && spreadType === "celtic" && (question?.trim() ? isGroupQuestion(question.trim()) : false);

        const thirdPersonSection = isThirdPerson
            ? `=== THIRD-PERSON READING ===\nSubject: ${isGroup ? "the family/group" : "the other person"} — NOT the querent.\n1. Never use "you/your" for the subject. Use "they/them/their" or the relationship name ("your mother", "your partner").\n2. Every position describes the subject's life — their past, their fears, their inner world, their potential.\n3. The querent appears only as context ("their relationship with you", "how they feel about you").${isGroup ? `\n4. EXCEPTION — positions 7–10 (Inner World, Outer World, Fears, Potential): these describe THE QUERENT, not the group. Use "you/your" for these four positions only. Positions 1–6 remain about the group.` : ""}\n===\n\n`
            : "";

        const isHealth = question?.trim() ? isHealthQuestion(question.trim()) : false;

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
                return `${i + 1}. ${card.position} — ${card.name}: ${data?.meaning_up ?? ""}`;
            })
            .join("\n");

        const healthSignals = isHealth ? findHealthSignals(cards) : [];
        const healthSection = isHealth
            ? `=== HEALTH READING ===\nThe querent is asking about health. Lead your interpretation with the health dimension. Do NOT diagnose — frame everything as the cards pointing toward areas that deserve awareness.${healthSignals.length > 0 ? `\n${healthSignals.join("\n")}` : ""}${language === "he" ? " Write in Hebrew." : ""}\n===\n\n`
            : "";

        const majorArcanaSection = spreadType === "celtic" ? getMajorArcanaSection(cards) : "";

        const matchedCombos = findMatchingCombinations(cards);
        const combinationsSection = matchedCombos.length > 0
            ? `=== CARD COMBINATIONS — HIGHEST PRIORITY ===\n${matchedCombos.join("\n")}\nThese combinations are the central message of this reading. Name each one explicitly, explain it in depth — above individual card meanings.\n===\n\n`
            : "";

        const positionGuide = spreadType === "celtic" ? `\n\n${CELTIC_POSITION_GUIDE}` : "";

        const positionInstruction = language === "he"
            ? "Translate each position name into Hebrew (e.g. Past→עבר, Present→הווה, Future→עתיד, Positive Energy→אנרגיה חיובית, Negative Energy→אנרגיה שלילית, Near Future→עתיד קרוב, Distant Future→עתיד רחוק, Inner World→עולם פנימי, Outer World→עולם חיצוני, Fears→פחדים, Potential→פוטנציאל). Do NOT write 'Position 1', 'Position 2', etc. When writing 'In the X position' use the word 'מיקום' (NOT 'מצב') — e.g. 'במיקום האנרגיה החיובית'. IMPORTANT: Always write card names in English (do NOT translate them) — e.g. 'יש לך את הקלף The Fool'."
            : "Use the position name exactly as provided in the list above.";

        const openingContext = question?.trim() ? " in relation to the querent's question" : "";
        const combosCount = matchedCombos.length;

        const comboStartPhrase = language === "he"
            ? `חשוב לציין, השילוב של [cards] המופיעים יחד בפריסה שלך הוא סימן חזק ל[meaning].`
            : `Importantly, the combination of [cards] appearing together in your spread is a powerful sign of [meaning].`;
        const comboExplainPhrase = language === "he"
            ? `הסבר ב-2-3 משפטים חיים מה משמעות הדבר בחיים האמיתיים של המגלה.`
            : `Explain in 2-3 vivid sentences what this means concretely in the querent's real life.`;
        const openingSentencePhrase = language === "he"
            ? `משפט פתיחה אחד הנותן רושם כללי על מה שהפריסה מגלה${openingContext}.`
            : `One opening sentence giving an overall impression of what this reading is about${openingContext}.`;

        const formatOpening = combosCount > 0
            ? combosCount === 1
                ? `1. A dedicated CENTERPIECE paragraph about the card combination — this is the FIRST and most important thing the querent reads. Start with: "${comboStartPhrase}" ${comboExplainPhrase}\n\n2. ${openingSentencePhrase}\n\n3.`
                : `1. A dedicated CENTERPIECE section with EXACTLY ${combosCount} separate paragraphs — ONE PARAGRAPH PER COMBINATION, in the order listed above. This section is the FIRST and most important thing the querent reads. Each paragraph must:\n   - Begin: "${comboStartPhrase}"\n   - Then ${comboExplainPhrase}\n   CRITICAL: Every single combination listed above MUST get its own paragraph. Do NOT merge any of them. Do NOT skip any.\n\n2. ${openingSentencePhrase}\n\n3.`
            : `1. ${openingSentencePhrase}\n\n2.`;

        const conclusionStep = combosCount > 0 ? "4." : "3.";
        const conclusionInstruction = combosCount > 0
            ? `2-3 sentences telling the querent what they should focus on or do to fulfil the potential this spread reveals, explicitly tying back to ${combosCount > 1 ? `all ${combosCount} of the card combinations` : "the card combination"} as the central message.`
            : "2-3 sentences telling the querent what they should focus on or do to fulfil the potential this spread reveals. Give direct, personal, actionable guidance.";

        const energyNote = spreadType === "celtic"
            ? `\n\nPositions 1 & 2 are active forces/energies — NOT events. No time-frame language. Describe as currents at work right now.\n\nPosition 1 (Positive Energy) — dark card: do NOT soften it. Explain how this harsh energy supports the querent by necessity — forcing truth, stripping illusions, compelling growth through pain. Say clearly it feels uncomfortable. "This hard thing is on your side — not because it is easy, but because it is necessary."\n\nPosition 2 (Negative Energy) — bright card: do NOT celebrate it. Explain how this positive-looking energy works against the querent — false hope, complacency, or tempting distraction. The querent sees it as welcome; that is exactly what makes it dangerous.\n\nAll Position 2 cards: name the SPECIFIC concrete impulse to resist — not abstract. Example: Death → "resist the urge to end everything completely"; Devil → name the specific compulsion; Sword card → name the exact mental pattern to stop. The querent must finish knowing what exactly to resist.`
            : "";

        const cardFormatInstruction = isThirdPerson
            ? isGroup
                ? `For cards in positions 1–6: one paragraph using this phrasing:\n"In the [position name] position, the family/group has the '[card name]' card, which means [2-3 sentences using they/them/their]."\nFor cards in positions 7–10 (Inner World, Outer World, Fears, Potential): one paragraph using this phrasing:\n"In the [position name] position you have the '[card name]' card, which means [2-3 sentences using you/your — these positions describe the querent]."`
                : `For each card, one paragraph using this exact phrasing:\n"In the [position name] position, the person you asked about has the '[card name]' card, which means [2-3 sentences: describe what is actually happening in THEIR life — use 'they', 'them', 'their' throughout. Clearly state whether this is from their past, their present, their near future, or their distant future. Do NOT use 'you' to refer to the subject at any point in this paragraph]."`
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
                            ? `You are a wise tarot reader giving a third-person reading — every card describes the other person's life, not the querent's. Use "they/them/their" for the subject. Speak concretely about their real situations, relationships, and turning points. Anchor each card to a time frame in their life. Be direct and personal. Respond in ${language === "he" ? "Hebrew" : "English"}.`
                            : `You are a wise tarot reader who speaks in vivid, concrete terms — not symbols or abstractions. Describe what is actually happening in the person's life: real situations, relationships, decisions, turning points. Anchor each card to a clear time frame ("In your past...", "Right now...", "Soon...", "Further ahead..."). Be direct, warm, and personal. Respond in ${language === "he" ? "Hebrew" : "English"}.`,
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

        const aiText = response.data.choices[0].message.content as string;

        if (isHealth && healthCardBodyMap.size > 0) {
            const bodyAreaLines = cards
                .map(card => {
                    const baseName = card.name.replace(/ Rx$/i, '').toLowerCase();
                    const bodyArea = healthCardBodyMap.get(baseName);
                    if (!bodyArea) return null;
                    return `${card.name} (${card.position}) — ${language === "he" ? "בדרך כלל קשור ל" : "usually related to"}: ${bodyArea}`;
                })
                .filter(Boolean) as string[];

            if (bodyAreaLines.length > 0) {
                const header = language === "he" ? "**אזורי גוף הקשורים לפריסה זו:**" : "**Health body areas in this spread:**";
                return `${header}\n${bodyAreaLines.join("\n")}\n\n---\n\n${aiText}`;
            }
        }

        return aiText;
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
