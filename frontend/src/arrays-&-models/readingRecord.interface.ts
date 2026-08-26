export interface IReadingRecord {
    id: number;
    spread_type: string;
    question: string | null;
    question_he: string | null;
    cards: { name: string; position: string }[];
    interpretation_en: string;
    interpretation_he: string;
    followup_question: string | null;
    followup_answer: string | null;
    created_at: string;
}
