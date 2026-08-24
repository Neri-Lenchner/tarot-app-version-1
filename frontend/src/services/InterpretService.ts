import axios from "axios";
import { authStore } from "../state/auth-state";
import { ITarotCard } from "../arrays-&-models/tarot-deck-array/tarotCard.interface";
import { ICombinationMatch } from "../arrays-&-models/combinationMatch.interface";

const BASE_URL = "http://localhost:4000";

class InterpretService {
    async interpretSpread(
        spreadType: "celtic" | "three-cards",
        cards: ITarotCard[],
        positions: string[],
        lang: "en" | "he",
        question?: string,
        isThirdPerson?: boolean,
        confirmedCombination?: ICombinationMatch
    ): Promise<string> {
        const gender = authStore.getState().user?.gender;
        const payload = {
            spreadType,
            language: lang,
            question: question || undefined,
            isThirdPerson: isThirdPerson || undefined,
            confirmedCombination: confirmedCombination || undefined,
            gender: gender || undefined,
            cards: cards.slice(0, positions.length).map((card, i) => ({
                name: card.name,
                position: positions[i],
            })),
        };
        const response = await axios.post(`${BASE_URL}/api/tarot/interpret`, payload);
        return response.data.interpretation;
    }

    async followupQuestion(question: string, interpretation: string, lang: "en" | "he"): Promise<string> {
        const response = await axios.post(`${BASE_URL}/api/tarot/followup`, {
            question,
            interpretation,
            language: lang,
        });
        return response.data.answer;
    }

    async interpretBoth(
        spreadType: "celtic" | "three-cards",
        cards: ITarotCard[],
        positions: string[],
        question?: string,
        isThirdPerson?: boolean,
        confirmedCombination?: ICombinationMatch
    ): Promise<{ en: string; he: string }> {
        const [en, he] = await Promise.all([
            this.interpretSpread(spreadType, cards, positions, "en", question, isThirdPerson, confirmedCombination),
            this.interpretSpread(spreadType, cards, positions, "he", question, isThirdPerson, confirmedCombination),
        ]);
        return { en, he };
    }
}

export const interpretService = new InterpretService();
