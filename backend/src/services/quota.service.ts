import { ResultSetHeader } from "mysql2";
import { dal } from "../utils/dal";
import { RateLimitError } from "../models/client-error";

const MAX_REGISTRATIONS_PER_DAY = 10;
const MAX_QUESTIONS_PER_DAY = 10;

class QuotaService {

    public async assertRegistrationAllowed(): Promise<void> {
        const sql = "SELECT COUNT(*) AS count FROM users WHERE created_at >= CURDATE()";
        const rows = await dal.execute(sql) as { count: number }[];
        if (rows[0].count >= MAX_REGISTRATIONS_PER_DAY) {
            throw new RateLimitError("Today's registration limit has been reached. Please try again tomorrow.");
        }
    }

    // Single atomic UPDATE, entirely in MySQL's own CURDATE() — comparing
    // a DATE column against a JS-side `new Date()` is a timezone trap
    // (mysql2 returns DATE columns as server-local-midnight Date objects,
    // so .toISOString() can shift the date by a day), and doing the
    // reset-or-increment as two separate queries would race under
    // concurrent requests. The WHERE clause only matches (affectedRows
    // > 0) when it's a new day OR today's count is still under the cap;
    // 0 affected rows means the cap is hit.
    public async assertQuestionAllowed(userId: number): Promise<void> {
        const sql = `
            UPDATE users
            SET daily_question_count = IF(daily_question_date = CURDATE(), daily_question_count + 1, 1),
                daily_question_date = CURDATE()
            WHERE id = ? AND (daily_question_date IS NULL OR daily_question_date != CURDATE() OR daily_question_count < ?)
        `;
        const result = await dal.execute(sql, [userId, MAX_QUESTIONS_PER_DAY]) as ResultSetHeader;
        if (result.affectedRows === 0) {
            throw new RateLimitError("Today's question limit has been reached. Please try again tomorrow.");
        }
    }
}

export const quotaService = new QuotaService();
