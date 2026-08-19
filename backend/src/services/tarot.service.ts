import axios from "axios";
import { appConfig } from "../utils/app-config";
import { ISpreadCard } from "../dto/tarot.dto";

class TarotService {
    public async interpretSpread(spreadType: string, cards: ISpreadCard[]): Promise<string> {
        const spreadName = spreadType === "celtic" ? "Celtic Cross" : "Three Cards";

        const cardList = cards
            .map((card, i) => `${i + 1}. ${card.position} — ${card.name}: ${card.meaning_up}`)
            .join("\n");

        const userMessage = `I have drawn a ${spreadName} tarot spread. Here are the cards:\n\n${cardList}\n\nPlease give me a holistic interpretation of this spread as a whole.`;

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are a wise and insightful tarot reader with deep knowledge of tarot symbolism and spreads. Given a spread of cards with their positions and meanings, provide a thoughtful and holistic interpretation that weaves all the cards together into a coherent narrative. Be warm, reflective, and meaningful — not generic. Keep your response to 3-5 paragraphs.",
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
