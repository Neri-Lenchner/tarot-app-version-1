import axios from "axios";
import { authStore } from "../state/auth-state";

const BASE = "http://localhost:4000/api/readings";

export interface IReadingRecord {
    id: number;
    spread_type: string;
    question: string | null;
    cards: { name: string; position: string }[];
    interpretation_en: string;
    interpretation_he: string;
    created_at: string;
}

class ReadingService {
    private get authHeader() {
        return { Authorization: `Bearer ${authStore.getState().token}` };
    }

    async save(
        spreadType: string,
        question: string,
        cards: { name: string; position: string }[],
        interpretationEn: string,
        interpretationHe: string
    ): Promise<IReadingRecord> {
        const response = await axios.post<IReadingRecord>(
            BASE,
            { spreadType, question, cards, interpretationEn, interpretationHe },
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
