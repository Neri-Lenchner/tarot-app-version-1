import axios from "axios";
import { appConfig } from "../utils/app-config";
import { ISpreadCard } from "../dto/tarot.dto";

class TarotService {
    public async interpretSpread(spreadType: string, cards: ISpreadCard[], language: "en" | "he" = "en"): Promise<string> {
        const spreadName = spreadType === "celtic" ? "Celtic Cross" : "Three Cards";

        const cardList = cards
            .map((card, i) => `${i + 1}. ${card.position} — ${card.name}: ${card.meaning_up}`)
            .join("\n");

        const userMessage = `I have drawn a ${spreadName} tarot spread. Here are the cards:\n\n${cardList}\n\nInterpret each card individually based on its position in the spread, then end with an overall conclusion.\n\nUse exactly this format for each card:\n**[Position] — [Card Name]**\nYour interpretation (2-3 sentences).\n\nAfter all cards, add:\n**Conclusion**\nOverall synthesis of the reading (2-3 sentences).`;

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content:
                            `You are a wise and insightful tarot reader. Interpret each card in its position with 2-3 warm, meaningful sentences. End with a Conclusion that weaves all cards into a coherent narrative. Be specific to each card's position — do not give generic responses. Respond entirely in ${language === "he" ? "Hebrew" : "English"}.`,
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
