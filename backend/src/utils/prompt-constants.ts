export const HEALTH_KEYWORDS = [
    'health', 'sick', 'illness', 'disease', 'medical', 'doctor', 'hospital',
    'pain', 'body', 'physical', 'heal', 'recover', 'diagnosis', 'symptom',
    'condition', 'wellbeing', 'well-being', 'surgery', 'treatment', 'medication',
    'injury', 'accident', 'depression', 'anxiety', 'mental', 'diet', 'exercise',
    'weight', 'energy', 'fatigue', 'tired', 'chronic', 'בריאות', 'מחלה', 'כאב',
    'רופא', 'טיפול', 'ניתוח', 'עייפות', 'גוף', 'תרופה',
];

export const THIRD_PERSON_PRONOUNS = ['he ', 'she ', 'him ', 'her ', 'his ', 'they ', 'them ', 'their '];
export const THIRD_PERSON_RELATIONSHIPS = [
    'my friend', 'my partner', 'my mother', 'my father', 'my brother', 'my sister',
    'my boyfriend', 'my girlfriend', 'my husband', 'my wife', 'my ex', 'my boss',
    'my colleague', 'my coworker', 'my manager', 'my employee', 'my neighbor',
    'my son', 'my daughter', 'my child', 'my aunt', 'my uncle',
    'my grandmother', 'my grandfather', 'my grandma', 'my grandpa', 'my teacher',
    'about him', 'about her', 'about them',
    // Hebrew
    'החבר שלי', 'החברה שלי', 'האמא שלי', 'האבא שלי', 'האח שלי', 'האחות שלי',
    'הבוס שלי', 'הבן זוג שלי', 'הבת זוג שלי', 'הבעל שלי', 'האישה שלי',
    'הילד שלי', 'הבן שלי', 'הבת שלי', 'הסבתא שלי', 'הסבא שלי',
    'הקולגה שלי', 'השכן שלי', 'הגיס שלי', 'הגיסה שלי',
];

export const COURT_CARDS = new Set([
    'king of wands', 'king of cups', 'king of swords', 'king of pentacles',
    'queen of wands', 'queen of cups', 'queen of swords', 'queen of pentacles',
    'knight of wands', 'knight of cups', 'knight of swords', 'knight of pentacles',
    'page of wands', 'page of cups', 'page of swords', 'page of pentacles',
]);

// Which way each court card's figure faces in this app's actual deck
// artwork (Pamela Colman Smith / Rider-Waite), read directly off the card
// images in frontend/public/Tarot-deck-images — used ONLY for the Master
// Spread same-row facing rule (see computeCourtMeetings in
// prompt-sections.ts). Cards omitted here (Queen of Wands, Page of Wands,
// Page of Cups, Page of Swords, King of Pentacles) are drawn mostly frontal
// or looking back over a shoulder — no clear left/right lean — so the
// facing rule deliberately does not fire for pairs involving them.
export const COURT_CARD_FACING: Record<string, 'left' | 'right'> = {
    'king of wands': 'left',
    'king of cups': 'right',
    'king of swords': 'left',
    'queen of cups': 'left',
    'queen of swords': 'left',
    'queen of pentacles': 'right',
    'knight of wands': 'right',
    'knight of cups': 'right',
    'knight of swords': 'left',
    'knight of pentacles': 'right',
    'page of pentacles': 'right',
};

export const MAJOR_ARCANA = new Set([
    'the fool', 'the magician', 'the high priestess', 'the empress', 'the emperor',
    'the hierophant', 'the lovers', 'the chariot', 'strength', 'the hermit',
    'wheel of fortune', 'justice', 'the hanged man', 'death', 'temperance',
    'the devil', 'the tower', 'the star', 'the moon', 'the sun', 'judgement', 'the world'
]);

export const CATEGORY_KEYWORDS: Record<string, string[]> = {
    "PREGNANCY / CHILDREN": ['pregnancy', 'pregnant', 'baby', 'child', 'children', 'birth', 'fertility', 'conceive', 'ivf', 'maternal', 'הריון', 'ילד', 'ילדה', 'לידה', 'תינוק', 'פוריות'],
    "MARRIAGE / WEDDING": ['marriage', 'wedding', 'marry', 'engaged', 'engagement', 'husband', 'wife', 'spouse', 'honeymoon', 'bride', 'groom', 'חתונה', 'נישואים', 'ארוסים', 'בעל', 'אישה', 'חתן', 'כלה'],
    "DIVORCE / SEPARATION": ['divorce', 'separation', 'breakup', 'break up', 'split', 'separate', 'leaving', 'end relationship', 'גירושין', 'פרידה', 'פרוד', 'התפרדות'],
    "CAREER / EMPLOYMENT": ['job', 'career', 'work', 'employment', 'promotion', 'fired', 'hired', 'interview', 'boss', 'office', 'profession', 'salary', 'עבודה', 'קריירה', 'מקצוע', 'פיטורים', 'קידום', 'משרה'],
    "MONEY / FINANCE / BUSINESS": ['money', 'finance', 'financial', 'business', 'debt', 'loan', 'income', 'invest', 'profit', 'bankruptcy', 'savings', 'funds', 'כסף', 'כלכלה', 'עסק', 'חוב', 'הכנסה', 'השקעה'],
    "LEGAL / COURT": ['legal', 'law', 'court', 'lawsuit', 'lawyer', 'judge', 'contract', 'dispute', 'inheritance', 'חוק', 'משפט', 'עורך דין', 'תביעה', 'ירושה'],
    "TRAVEL / MOVEMENT": ['travel', 'trip', 'journey', 'move', 'relocation', 'abroad', 'flight', 'vacation', 'נסיעה', 'טיול', 'מעבר', 'חופשה', 'שינוי מגורים'],
    "HOME / PROPERTY": ['home', 'house', 'property', 'real estate', 'apartment', 'rent', 'buy', 'בית', 'דירה', 'נכס', 'רכישה', 'שכירות'],
    "PEOPLE / OCCUPATIONS": ['person', 'who is', 'about him', 'about her', 'occupation', 'profession', 'אדם', 'מקצוע', 'מי הוא', 'מי היא'],
    "HEALTH": ['health', 'sick', 'illness', 'disease', 'medical', 'doctor', 'hospital', 'pain', 'body', 'heal', 'recover', 'diagnosis', 'injury', 'depression', 'anxiety', 'mental', 'בריאות', 'מחלה', 'כאב', 'רופא', 'טיפול'],
    "SPIRITUAL / PSYCHIC": ['spiritual', 'psychic', 'spirit', 'intuition', 'meditation', 'occult', 'divine', 'angel', 'soul', 'רוחניות', 'פסיכי', 'נשמה', 'מדיטציה'],
    "health": ['health', 'sick', 'illness', 'disease', 'medical', 'doctor', 'hospital', 'pain', 'body', 'heal', 'recover', 'diagnosis', 'injury', 'בריאות', 'מחלה', 'כאב', 'רופא', 'טיפול'],
    "mental_health": ['mental', 'anxiety', 'depression', 'stress', 'psychology', 'psychiatry', 'נפש', 'חרדה', 'דיכאון', 'לחץ'],
};

// Position name → spread-order index, matching the frontend's POSITIONS
// arrays (CelticSpreadGlobal.tsx / ThreeCardsSpreadGlobal.tsx) exactly, so
// the same adjacency graphs below apply.
export const CELTIC_POSITION_INDEX: Record<string, number> = {
    "positive energy": 0,
    "negative energy": 1,
    "past": 2,
    "present": 3,
    "near future": 4,
    "far future": 5,
    "inside": 6,
    "outside": 7,
    "fears": 8,
    "potential": 9,
};

export const THREE_CARDS_POSITION_INDEX: Record<string, number> = {
    "past": 0,
    "present": 1,
    "future": 2,
};

// Matches the frontend's Master Spread POSITIONS array (MasterSpreadGlobal.tsx)
// exactly — row-major over the 3x3 story grid, then Potential last.
export const MASTER_POSITION_INDEX: Record<string, number> = {
    "past - beginning": 0,
    "past - middle": 1,
    "past - end": 2,
    "present - beginning": 3,
    "present - center": 4,
    "present - end": 5,
    "future - beginning": 6,
    "future - middle": 7,
    "future - end": 8,
    "potential": 9,
};

export type Adjacency = Record<number, number[]>;

// Mirrors frontend/src/services/CombinationsService.ts — keep in sync.
export const CELTIC_ADJACENCY: Adjacency = {
    0: [1, 2, 3, 4, 5],
    1: [0, 2, 3, 4, 5],
    2: [0, 1, 3, 6, 7, 8],
    3: [0, 1, 2, 4],
    4: [0, 1, 3, 5],
    5: [0, 1, 2, 4, 9],
    6: [7, 2],
    7: [2, 6, 8],
    8: [2, 7, 9],
    9: [8, 5],
};

// Three Cards: linear chain 0 ↔ 1 ↔ 2
export const THREE_CARDS_ADJACENCY: Adjacency = {
    0: [1],
    1: [0, 2],
    2: [1],
};

// Master Spread: 3x3 story grid (0-8, row-major) plus Potential (9), which
// connects only to Future-End (8) — mirroring how Celtic's Potential links
// to Far Future. Mirrors frontend/src/services/CombinationsService.ts
// MASTER_ADJACENCY — keep in sync.
export const MASTER_ADJACENCY: Adjacency = {
    0: [1, 3, 4],
    1: [0, 2, 3, 4, 5],
    2: [1, 4, 5],
    3: [0, 1, 4, 6, 7],
    4: [0, 1, 2, 3, 5, 6, 7, 8],
    5: [1, 2, 4, 7, 8],
    6: [3, 4, 7],
    7: [3, 4, 5, 6, 8],
    8: [4, 5, 7, 9],
    9: [8],
};

// Strict 4-directional (no diagonals) neighbors in the Master Spread's 3x3
// story grid — used to detect two court cards physically "one after the
// other" (same row) or "on top of / below" (same column), as opposed to
// MASTER_ADJACENCY above, which is a broader thematic/combinations graph.
// Deliberately excludes Potential (9) — it sits outside the grid.
export const MASTER_GRID_NEIGHBORS: Adjacency = {
    0: [1, 3],
    1: [0, 2, 4],
    2: [1, 5],
    3: [0, 4, 6],
    4: [1, 3, 5, 7],
    5: [2, 4, 8],
    6: [3, 7],
    7: [4, 6, 8],
    8: [5, 7],
};

export const CELTIC_POSITION_GUIDE = `
Position guide for the Celtic Cross spread:
1. Positive Energy — The support, people, or forces actively helping the querent in this situation.
2. Negative Energy — The obstacles, interference, or destructive forces working against the querent.
3. Past — Where this situation began; the context and origin of the matter.
4. Present — The core of the situation as it stands right now.
5. Near Future — How things will unfold in the short term if nothing changes.
6. Far Future — The ultimate direction this situation is heading long-term.
7. Inside — How the querent truly feels inside; their private emotional reality.
8. Outside — How the querent presents themselves externally; their public face. Note any contradiction with position 7.
9. Fears — The querent's deepest anxieties about this situation.
10. Potential — The ultimate outcome or highest potential of the situation.
`.trim();

export const MASTER_POSITION_GUIDE = `
Position guide for the Master Spread: three rows of three cards — Past, Present, and Future — each row read left to right as ONE continuous story (a beginning, a middle, and an end/result), followed by a tenth Potential card.
1. Past - Beginning — How this situation's story in the past starts.
2. Past - Middle — How that past story develops and turns.
3. Past - End — How that past story resolves, and what it hands off to the present.
4. Present - Beginning — How the present chapter of this story opens right now.
5. Present - Center — THE MOST IMPORTANT CARD IN THE SPREAD. This is the exact center the entire reading revolves around — it connects to and is coloured by every other card in the spread except Potential. It must state plainly and concretely where the querent stands RIGHT NOW — their current situation in life at this exact point — not a vague feeling or a fragment of a longer present-row story. Every other card orbits this one.
6. Present - End — How the present chapter is resolving or where it stands as it closes.
7. Future - Beginning — How the coming chapter of this story starts.
8. Future - Middle — How that future story develops and turns.
9. Future - End — How that future story resolves — the final beat of the whole Past→Present→Future arc.
10. Potential — The ultimate outcome or highest potential the whole three-part story is building toward.
`.trim();
