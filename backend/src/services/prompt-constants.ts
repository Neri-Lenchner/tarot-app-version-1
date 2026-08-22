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
