import axios from "axios";

export interface ICombinationMatch {
    cards: string[];
    meaning: string;
    source: "general" | "health";
    category: string;
}

const BASE_URL = "http://localhost:4000";

class CombinationsService {
    async checkCombinations(cardNames: string[]): Promise<ICombinationMatch[]> {
        const response = await axios.post(`${BASE_URL}/api/tarot/check-combinations`, { cardNames });
        return response.data;
    }
}

export const combinationsService = new CombinationsService();
