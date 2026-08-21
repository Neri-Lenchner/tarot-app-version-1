import axios from "axios";
import { appConfig } from "../utils/app-config";
import { ISpreadCard } from "../dto/tarot.dto";
import { tarotCombinations } from "../data/combinations";
import { riderWaiteCards } from "../data/riderWaite";
import { healthCombinations } from "../data/health-combinations";

interface MatchedCombo { cards: string[]; meaning: string; category: string; }

function findMatchingCombinations(cards: ISpreadCard[]): MatchedCombo[] {
    const nameSet = new Set(cards.map(c => c.name.toLowerCase()));
    const matches: MatchedCombo[] = [];
    for (const category of tarotCombinations) {
        for (const combo of category.combinations) {
            if (combo.cards.every(name => nameSet.has(name.toLowerCase()))) {
                matches.push({ cards: combo.cards, meaning: combo.meaning, category: category.category });
            }
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


const MAJOR_ARCANA = new Set([
    'the fool', 'the magician', 'the high priestess', 'the empress', 'the emperor',
    'the hierophant', 'the lovers', 'the chariot', 'strength', 'the hermit',
    'wheel of fortune', 'justice', 'the hanged man', 'death', 'temperance',
    'the devil', 'the tower', 'the star', 'the moon', 'the sun', 'judgement', 'the world'
]);

const HEBREW_POSITIONS: Record<string, string> = {
    'past': 'עבר', 'present': 'הווה', 'future': 'עתיד',
    'positive energy': 'אנרגיה חיובית', 'negative energy': 'אנרגיה שלילית',
    'near future': 'עתיד קרוב', 'distant future': 'עתיד רחוק',
    'inner world': 'עולם פנימי', 'outer world': 'עולם חיצוני',
    'fears': 'פחדים', 'potential': 'פוטנציאל',
};

class TarotService {
    public async interpretSpread(spreadType: string, cards: ISpreadCard[], language: "en" | "he" = "en", question?: string): Promise<string> {
        const spreadName = spreadType === "celtic" ? "Celtic Cross" : "Old Gipsy";
        const isThirdPerson = question?.trim() ? isThirdPersonQuestion(question.trim()) : false;
        const isGroup = isThirdPerson && spreadType === "celtic" && (question?.trim() ? isGroupQuestion(question.trim()) : false);

        // ── 1. Combinations block (programmatic) ──────────────────────────────
        const matchedCombos = findMatchingCombinations(cards);
        const isMajorCombo = (c: MatchedCombo) =>
            c.cards.some(n => MAJOR_ARCANA.has(n.replace(/ Rx$/i, '').toLowerCase()));
        const majorCombos = matchedCombos.filter(isMajorCombo);
        const minorCombos = matchedCombos.filter(c => !isMajorCombo(c));

        let combosBlock = '';
        if (matchedCombos.length > 0) {
            const lines: string[] = [];
            if (majorCombos.length > 0) {
                lines.push(language === 'he' ? '**שילובים — ארקנה גדולה:**' : '**Major Arcana Combinations:**');
                majorCombos.forEach(c => lines.push(`• ${c.cards.join(' + ')} → ${c.meaning}`));
            }
            if (minorCombos.length > 0) {
                if (majorCombos.length > 0) lines.push('');
                lines.push(language === 'he' ? '**שילובים — ארקנה קטנה:**' : '**Minor Arcana Combinations:**');
                minorCombos.forEach(c => lines.push(`• ${c.cards.join(' + ')} → ${c.meaning}`));
            }
            const combosHeader = language === 'he' ? '**שילובים בפריסה זו**' : '**Combinations in this Spread**';
            combosBlock = `${combosHeader}\n\n${lines.join('\n')}`;
        }

        // ── 2. Card readings block (programmatic, RW data) ────────────────────
        const cardReadings = cards.map(card => {
            const baseName = card.name.replace(/ Rx$/i, '');
            const rwData = riderWaiteCards.find(c => c.name.toLowerCase() === baseName.toLowerCase());

            const sentences = (rwData?.desc ?? '').match(/[^.!?]+[.!?]+/g) ?? [];
            const descShort = sentences.slice(0, 2).join(' ').trim();

            const positionDisplay = language === 'he'
                ? (HEBREW_POSITIONS[card.position.toLowerCase()] ?? card.position)
                : card.position;

            return [
                `**${positionDisplay} — ${card.name}**`,
                rwData?.meaning_up ? `*${rwData.meaning_up}*` : '',
                descShort,
            ].filter(Boolean).join('\n');
        }).join('\n\n');

        const readingsHeader = language === 'he' ? '**פרשנות הקלפים**' : '**Card Readings**';
        const cardReadingsBlock = `${readingsHeader}\n\n${cardReadings}`;

        // ── 3. AI conclusion (short) ───────────────────────────────────────────
        const cardSummary = cards.map((c, i) => `${i + 1}. ${c.position} — ${c.name}`).join('\n');
        const questionLine = question?.trim() ? `Question: "${question.trim()}"\n` : '';
        const subjectNote = isThirdPerson
            ? isGroup
                ? 'This is a reading about a family/group. Positions 7–10 describe the querent; use "you/your" for those. Use "they/them/their" for the group in positions 1–6.'
                : 'This is a third-person reading — describe the other person, not the querent. Use "they/them/their".'
            : '';

        const conclusionPrompt = `${questionLine}${spreadName} spread:\n${cardSummary}${subjectNote ? '\n\n' + subjectNote : ''}\n\nWrite a conclusion of 2–3 sentences that ties these cards into a direct, personal message. No hedging, no clichés. Respond in ${language === 'he' ? 'Hebrew' : 'English'}.`;

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `You are an expert Rider-Waite tarot reader. Write only a brief conclusion — 2 to 3 sentences — that synthesizes the key message of this spread into a direct, personal statement for the querent. No filler. Respond in ${language === "he" ? "Hebrew" : "English"}.`,
                    },
                    { role: "user", content: conclusionPrompt },
                ],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${appConfig.openAiApiKey}`,
                },
            }
        );

        const aiConclusion = response.data.choices[0].message.content as string;
        const conclusionHeader = language === 'he' ? '**מסקנה**' : '**Conclusion**';
        const conclusionBlock = `${conclusionHeader}\n\n${aiConclusion}`;

        return [combosBlock, cardReadingsBlock, conclusionBlock].filter(Boolean).join('\n\n---\n\n');
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
