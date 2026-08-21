export interface HealthCombination {
    cards: string[];
    meaning: string;
    meaning_he: string;
    category: "health" | "mental_health";
}

export const healthCombinations: HealthCombination[] = [
    { cards: ["The Hanged Man", "The Tower"], meaning: "Serious danger of illness", meaning_he: "סכנה חמורה של מחלה", category: "health" },
    { cards: ["The Hanged Man", "Death"], meaning: "Illness", meaning_he: "מחלה", category: "health" },
    { cards: ["The Star", "Death"], meaning: "Serious illness", meaning_he: "מחלה חמורה", category: "health" },
    { cards: ["The Moon", "The Tower"], meaning: "Serious illness", meaning_he: "מחלה חמורה", category: "health" },
    { cards: ["The Tower", "The Devil"], meaning: "Health problems", meaning_he: "בעיות בריאות", category: "health" },
    { cards: ["The Tower Rx", "The Devil"], meaning: "Serious health problems / bodily imbalance", meaning_he: "בעיות בריאות חמורות / חוסר איזון גופני", category: "health" },
    { cards: ["Temperance Rx", "The Tower"], meaning: "Health in danger", meaning_he: "הבריאות בסכנה", category: "health" },
    { cards: ["Temperance", "The High Priestess"], meaning: "Health recovered / recovery", meaning_he: "הבריאות התאוששה / החלמה", category: "health" },
    { cards: ["The Hanged Man", "Strength"], meaning: "Delicate physical health", meaning_he: "בריאות גופנית עדינה", category: "health" },
    { cards: ["The Hanged Man", "The Tower"], meaning: "Illness approaching / serious health danger", meaning_he: "מחלה מתקרבת / סכנת בריאות חמורה", category: "health" },
    { cards: ["The Hanged Man", "Justice", "Strength"], meaning: "Very slow recovery from illness", meaning_he: "החלמה איטית מאוד ממחלה", category: "health" },
    { cards: ["The Hanged Man", "The Tower", "Death"], meaning: "Severe illness / serious physical danger", meaning_he: "מחלה קשה / סכנה גופנית חמורה", category: "health" },
    { cards: ["Justice", "The Tower"], meaning: "Mental imbalance", meaning_he: "חוסר איזון נפשי", category: "mental_health" },
    { cards: ["Strength", "The Hermit", "The Moon"], meaning: "Exhaustion, weakness, ill-health", meaning_he: "תשישות, חולשה, בריאות לקויה", category: "health" },
    { cards: ["The Chariot", "The Moon"], meaning: "Sickness", meaning_he: "מחלה", category: "health" },
    { cards: ["The Chariot", "Death"], meaning: "Deathbed / critical physical condition", meaning_he: "ערש דווי / מצב גופני קריטי", category: "health" },
    { cards: ["The Hanged Man", "Death"], meaning: "Paralysis", meaning_he: "שיתוק", category: "health" },
    { cards: ["The Fool", "Death"], meaning: "Suicidal thoughts", meaning_he: "מחשבות אובדניות", category: "mental_health" },
    { cards: ["The Magician", "Temperance"], meaning: "Healing practitioner / treatment for illness", meaning_he: "מטפל רפואי / טיפול במחלה", category: "health" },
    { cards: ["The High Priestess", "Temperance"], meaning: "Improvement / recovery of health", meaning_he: "שיפור / החלמה של הבריאות", category: "health" },
    { cards: ["Nine of Swords", "The Moon"], meaning: "Severe anxiety, fear and psychological distress", meaning_he: "חרדה חמורה, פחד ומצוקה נפשית", category: "mental_health" },
    { cards: ["Nine of Swords", "The Star"], meaning: "Healing and relief from anxiety", meaning_he: "ריפוי והקלה מחרדה", category: "mental_health" },
    { cards: ["Nine of Swords", "Four of Swords"], meaning: "Need for rest and recovery from mental distress", meaning_he: "צורך במנוחה והחלמה ממצוקה נפשית", category: "mental_health" },
    { cards: ["Nine of Swords", "Eight of Swords"], meaning: "Intensified mental suffering / anxiety", meaning_he: "סבל נפשי מוגבר / חרדה", category: "mental_health" },
];
