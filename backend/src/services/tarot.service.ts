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
            ? `!!! HIGHEST PRIORITY — ESTABLISHED CARD COMBINATIONS DETECTED !!!\nThe following well-known tarot combination meanings appear in this spread. These carry the GREATEST interpretive weight in the entire reading — you MUST explicitly name and explain each one in your narrative, and they must form the core of your interpretation:\n\n${matchedCombos.join("\n")}\n\nDo NOT treat these as coincidences. Build the story of this reading around these combinations first, then use individual card meanings to add depth.\n\n`
            : "";

        const positionGuide = spreadType === "celtic" ? `\n\n${CELTIC_POSITION_GUIDE}` : "";

        const positionInstruction = language === "he"
            ? "Translate each position name into Hebrew in the header (e.g. Past→עבר, Present→הווה, Future→עתיד, Positive Energy→אנרגיה חיובית, Negative Energy→אנרגיה שלילית, Near Future→עתיד קרוב, Distant Future→עתיד רחוק, Inner World→עולם פנימי, Outer World→עולם חיצוני, Fears→פחדים, Potential→פוטנציאל). Do NOT write 'Position 1', 'Position 2', etc."
            : "Use the position name exactly as provided in the list above.";

        const combinationsReminder = matchedCombos.length > 0
            ? `\n\nREMINDER: The card combinations listed above (${matchedCombos.map(m => m.split("→")[1]?.split("[")[0].trim()).join(", ")}) MUST be explicitly mentioned and explained in the relevant card sections and in the Conclusion.`
            : "";

        const userMessage = `${questionLine}${combinationsSection}I have drawn a ${spreadName} tarot spread. Here are the cards:\n\n${cardList}${positionGuide}\n\nInterpret each card individually based on its position's specific role in the spread${question?.trim() ? ", keeping the querent's question as the central focus throughout" : ""}, then end with an overall conclusion.\n\nUse exactly this format for each card:\n**[Position Name] — [Card Name]**\nYour interpretation (2-3 sentences).\n\n${positionInstruction}${combinationsReminder}\n\nAfter all cards, add:\n**Conclusion**\nOverall synthesis of the reading (2-3 sentences).`;

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content:
                            `You are a wise and insightful tarot reader who speaks in vivid, concrete terms about real life events and situations. Do NOT describe what a card "symbolizes" or "represents" in abstract terms. Instead, describe what is actually happening or has happened in the person's life — real situations, relationships, emotions, decisions. For example, instead of "The Lovers represents a choice between two paths", say "You were deeply in love with someone, but a painful choice or betrayal tore that connection apart." Ground every interpretation in human experience: heartbreak, career shifts, family tension, personal growth, financial pressure, new beginnings, loss, etc. Be direct, warm, and personal — speak to the person as if you know their story. End with a Conclusion that weaves all the events into one coherent life narrative. Respond entirely in ${language === "he" ? "Hebrew" : "English"}.`,
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
