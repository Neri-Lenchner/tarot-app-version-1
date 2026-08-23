import axios from "axios";
import { appConfig } from "../utils/app-config";
import { ISpreadCard } from "../dto/tarot.dto";
import { tarotCombinations } from "../data/combinations";
import { riderWaiteCards } from "../data/riderWaite";
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

function getCourtCardsSection(cards: ISpreadCard[], gender?: "male" | "female"): string {
    const courtCards = cards.filter(c => COURT_CARDS.has(c.name.replace(/ Rx$/i, '').toLowerCase()));
    if (courtCards.length === 0) return '';
    const names = courtCards.map(c => c.name).join(', ');

    const femaleCards = courtCards.filter(c => c.name.replace(/ Rx$/i, '').toLowerCase().startsWith('queen'));
    const maleCards = courtCards.filter(c => !c.name.replace(/ Rx$/i, '').toLowerCase().startsWith('queen'));

    let genderRule = 'GENDER RULE:\n';
    if (femaleCards.length > 0)
        genderRule += `- ${femaleCards.map(c => c.name).join(', ')}: ${femaleCards.length === 1 ? 'This is a female figure' : 'These are female figures'} — MUST be interpreted as representing a woman.\n`;
    if (maleCards.length > 0)
        genderRule += `- ${maleCards.map(c => c.name).join(', ')}: ${maleCards.length === 1 ? 'This is a male figure' : 'These are male figures'} — MUST be interpreted as representing a man.\n`;

    const sameGenderDecisionRule = `YOU MUST ACTIVELY DECIDE — based on the position this card falls in AND the overall story the rest of the spread is telling — whether this card represents the querent themselves or a specific person in their life. Do not leave it ambiguous. Read the whole spread first, then commit to a clear answer and state it explicitly in your interpretation (e.g. "This card is you" or "This card represents a specific man/woman in your life").`;

    let identityRule = '';
    if (gender === 'male') {
        if (maleCards.length > 0 && femaleCards.length > 0) {
            identityRule = `IDENTITY RULE (querent is male):\n- ${maleCards.map(c => c.name).join(', ')}: This is a male figure and the querent is male — it could be the querent himself OR another man in his life. ${sameGenderDecisionRule}\n- ${femaleCards.map(c => c.name).join(', ')}: CANNOT represent the querent. Must be a specific woman in his life (partner, mother, colleague, friend, etc.) — state clearly who she is.\n`;
        } else if (maleCards.length > 0) {
            identityRule = `IDENTITY RULE (querent is male): ${maleCards.length === 1 ? 'This male court card' : 'These male court cards'} could represent the querent himself OR another man in his life. ${sameGenderDecisionRule}\n`;
        } else {
            identityRule = `IDENTITY RULE (querent is male): ${femaleCards.length === 1 ? 'This Queen is a female figure' : 'These Queens are female figures'} and CANNOT represent the querent. ${femaleCards.length === 1 ? 'She is' : 'Each is'} a specific woman in his life — state clearly who she is.\n`;
        }
    } else if (gender === 'female') {
        if (maleCards.length > 0 && femaleCards.length > 0) {
            identityRule = `IDENTITY RULE (querent is female):\n- ${femaleCards.map(c => c.name).join(', ')}: This is a female figure and the querent is female — it could be the querent herself OR another woman in her life. ${sameGenderDecisionRule}\n- ${maleCards.map(c => c.name).join(', ')}: CANNOT represent the querent. Must be a specific man in her life (partner, father, colleague, friend, etc.) — state clearly who he is.\n`;
        } else if (femaleCards.length > 0) {
            identityRule = `IDENTITY RULE (querent is female): ${femaleCards.length === 1 ? 'This female court card' : 'These female court cards'} could represent the querent herself OR another woman in her life. ${sameGenderDecisionRule}\n`;
        } else {
            identityRule = `IDENTITY RULE (querent is female): ${maleCards.length === 1 ? 'This King/Knight/Page is a male figure' : 'These Kings/Knights/Pages are male figures'} and CANNOT represent the querent. ${maleCards.length === 1 ? 'He is' : 'Each is'} a specific man in her life — state clearly who he is.\n`;
        }
    }

    return `=== COURT CARDS — ALWAYS A REAL PERSON ===\nThe following court cards appear in this spread: ${names}.\nCRITICAL RULE: Every court card MUST be interpreted as a real, specific person in the querent's life — never as an abstract energy, archetype, or personality trait. For each court card, explicitly tell the querent that this card represents a real person, describe who that person is (their nature, energy, role in the querent's life), and explain how they are influencing or will influence the situation.\n${genderRule}${identityRule ? '\n' + identityRule : ''}\nUse the rank as a guide to who they are:\n- King: A mature, established authority figure — powerful, decisive, in control of their domain.\n- Queen: A mature figure of emotional or intellectual strength — wise, influential, deeply impactful.\n- Knight: A younger, driven, fast-moving person — bold, action-oriented, sometimes impulsive.\n- Page: A young, new, or inexperienced person — a messenger, a student, someone just entering the scene, or someone bringing news.\nUse the suit as a guide to their domain:\n- Wands: passionate, creative, entrepreneurial, fiery.\n- Cups: emotional, empathic, romantic, intuitive.\n- Swords: sharp, intellectual, communicative, sometimes cutting.\n- Pentacles: practical, reliable, financially grounded, hardworking.\n===\n\n`;
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
        const courtCardsSection = getCourtCardsSection(cards, gender);

        const confirmedComboSection = confirmedCombination
            ? `=== USER-CONFIRMED LIFE CONTEXT ===\nThe user was shown a detected combination and confirmed it is directly relevant to their current life situation:\n${confirmedCombination.cards.join(' + ')} → ${language === 'he' ? confirmedCombination.meaning_he : confirmedCombination.meaning}\nThis is the most important context in this entire reading. Treat this confirmed combination as the central truth of the spread. Reference it explicitly throughout your interpretation — especially in the opening and the conclusion — and show how each card connects back to this theme.\n===\n\n`
            : '';

        const matchedCombos = findMatchingCombinations(cards);
        const combinationsSection = matchedCombos.length > 0
            ? `=== CRITICAL — ESTABLISHED CARD COMBINATIONS DETECTED IN THIS SPREAD ===\nThe following well-known tarot combinations appear in the drawn cards. These are the SINGLE MOST IMPORTANT finding of this reading. They must be explicitly named, explained in depth, and treated as the central message the cards are delivering — above and beyond any individual card meaning:\n\n${matchedCombos.join("\n")}\n\nDo NOT bury these in passing. They are the headline of this reading.\n===\n\n`
            : "";

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
            ? "\n\nIMPORTANT: Positions 1 (Positive Energy) and 2 (Negative Energy) are NOT events — they are active forces or energies currently surrounding the querent. Do NOT use time-frame language for these two positions. Instead describe them as forces, influences, or currents that are present and at work right now (e.g. \"The energy supporting you is...\", \"The force working against you is...\"). All other positions should still include clear time-frame language." +
              "\n\nSPECIAL RULE FOR POSITION 1 (Positive Energy): If the card here is traditionally difficult or dark (e.g. Death, The Tower, The Devil, 10 of Swords, 9 of Swords, 3 of Swords, 5 of Cups, 8 of Swords, etc.), do NOT soften it or pretend it is gentle. The card remains exactly as dark and difficult as it is. Explain how this harsh energy is nonetheless functioning as a supporting force — it may be compelling the querent to face an unavoidable truth, stripping away illusions, forcing a necessary ending, or pushing them through pain toward something real. Acknowledge directly that this 'support' will feel uncomfortable or even painful. The message is: this hard thing is on your side — not because it is easy, but because it is necessary." +
              "\n\nSPECIAL RULE FOR POSITION 2 (Negative Energy): If the card here is traditionally positive or fortunate (e.g. The Star, The Sun, The World, 10 of Cups, 10 of Pentacles, Ace of any suit, 6 of Wands, etc.), do NOT celebrate it or treat it as good news. The card remains exactly as bright and appealing as it is. Explain how this seemingly positive energy is functioning as the obstacle or interference — it may be creating false hope, encouraging complacency, making the querent cling to a comfortable illusion, or tempting them away from what they truly need to do. Acknowledge that the querent will likely perceive this force as welcome and pleasant — that is precisely what makes it dangerous. The message is: this good-looking thing is working against you, not because it is evil, but because it is a distraction or a trap."
            : "";

        const positionDescriptions = spreadType === "celtic"
            ? `- Positive Energy → what supporting force is actively at work for the querent right now?\n- Negative Energy → what is blocking or working against them?\n- Past → what already happened that started or shaped this situation?\n- Present → what is the querent experiencing or facing right now?\n- Near Future → what is concretely coming in the short term?\n- Far Future → where is this heading long-term; what is the ultimate direction?\n- Inside → what is the querent's private, unspoken emotional truth that they may not be voicing?\n- Outside → how does the querent appear to others; how do they present themselves to the world?\n- Fears → what does the querent dread, and how is that fear showing up in this situation?\n- Potential → what can the querent achieve here, and what should they focus on or do to reach that potential?`
            : `- Past → what already happened that started or shaped this situation?\n- Present → what is the querent experiencing or facing right now?\n- Future → what is coming for the querent?`;

        const userMessage = `${questionLine}${confirmedComboSection}${thirdPersonSection}${healthSection}${majorArcanaSection}${courtCardsSection}${combinationsSection}I have drawn a ${spreadName} tarot spread. Here are the cards:\n\n${cardList}${positionGuide}\n\nWrite the interpretation as a flowing personal narrative in exactly this structure:\n\n${formatOpening} For each card, one paragraph. Open with a sentence (in the response language) saying: in the [position name] position, the card is [card name]. Then write 2–3 sentences interpreting the card through the angle of its position — the position name defines the narrative frame and the specific question the paragraph must answer:\n${positionDescriptions}\nEach paragraph must feel like it is answering the specific question its position poses — not a generic card description with a label attached.\n\n${positionInstruction}${energyNote}\n\n${conclusionStep} End with the EXACT marker below on its own line (do not translate or change it, even when writing in Hebrew), followed by the conclusion text:\n**Conclusion**\n[${conclusionInstruction}]`;

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content:
                            `${language === "he" ? "CRITICAL — LANGUAGE RULE: You MUST write your ENTIRE response in Hebrew. Every sentence, every structural phrase, every opening line must be in Hebrew. Do NOT write any sentence in English. The ONLY exception: keep card names in English (e.g. 'The Fool', 'Nine of Wands'). If an instruction gives you an example sentence in English, translate that sentence into Hebrew — do not copy it literally.\n\n" : ""}You are a wise and insightful tarot reader who speaks in vivid, concrete terms about real life events. Never describe what a card "symbolizes" or "represents" in abstract terms. Instead describe what is actually happening or has happened or will happen in the person's life — real situations, relationships, decisions, turning points. Always anchor each card to a clear time frame: past events that shaped the situation, what is happening right now, what is coming soon, and what lies further ahead. Be explicit: "This happened in your past...", "Right now you are facing...", "In the near future...", "Further down the road...". Ground everything in human experience: heartbreak, career shifts, family tensions, personal growth, financial pressure, new beginnings, loss. Be direct, warm, and personal — speak as if you know their story.${gender === "male" ? " The querent is male — use masculine pronouns (he, him, his) and in Hebrew use masculine grammatical forms (לשון זכר) throughout your entire interpretation." : gender === "female" ? " The querent is female — use feminine pronouns (she, her, hers) and in Hebrew use feminine grammatical forms (לשון נקבה) throughout your entire interpretation." : ""} Respond entirely in ${language === "he" ? "Hebrew" : "English"}.`,
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
