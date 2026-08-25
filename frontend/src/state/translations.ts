import { Lang } from './lang-state';

// Every hand-translated UI string in the app (not the AI reading content,
// which is translated separately — see interpret-state.ts / tarot.service.ts).
const translations = {
    // ── Header / nav ──
    headerTitle: { en: "Berta's Tarot Cards Spreads", he: "קלפי הטארוט של ברטה" },

    // ── Home hero ──
    homeWelcome: { en: "Welcome to Berta's Tarot Experience", he: "ברוכים הבאים לחוויית הטארוט של ברטה" },
    homeDestinyCheck: { en: "Enjoy Your Destiny Check", he: "תיהנו מהצצה לגורלכם" },
    hello: { en: "Hello", he: "שלום" },
    logout: { en: "Logout", he: "התנתקות" },
    login: { en: "Login", he: "התחברות" },
    navCeltic: { en: "Celtic Spread", he: "פריסה קלטית" },
    navThreeCards: { en: "Old Gipsy Spread", he: "פריסת הצוענייה" },
    navHome: { en: "Home Page", he: "עמוד הבית" },
    navTarotDeck: { en: "Tarot Deck", he: "חפיסת הטארוט" },
    navMySpreads: { en: "My Spreads", he: "הפריסות שלי" },

    // ── Spread header / question bar ──
    spreadThem: { en: "Spread Them", he: "פרוש קלפים" },
    clearSpread: { en: "Clear Spread", he: "נקה פריסה" },
    thirdPersonToggle: { en: "👤 Reading about someone else", he: "👤 קריאה עבור מישהו אחר" },
    questionPlaceholder: { en: "What is your question?", he: "מה שאלתך לקלפים?" },
    yourQuestion: { en: "Your question:", he: "השאלה שלך:" },

    // ── Ready questions / warnings ──
    maybeAsk: { en: "Maybe you want to ask:", he: "אולי תרצה לשאול:" },
    clearSpreadWarning: { en: "Please clear the current spread first", he: "נא לנקות את הפריסה הנוכחית קודם" },

    // ── Card detail modal ──
    meaning: { en: "Meaning:", he: "משמעות:" },
    noDetails: { en: "No details available.", he: "אין פרטים זמינים." },

    // ── Interpret widget ──
    readingInterpretation: { en: "Reading Interpretation", he: "פירוש הפריסה" },
    question: { en: "Question", he: "שאלה" },
    readingCards: { en: "Reading the cards...", he: "קורא את הקלפים..." },
    reInterpret: { en: "Re-interpret", he: "פרש מחדש" },
    interpretReading: { en: "Interpret Reading", he: "פרש את הפריסה" },
    cardsSpeaking: { en: "The cards are speaking...", he: "הקלפים מדברים..." },
    saveReading: { en: "Save Reading", he: "שמור פריסה" },
    saving: { en: "Saving...", he: "שומר..." },
    saved: { en: "Saved ✓", he: "נשמר ✓" },
    translatingHebrew: { en: "Translating to Hebrew...", he: "מתרגם לעברית..." },
    failedInterpretation: { en: "Failed to get interpretation. Please try again.", he: "פירוש הפריסה נכשל. נא לנסות שוב." },
    failedSave: { en: "Failed to save reading. Please try again.", he: "שמירת הפריסה נכשלה. נא לנסות שוב." },
    failedTranslation: { en: "Hebrew translation failed. Tap to retry.", he: "תרגום לעברית נכשל. הקש כדי לנסות שוב." },

    // ── My Spreads / Spread Details ──
    mySpreadsTitle: { en: "My Spreads", he: "הפריסות שלי" },
    loading: { en: "Loading...", he: "טוען..." },
    noSavedReadings: { en: "No saved readings yet.", he: "עדיין אין פריסות שמורות." },
    delete: { en: "Delete", he: "מחיקה" },
    backToMySpreads: { en: "← Back to My Spreads", he: "→ חזרה לפריסות שלי" },
    followupQuestionTitle: { en: "Follow-up Question", he: "שאלת המשך" },

    // ── Auth ──
    welcomeBack: { en: "Welcome Back", he: "ברוך שובך" },
    email: { en: "Email", he: "דוא\"ל" },
    emailRequired: { en: "Email is required", he: "יש להזין דוא\"ל" },
    password: { en: "Password", he: "סיסמה" },
    passwordRequired: { en: "Password is required", he: "יש להזין סיסמה" },
    loginFailed: { en: "Login failed", he: "ההתחברות נכשלה" },
    dontHaveAccount: { en: "Don't have an account?", he: "אין לך חשבון?" },
    register: { en: "Register", he: "הרשמה" },
    createAccount: { en: "Create Account", he: "יצירת חשבון" },
    firstName: { en: "First Name", he: "שם פרטי" },
    firstNameRequired: { en: "First name is required", he: "יש להזין שם פרטי" },
    lastName: { en: "Last Name", he: "שם משפחה" },
    lastNameRequired: { en: "Last name is required", he: "יש להזין שם משפחה" },
    passwordMinLength: { en: "At least 4 characters", he: "לפחות 4 תווים" },
    iAmA: { en: "I am a...", he: "אני..." },
    genderMale: { en: "He ♂", he: "הוא ♂" },
    genderFemale: { en: "She ♀", he: "היא ♀" },
    selectGender: { en: "Please select He or She", he: "נא לבחור הוא או היא" },
    registrationFailed: { en: "Registration failed", he: "ההרשמה נכשלה" },
    alreadyHaveAccount: { en: "Already have an account?", he: "כבר יש לך חשבון?" },
} as const;

export type TranslationKey = keyof typeof translations;

export function translate(key: TranslationKey, lang: Lang): string {
    return translations[key][lang];
}

// Spread position names (Past, Potential, etc.) stay in English as the
// functional value passed to the backend and used to match AI-generated
// text to a card image — this is display-only. Matches the glossary the
// backend translates position names through (tarot.service.ts).
export const POSITION_HE: Record<string, string> = {
    'Past': 'עבר',
    'Present': 'הווה',
    'Future': 'עתיד',
    'Positive Energy': 'אנרגיה חיובית',
    'Negative Energy': 'אנרגיה שלילית',
    'Near Future': 'עתיד קרוב',
    'Far Future': 'עתיד רחוק',
    'Inside': 'עולם פנימי',
    'Outside': 'עולם חיצוני',
    'Fears': 'פחדים',
    'Potential': 'פוטנציאל',
};

export function translatePosition(position: string, lang: Lang): string {
    if (lang === 'en') return position;
    return POSITION_HE[position] ?? position;
}
