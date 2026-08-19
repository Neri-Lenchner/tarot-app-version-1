import axios from "axios";

const BASE_URL = "http://localhost:4000";

class InterpretService {
    async interpretSpread(
        spreadType: "celtic" | "three-cards",
        cards: any[],
        apiCards: any[],
        positions: string[],
        lang: "en" | "he"
    ): Promise<string> {
        const payload = {
            spreadType,
            language: lang,
            cards: cards.slice(0, positions.length).map((card, i) => {
                const apiCard = apiCards.find((c: any) => c.name === card.name);
                return {
                    name: card.name,
                    position: positions[i],
                    meaning_up: apiCard?.meaning_up || "",
                    desc: apiCard?.desc || "",
                };
            }),
        };
        const response = await axios.post(`${BASE_URL}/api/tarot/interpret`, payload);
        return response.data.interpretation;
    }

    async interpretBoth(
        spreadType: "celtic" | "three-cards",
        cards: any[],
        apiCards: any[],
        positions: string[]
    ): Promise<{ en: string; he: string }> {
        const [en, he] = await Promise.all([
            this.interpretSpread(spreadType, cards, apiCards, positions, "en"),
            this.interpretSpread(spreadType, cards, apiCards, positions, "he"),
        ]);
        return { en, he };
    }
}

export const interpretService = new InterpretService();
