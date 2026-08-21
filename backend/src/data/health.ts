export interface HealthIndicator {
    health: string;
    cards: string[];
}

export const healthIndicators: HealthIndicator[] = [
    {
        health: "Aries — Head",
        cards: ["King of Wands", "Knight of Swords", "The Emperor"]
    },
    {
        health: "Taurus — Neck, Throat & Thyroid",
        cards: ["The Hierophant", "King of Pentacles", "Knight of Pentacles", "Four of Pentacles"]
    },
    {
        health: "Gemini — Arms & Lungs",
        cards: ["The Lovers", "King of Pentacles", "Knight of Swords"]
    },
    {
        health: "Cancer — Lymphatic System, Chest & Breasts",
        cards: ["The Moon", "The Chariot", "King of Cups", "Queen of Cups"]
    },
    {
        health: "Leo — Heart & Spine",
        cards: ["The Sun", "Strength", "Queen of Wands"]
    },
    {
        health: "Virgo — Intestines, Pancreas, Stomach & Nervous System",
        cards: ["The Hermit", "Queen of Swords"]
    },
    {
        health: "Libra — Kidneys & Ovaries",
        cards: ["The Empress", "Justice", "Queen of Pentacles"]
    },
    {
        health: "Scorpio — Nose, Bladder, Sex Organs, Adenoids & Bowels",
        cards: ["Death", "King of Cups", "Queen of Cups", "Knight of Cups", "Page of Cups"]
    },
    {
        health: "Sagittarius — Hips, Thighs, Muscles & Liver",
        cards: ["Temperance", "Knight of Wands"]
    },
    {
        health: "Capricorn — Knees, Joints, Skin, Gall Bladder, Teeth & Bones",
        cards: ["The Devil", "Knight of Pentacles"]
    },
    {
        health: "Aquarius — Eyes, Calves, Ankles & Circulation",
        cards: ["The Star", "King of Swords"]
    },
    {
        health: "Pisces — Feet, Toes, Lymph Glands & Sweat Glands",
        cards: ["The High Priestess", "The Hanged Man", "Page of Cups", "Knight of Cups", "Queen of Cups", "King of Cups"]
    },
];
