import { ResultSetHeader } from "mysql2";
import { dal } from "../utils/dal";

export interface IReadingRecord {
    id: number;
    user_id: number;
    spread_type: string;
    question: string | null;
    cards: any;
    interpretation_en: string;
    interpretation_he: string;
    created_at: string;
}

class ReadingService {
    public async save(
        userId: number,
        spreadType: string,
        question: string | null,
        cards: any[],
        interpretationEn: string,
        interpretationHe: string
    ): Promise<IReadingRecord> {
        const sql = `INSERT INTO readings (user_id, spread_type, question, cards, interpretation_en, interpretation_he)
                     VALUES (?, ?, ?, ?, ?, ?)`;
        const result = await dal.execute(sql, [
            userId, spreadType, question || null, JSON.stringify(cards), interpretationEn, interpretationHe
        ]) as ResultSetHeader;
        const rows = await dal.execute("SELECT * FROM readings WHERE id = ?", [result.insertId]) as IReadingRecord[];
        return rows[0];
    }

    public async getUserReadings(userId: number): Promise<IReadingRecord[]> {
        const sql = "SELECT * FROM readings WHERE user_id = ? ORDER BY created_at DESC";
        return await dal.execute(sql, [userId]) as IReadingRecord[];
    }

    public async getReading(userId: number, id: number): Promise<IReadingRecord | null> {
        const sql = "SELECT * FROM readings WHERE id = ? AND user_id = ?";
        const rows = await dal.execute(sql, [id, userId]) as IReadingRecord[];
        return rows[0] ?? null;
    }

    public async deleteReading(userId: number, id: number): Promise<boolean> {
        const result = await dal.execute(
            "DELETE FROM readings WHERE id = ? AND user_id = ?",
            [id, userId]
        ) as ResultSetHeader;
        return result.affectedRows > 0;
    }
}

export const readingService = new ReadingService();
