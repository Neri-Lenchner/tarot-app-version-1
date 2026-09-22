import axios from "axios";
import { authStore } from "../state/auth-state";
import { ITarotCard } from "../arrays-&-models/tarot-deck-array/tarotCard.interface";
import { ICombinationMatch } from "../arrays-&-models/combinationMatch.interface";

const BASE_URL = "http://localhost:4000";

class InterpretService {
    private get authHeader() {
        return { Authorization: `Bearer ${authStore.getState().token}` };
    }

    async interpretSpread(
        spreadType: "celtic" | "three-cards" | "master-spread",
        cards: ITarotCard[],
        positions: string[],
        lang: "en" | "he",
        question?: string,
        isThirdPerson?: boolean,
        confirmedCombination?: ICombinationMatch,
        isEventBased?: boolean
    ): Promise<string> {
        const gender = authStore.getState().user?.gender;
        const payload = {
            spreadType,
            language: lang,
            question: question || undefined,
            isThirdPerson: isThirdPerson || undefined,
            isEventBased: isEventBased || undefined,
            confirmedCombination: confirmedCombination || undefined,
            gender: gender || undefined,
            cards: cards.slice(0, positions.length).map((card, i) => ({
                name: card.name,
                position: positions[i],
            })),
        };
        const response = await axios.post(`${BASE_URL}/api/tarot/interpret`, payload, { timeout: 65000, headers: this.authHeader });
        return response.data.interpretation;
    }

    async followupQuestion(question: string, interpretation: string, lang: "en" | "he"): Promise<string> {
        const response = await axios.post(`${BASE_URL}/api/tarot/followup`, {
            question,
            interpretation,
            language: lang,
        }, { timeout: 65000, headers: this.authHeader });
        return response.data.answer;
    }

    async translateToHebrew(text: string): Promise<string> {
        const gender = authStore.getState().user?.gender;
        const response = await axios.post(`${BASE_URL}/api/tarot/translate`, {
            text,
            gender: gender || undefined,
        }, { timeout: 65000 });
        return response.data.translation;
    }
}

export const interpretService = new InterpretService();
