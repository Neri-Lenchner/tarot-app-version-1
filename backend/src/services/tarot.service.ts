import axios from "axios";
import { appConfig } from "../utils/app-config";
import { ISpreadCard } from "../dto/tarot.dto";
import { tarotCombinations } from "../data/combinations";
import { riderWaiteCards } from "../data/riderWaite";

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

        const matchedCombos = findMatchingCombinations(cards);
        const combinationsSection = matchedCombos.length > 0
            ? `=== CRITICAL — ESTABLISHED CARD COMBINATIONS DETECTED IN THIS SPREAD ===\nThe following well-known tarot combinations appear in the drawn cards. These are the SINGLE MOST IMPORTANT finding of this reading. They must be explicitly named, explained in depth, and treated as the central message the cards are delivering — above and beyond any individual card meaning:\n\n${matchedCombos.join("\n")}\n\nDo NOT bury these in passing. They are the headline of this reading.\n===\n\n`
            : "";

        const positionGuide = spreadType === "celtic" ? `\n\n${CELTIC_POSITION_GUIDE}` : "";

        const positionInstruction = language === "he"
            ? "Translate each position name into Hebrew (e.g. Past→עבר, Present→הווה, Future→עתיד, Positive Energy→אנרגיה חיובית, Negative Energy→אנרגיה שלילית, Near Future→עתיד קרוב, Distant Future→עתיד רחוק, Inner World→עולם פנימי, Outer World→עולם חיצוני, Fears→פחדים, Potential→פוטנציאל). Do NOT write 'Position 1', 'Position 2', etc. When writing 'In the X position' use the word 'מיקום' (NOT 'מצב') — e.g. 'במיקום האנרגיה החיובית'. IMPORTANT: Always write card names in English (do NOT translate them) — e.g. 'יש לך את הקלף The Fool'."
            : "Use the position name exactly as provided in the list above.";

        const combinationsCenterpiece = matchedCombos.length > 0
            ? `\n\n2. A dedicated CENTERPIECE paragraph about the card combination(s). Start it with something like: "Importantly, the combination of [cards] appearing together in your spread is a powerful sign of [meaning]." Then explain in 2-3 vivid sentences what this means concretely in the querent's real life. This paragraph is the most important in the entire reading — give it full weight and detail.\n\n3.`
            : "\n\n2.";

        const conclusionStep = matchedCombos.length > 0 ? "4." : "3.";
        const conclusionInstruction = matchedCombos.length > 0
            ? "2-3 sentences telling the querent what they should focus on or do to fulfil the potential this spread reveals, explicitly tying back to the card combination(s) as the central message."
            : "2-3 sentences telling the querent what they should focus on or do to fulfil the potential this spread reveals. Give direct, personal, actionable guidance.";

        const energyNote = spreadType === "celtic"
            ? "\n\nIMPORTANT: Positions 1 (Positive Energy) and 2 (Negative Energy) are NOT events — they are active forces or energies currently surrounding the querent. Do NOT use time-frame language for these two positions. Instead describe them as forces, influences, or currents that are present and at work right now (e.g. \"The energy supporting you is...\", \"The force working against you is...\"). All other positions should still include clear time-frame language."
            : "";

        const userMessage = `${questionLine}${combinationsSection}I have drawn a ${spreadName} tarot spread. Here are the cards:\n\n${cardList}${positionGuide}\n\nWrite the interpretation as a flowing personal narrative in exactly this structure:\n\n1. One opening sentence giving an overall impression of what this reading is about${question?.trim() ? " in relation to the querent's question" : ""}.${combinationsCenterpiece} For each card, one paragraph using this exact phrasing:\n"In the [position name] position you have the '[card name]' card, which means [2-3 sentences: real event or energy this position reveals, clearly stating whether it is from the past, the present, the near future, or the distant future]."\n\n${positionInstruction}${energyNote}\n\n${conclusionStep} End with:\n**Conclusion**\n[${conclusionInstruction}]`;

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
}

export const tarotService = new TarotService();
