export interface HealthCombination {
    cards: string[];
    meaning: string;
    category: "health" | "mental_health";
}

export const healthCombinations: HealthCombination[] = [
    { cards: ["The Hanged Man", "The Tower"], meaning: "Serious danger of illness", category: "health" },
    { cards: ["The Hanged Man", "Death"], meaning: "Illness", category: "health" },
    { cards: ["The Star", "Death"], meaning: "Serious illness", category: "health" },
    { cards: ["The Moon", "The Tower"], meaning: "Serious illness", category: "health" },
    { cards: ["The Tower", "The Devil"], meaning: "Health problems", category: "health" },
    { cards: ["The Tower Rx", "The Devil"], meaning: "Serious health problems / bodily imbalance", category: "health" },
    { cards: ["Temperance Rx", "The Tower"], meaning: "Health in danger", category: "health" },
    { cards: ["Temperance", "The High Priestess"], meaning: "Health recovered / recovery", category: "health" },
    { cards: ["The Hanged Man", "Strength"], meaning: "Delicate physical health", category: "health" },
    { cards: ["The Hanged Man", "The Tower"], meaning: "Illness approaching / serious health danger", category: "health" },
    { cards: ["The Hanged Man", "Justice", "Strength"], meaning: "Very slow recovery from illness", category: "health" },
    { cards: ["The Hanged Man", "The Tower", "Death"], meaning: "Severe illness / serious physical danger", category: "health" },
    { cards: ["Justice", "The Tower"], meaning: "Mental imbalance", category: "mental_health" },
    { cards: ["Strength", "The Hermit", "The Moon"], meaning: "Exhaustion, weakness, ill-health", category: "health" },
    { cards: ["The Chariot", "The Moon"], meaning: "Sickness", category: "health" },
    { cards: ["The Chariot", "Death"], meaning: "Deathbed / critical physical condition", category: "health" },
    { cards: ["The Hanged Man", "Death"], meaning: "Paralysis", category: "health" },
    { cards: ["The Fool", "Death"], meaning: "Suicidal thoughts", category: "mental_health" },
    { cards: ["The Magician", "Temperance"], meaning: "Healing practitioner / treatment for illness", category: "health" },
    { cards: ["The High Priestess", "Temperance"], meaning: "Improvement / recovery of health", category: "health" },
    { cards: ["Nine of Swords", "The Moon"], meaning: "Severe anxiety, fear and psychological distress", category: "mental_health" },
    { cards: ["Nine of Swords", "The Star"], meaning: "Healing and relief from anxiety", category: "mental_health" },
    { cards: ["Nine of Swords", "Four of Swords"], meaning: "Need for rest and recovery from mental distress", category: "mental_health" },
    { cards: ["Nine of Swords", "Eight of Swords"], meaning: "Intensified mental suffering / anxiety", category: "mental_health" },
];
