import axios from "axios";

const BASE_URL = "http://localhost:4000";

class InterpretService {
    async interpretSpread(
        spreadType: "celtic" | "three-cards",
        cards: any[],
        positions: string[],
        lang: "en" | "he",
        question?: string
    ): Promise<string> {
        const payload = {
            spreadType,
            language: lang,
            question: question || undefined,
            cards: cards.slice(0, positions.length).map((card, i) => ({
                name: card.name,
                position: positions[i],
            })),
        };
        const response = await axios.post(`${BASE_URL}/api/tarot/interpret`, payload);
        return response.data.interpretation;
    }

    async interpretBoth(
        spreadType: "celtic" | "three-cards",
        cards: any[],
        positions: string[],
        question?: string
    ): Promise<{ en: string; he: string }> {
        const [en, he] = await Promise.all([
            this.interpretSpread(spreadType, cards, positions, "en", question),
            this.interpretSpread(spreadType, cards, positions, "he", question),
        ]);
        return { en, he };
    }
}

export const interpretService = new InterpretService();
