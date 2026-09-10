import { Lang } from './lang-state';

// Every hand-translated UI string in the app (not the AI reading content,
// which is translated separately — see interpret-state.ts / tarot.service.ts).
const translations = {
    // ── Header / nav ──
    headerTitle: { en: "Berta's Tarot Cards Spreads", he: "קלפי הטארוט של ברטה" },
    headerTitleShort: { en: "Berta", he: "ברטה" },

    // ── Home hero ──
    homeWelcome: { en: "Welcome to Berta's Tarot Experience", he: "ברוכים הבאים לחוויית הטארוט של ברטה" },
    homeDestinyCheck: { en: "Enjoy Your Destiny Check", he: "תיהנו מהצצה לגורלכם" },
    hello: { en: "Hello", he: "שלום" },
    logout: { en: "Logout", he: "התנתקות" },
    login: { en: "Login", he: "התחברות" },
    navCeltic: { en: "Celtic Spread", he: "פריסה קלטית" },
    navThreeCards: { en: "Old Gipsy Spread", he: "פריסת הצוענייה" },
    navMasterSpread: { en: "Master Spread", he: "פריסת המאסטר" },
    navHome: { en: "Home Page", he: "עמוד הבית" },
    navTarotDeck: { en: "Tarot Deck", he: "חפיסת הטארוט" },
    navMySpreads: { en: "My Spreads", he: "הפריסות שלי" },

    // ── Spread header / question bar ──
    spreadThem: { en: "Spread Them", he: "פרוש קלפים" },
    clearSpread: { en: "Clear Spread", he: "נקה פריסה" },
    thirdPersonToggle: { en: "Reading about someone else", he: "קריאה עבור מישהו אחר" },
    questionPlaceholder: { en: "What is your question?", he: "מה שאלתך לקלפים?" },
    yourQuestion: { en: "Your question:", he: "השאלה שלך:" },

    // ── Ready questions / warnings ──
    maybeAsk: { en: "Maybe you want to ask:", he: "אולי תרצה לשאול:" },
    clearSpreadWarning: { en: "Please clear the current spread first", he: "נא לנקות את הפריסה הנוכחית קודם" },
    redrawWarning: { en: "Drawing again will replace the spread below.", he: "פריסה מחדש תחליף את הפריסה שלמטה." },
    chooseCardsInstruction: { en: "Click cards from the deck below to place them, one by one, into the spread.", he: "לחצו על קלפים מהחפיסה למטה כדי להניח אותם, אחד אחרי השני, בפריסה." },
    cutDeckTitle: { en: "Cut the Deck", he: "חתכו את החפיסה" },
    cutDeckInstructions: { en: "Click a card to cut the deck at that point.", he: "לחצו על קלף כדי לחתוך את החפיסה באותה נקודה." },
    cutDeckWarning: { en: "Not enough cards remain after this one — pick a card closer to the start.", he: "אין מספיק קלפים אחרי קלף זה — בחרו קלף קרוב יותר להתחלה." },

    // ── Card detail modal ──
    meaning: { en: "Meaning:", he: "משמעות:" },
    noDetails: { en: "No details available.", he: "אין פרטים זמינים." },

    // ── Interpret widget ──
    readingInterpretation: { en: "Reading Interpretation", he: "פירוש הפריסה" },
    question: { en: "Question", he: "שאלה" },
    readingCards: { en: "Reading the cards...", he: "קורא את הקלפים..." },
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
    backToMySpreads: { en: "Back to My Spreads", he: "חזרה לפריסות שלי" },
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

    // ── Footer ──
    footerExplore: { en: "Explore the Spreads", he: "הכירו את הפריסות" },
    footerRights: { en: "All rights reserved.", he: "כל הזכויות שמורות." },

    // ── Spread info pages ──
    goToSpread: { en: "Go to this spread", he: "עברו לפריסה זו" },
    backToHome: { en: "← Back to Home", he: "→ חזרה לעמוד הבית" },
    descTarotDeck: {
        en: "Browse the complete 78-card tarot deck at your own pace. Every card shows its traditional Rider-Waite meaning, so this is the place to study a card's symbolism outside of a live reading.",
        he: "עיינו בחפיסת הטארוט המלאה בת 78 הקלפים בקצב שלכם. כל קלף מציג את משמעותו המסורתית לפי ריידר-וייט, ולכן זהו המקום ללמוד את הסמליות של קלף מחוץ לפריסה חיה."
    },
    descCeltic: {
        en: "The Celtic Cross is the best-known ten-card tarot spread in the English-speaking world.\n\nIts earliest documented appearance is in A. E. Waite's The Pictorial Key to the Tarot (1910/1911), under the title \"An Ancient Celtic Method of Divination.\" Waite noted that the method had been used privately for years in England, Scotland and Ireland, but named no ancient source for it.\n\nDocumentary evidence suggests a similar layout may have circulated earlier, in the 1890s, within the Hermetic Order of the Golden Dawn — the influential occult society Waite belonged to. Who actually devised the spread, and why Waite called it \"Celtic,\" remain open questions.\n\nBecause of this history, the exact meaning and order of the ten positions have never been fixed: different tarot traditions and authors — including Waite's own original wording — describe them somewhat differently. Treat any specific position layout, including the one used here, as one of several established methods rather than a single ancient standard.",
        he: "הפריסה הקלטית (Celtic Cross) היא פריסת הטארוט בת עשרת הקלפים המוכרת ביותר בעולם דובר האנגלית.\n\nהאזכור המתועד המוקדם ביותר שלה מופיע בספרו של א.א. וייט (A. E. Waite), The Pictorial Key to the Tarot (1910/1911), תחת הכותרת \"שיטת ניחוש קלטית עתיקה\" (\"An Ancient Celtic Method of Divination\"). וייט ציין שהשיטה שימשה באופן פרטי במשך שנים באנגליה, סקוטלנד ואירלנד, אך לא נקב במקור עתיק כלשהו עבורה.\n\nעדויות תיעודיות מרמזות שפריסה דומה אולי הייתה נהוגה כבר קודם לכן, בשנות ה-90 של המאה ה-19, בקרב מסדר השחר הזהוב ההרמטי (Hermetic Order of the Golden Dawn) — האגודה האוקולטית רבת ההשפעה שוייט היה חבר בה. מי אכן פיתח את הפריסה, ומדוע וייט כינה אותה 'קלטית', נותרו שאלות פתוחות.\n\nבשל היסטוריה זו, המשמעות והסדר המדויקים של עשרת המיקומים מעולם לא היו קבועים: מסורות טארוט וכותבים שונים — כולל הניסוח המקורי של וייט עצמו — מתארים אותם באופן שונה במקצת. יש להתייחס לכל סידור מיקומים ספציפי, כולל זה המשמש כאן, כאל אחת משיטות מבוססות אחדות, ולא כתקן עתיק יחיד."
    },
    descThreeCards: {
        en: "The three-card Past–Present–Future spread has hazy origins. Short three-card draws can be traced back to late-eighteenth-century European cartomancy, but no surviving early source pins down today's specific arrangement of three cards standing for Past, Present, and Future.\n\nOver time this simple draw became one of the most widely used tarot structures: the first card for the Past, the second for the Present, the third for the Future. It's commonly read with the full 78-card deck, though — as in this app — many modern versions restrict it to the 22 Major Arcana.\n\nIts uncertain origin has given the spread an air of mystery, and it's often said to be one of the oldest tarot methods, passed down through generations of readers before its history was ever written down. That claim, though, is best treated as tradition rather than established historical fact.",
        he: "לפריסת עבר-הווה-עתיד בת שלושת הקלפים מקור עמום. ניתן לאתר הטלות קלפים קצרות בנות שלושה קלפים עוד מסוף המאה ה-18, בקרטומנציה האירופית, אך לא שרד מקור מוקדם הקובע במפורש את הסידור הספציפי המוכר כיום — שלושה קלפים המייצגים עבר, הווה ועתיד.\n\nעם הזמן התפתחה ההטלה הפשוטה הזו לאחת משיטות הטארוט הנפוצות ביותר: הקלף הראשון מייצג את העבר, השני את ההווה, והשלישי את העתיד. השיטה נהוגה כיום לרוב עם חפיסת הטארוט המלאה בת 78 הקלפים, אם כי גרסאות מודרניות רבות — כמו זו הנהוגה כאן — מצמצמות אותה ל-22 קלפי הארקנה הגדולה בלבד.\n\nמקורה הלא ודאי מעניק לפריסה הילה של מסתורין, ולעיתים קרובות נאמר כי היא אחת משיטות הטארוט העתיקות ביותר, שעברה במסורת שבעל-פה בין קוראי קלפים דורות רבים לפני שהיסטוריה שלה תועדה אי-פעם. עם זאת, יש להתייחס לטענה זו כאל מסורת או אגדה, ולא כעובדה היסטורית מבוססת."
    },
    descMaster: {
        en: "The precise origins of the Master Spread remain uncertain. Unlike spreads whose development can be traced through published sources, the history of this spread is hard to reconstruct. Similar spreads have appeared across different tarot traditions, and many specialized methods were passed privately from teacher to student and never formally recorded.\n\nWhether it's the refinement of an older method, a tradition carried through an undocumented lineage, or the work of one particular practitioner remains an open question.\n\nThat uncertainty has become part of its character. The method has survived through practice and transmission from reader to reader, while its earliest beginnings stay hidden from the historical record.",
        he: "מקורותיה המדויקים של פריסת המאסטר אינם ידועים. בשונה מפריסות שאחר התפתחותן ניתן לעקוב במקורות מתועדים, קשה לשחזר את ההיסטוריה של פרישה זו. פרישות דומות הופיעו במסורות טארוט שונות, ושיטות ייעודיות רבות הועברו באופן פרטי ממורה לתלמיד, מבלי שתועדו אי-פעם באופן רשמי.\n\nהשאלה אם מדובר בעידון של שיטה קדומה יותר, במסורת שעברה דרך שושלת בלתי מתועדת, או ביצירתו של קורא קלפים מסוים אחד — נותרת פתוחה.\n\nחוסר הוודאות הזה הפך לחלק מאופייה של הפריסה. שיטתה שרדה דרך תרגול והעברה מקורא קלף אחד למשנהו, בעוד שראשיתה המוקדמת ביותר נותרה חבויה מעיני התיעוד ההיסטורי."
    },
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
    'Past - Beginning': 'עבר - התחלה',
    'Past - Middle': 'עבר - אמצע',
    'Past - End': 'עבר - סוף',
    'Present - Beginning': 'הווה - התחלה',
    'Present - Center': 'הווה - מרכז',
    'Present - End': 'הווה - סוף',
    'Future - Beginning': 'עתיד - התחלה',
    'Future - Middle': 'עתיד - אמצע',
    'Future - End': 'עתיד - סוף',
};

export function translatePosition(position: string, lang: Lang): string {
    if (lang === 'en') return position;
    return POSITION_HE[position] ?? position;
}
