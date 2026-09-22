import axios from "axios";
import { authStore } from "../state/auth-state";
import { IReadingRecord } from "../arrays-&-models/readingRecord.interface";
import { API_BASE_URL } from "../config";

const BASE = `${API_BASE_URL}/api/readings`;

class ReadingService {
    private get authHeader() {
        return { Authorization: `Bearer ${authStore.getState().token}` };
    }

    async save(
        spreadType: string,
        question: string,
        questionHe: string | null,
        cards: { name: string; position: string }[],
        interpretationEn: string,
        interpretationHe: string,
        followupQuestion: string | null = null,
        followupAnswer: string | null = null
    ): Promise<IReadingRecord> {
        const response = await axios.post<IReadingRecord>(
            BASE,
            { spreadType, question, questionHe, cards, interpretationEn, interpretationHe, followupQuestion, followupAnswer },
            { headers: this.authHeader }
        );
        return response.data;
    }

    async getMyReadings(): Promise<IReadingRecord[]> {
        const response = await axios.get<IReadingRecord[]>(BASE, { headers: this.authHeader });
        return response.data;
    }

    async getReadingById(id: number): Promise<IReadingRecord> {
        const response = await axios.get<IReadingRecord>(`${BASE}/${id}`, { headers: this.authHeader });
        return response.data;
    }

    async delete(id: number): Promise<void> {
        await axios.delete(`${BASE}/${id}`, { headers: this.authHeader });
    }
}

export const readingService = new ReadingService();
