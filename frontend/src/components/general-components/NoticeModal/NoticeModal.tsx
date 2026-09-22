import { JSX } from 'react';
import { X } from 'lucide-react';
import styles from './NoticeModal.module.css';
import { useLang } from '../../../state/lang-state';
import { noticeStore, useNoticeVisible } from '../../../state/notice-state';

function EnglishContent(): JSX.Element {
    return (
        <>
            <p><strong>Tarot readings are intended for entertainment, personal reflection, and spiritual guidance only. They should not be considered factual predictions, guaranteed outcomes, professional advice, or statements of unavoidable future events.</strong></p>
            <p>The interpretations presented in this application are based on traditional tarot symbolism and reading practices. Tarot cannot guarantee that a particular event will happen, nor can a reading determine the future with certainty.</p>
            <p><strong>You should use your own judgment and take responsibility for your decisions and actions.</strong> Do not rely on a tarot reading as a substitute for qualified professional advice, including medical, psychological, legal, financial, or other professional advice. When dealing with important or serious matters, consult an appropriately qualified professional.</p>
            <p>Tarot readings describe <strong>possibilities, influences, patterns, and perspectives</strong> rather than fixed or inevitable outcomes. Circumstances can change, and your choices can influence what happens next.</p>

            <h3>Before Your Reading</h3>
            <p>Tarot is traditionally approached as a tool for reflection, insight, and guidance. A reading is most meaningful when the question is asked with a clear mind and the cards are given the opportunity to reveal the situation as it is — not simply what we hope, fear, or expect to hear.</p>
            <p>For this reason, experienced readers traditionally follow several principles when consulting the cards.</p>

            <h4>Ask a Question Once</h4>
            <p>It is generally not recommended to ask the same question repeatedly within a short period of time, especially on the same day.</p>
            <p>Tradition holds that when the same question is asked again and again, the reading may cease to reflect the underlying situation. Instead, the cards may begin to mirror the reader's <strong>fears, hopes, desires, uncertainty, or expectations</strong>.</p>
            <p>If a reading does not give the answer you hoped for, repeating the question immediately is unlikely to provide greater clarity. It is better to allow some time to pass, reflect on the reading, and return to the question when circumstances or your perspective have changed.</p>

            <h4>Do Not Force the Cards</h4>
            <p>A reading should not be repeated simply because you dislike the answer.</p>
            <p>The purpose of tarot is not to obtain a preferred answer, but to gain insight into the situation. Changing the spread, reshuffling repeatedly, or drawing additional cards until a desired answer appears can interfere with the reading and make its message difficult to interpret.</p>

            <h4>Ask Clear Questions</h4>
            <p>The clearer the question, the more useful the reading can be.</p>
            <p>Questions should be specific enough to establish a meaningful subject, while leaving room for the cards to reveal information that may not have been anticipated.</p>
            <p>Instead of asking:</p>
            <p className={styles.example}>"Will everything be okay?"</p>
            <p>consider asking:</p>
            <p className={styles.example}>"What do I need to understand about this situation?"</p>
            <p>or:</p>
            <p className={styles.example}>"What is influencing the outcome of this relationship?"</p>

            <h4>Give the Reading Time to Unfold</h4>
            <p>Not every reading provides an immediate or literal answer. Some readings describe tendencies, influences, obstacles, or possibilities that become clearer as events develop.</p>
            <p>Avoid immediately seeking another reading simply because the meaning is not yet obvious.</p>

            <h4>Avoid Excessive Clarification</h4>
            <p>Additional cards can sometimes clarify an unclear position, but drawing card after card can create confusion rather than certainty.</p>
            <p>A good reader knows when enough information has been given.</p>

            <h4>Read the Whole Spread</h4>
            <p>A tarot card should not always be interpreted in isolation. Its meaning is influenced by its position, the surrounding cards, the question, and the relationship between the cards.</p>
            <p>The complete spread should therefore be considered as a whole rather than searching for a single card that provides the desired answer.</p>

            <h4>Approach the Reading With an Open Mind</h4>
            <p>Try to approach the reading without deciding beforehand what the cards "must" say.</p>
            <p>The most valuable readings are often those that reveal something unexpected.</p>

            <h4>A Final Principle</h4>
            <p><strong>Do not ask the cards what you already know you want them to say. Ask them what you need to understand.</strong></p>
        </>
    );
}

function HebrewContent(): JSX.Element {
    return (
        <>
            <p><strong>פריסות טארוט מיועדות לבידור, להתבוננות אישית ולהדרכה רוחנית בלבד. אין לראות בהן תחזיות עובדתיות, הבטחה לתוצאה, ייעוץ מקצועי, או קביעה של אירועים עתידיים בלתי נמנעים.</strong></p>
            <p>הפירושים המוצגים באפליקציה זו מבוססים על סמליות ומסורות קריאה מסורתיות של הטארוט. הטארוט אינו יכול להבטיח שאירוע מסוים אכן יתרחש, ואף לא לקבוע את העתיד בוודאות.</p>
            <p><strong>עליכם להפעיל שיקול דעת עצמאי ולקחת אחריות על החלטותיכם ומעשיכם.</strong> אין להסתמך על פריסת טארוט כתחליף לייעוץ מקצועי מוסמך, לרבות ייעוץ רפואי, פסיכולוגי, משפטי, פיננסי או כל ייעוץ מקצועי אחר. בעניינים חשובים או רציניים, יש להתייעץ עם איש מקצוע מוסמך בתחום הרלוונטי.</p>
            <p>פריסות טארוט מתארות <strong>אפשרויות, השפעות, דפוסים ונקודות מבט</strong> — לא תוצאות קבועות או בלתי נמנעות. הנסיבות יכולות להשתנות, והבחירות שלכם עשויות להשפיע על מה שיקרה הלאה.</p>

            <h3>לפני הקריאה שלכם</h3>
            <p>הטארוט נתפס באופן מסורתי ככלי להתבוננות, לתובנה ולהדרכה. קריאה משמעותית יותר כאשר השאלה נשאלת בראש צלול, והקלפים מקבלים הזדמנות לחשוף את המצב כפי שהוא — ולא רק את מה שאנחנו מקווים לו, חוששים ממנו, או מצפים לשמוע.</p>
            <p>מסיבה זו, קוראי קלפים מנוסים נוהגים לפעול לפי כמה עקרונות בבואם להתייעץ עם הקלפים.</p>

            <h4>שאלו שאלה פעם אחת</h4>
            <p>בדרך כלל לא מומלץ לשאול את אותה שאלה שוב ושוב בפרק זמן קצר, במיוחד באותו היום.</p>
            <p>המסורת גורסת שכאשר אותה שאלה נשאלת שוב ושוב, הקריאה עלולה לחדול מלשקף את המצב האמיתי. במקום זאת, הקלפים עשויים להתחיל לשקף את <strong>הפחדים, התקוות, הרצונות, חוסר הוודאות או הציפיות</strong> של השואל.</p>
            <p>אם קריאה לא נתנה את התשובה שקיוויתם לה, חזרה מיידית על השאלה כנראה לא תעניק בהירות רבה יותר. עדיף לתת לזמן מה לעבור, להרהר בקריאה, ולחזור לשאלה כאשר הנסיבות או נקודת המבט שלכם השתנו.</p>

            <h4>אל תכריחו את הקלפים</h4>
            <p>אין לחזור על קריאה רק בגלל שהתשובה לא מוצאת חן בעיניכם.</p>
            <p>מטרת הטארוט אינה להשיג תשובה מועדפת, אלא לקבל תובנה על המצב. שינוי הפריסה, ערבוב חוזר ונשנה, או שליפת קלפים נוספים עד שמופיעה התשובה הרצויה עלולים לפגוע בקריאה ולהקשות על פירוש המסר שלה.</p>

            <h4>שאלו שאלות ברורות</h4>
            <p>ככל שהשאלה ברורה יותר, כך הקריאה יכולה להיות מועילה יותר.</p>
            <p>השאלות צריכות להיות ספציפיות מספיק כדי לבסס נושא משמעותי, תוך השארת מקום לקלפים לחשוף מידע שאולי לא ציפיתם לו.</p>
            <p>במקום לשאול:</p>
            <p className={styles.example}>"האם הכול יהיה בסדר?"</p>
            <p>נסו לשאול:</p>
            <p className={styles.example}>"מה עליי להבין לגבי המצב הזה?"</p>
            <p>או:</p>
            <p className={styles.example}>"מה משפיע על התוצאה של מערכת היחסים הזו?"</p>

            <h4>תנו לקריאה זמן להתפתח</h4>
            <p>לא כל קריאה מספקת תשובה מיידית או מילולית. חלק מהקריאות מתארות נטיות, השפעות, מכשולים או אפשרויות שמתבהרות ככל שהאירועים מתפתחים.</p>
            <p>הימנעו מלחפש קריאה נוספת מיד רק כי המשמעות עדיין לא ברורה.</p>

            <h4>הימנעו מהבהרות מוגזמות</h4>
            <p>קלפים נוספים יכולים לעיתים להבהיר מיקום לא ברור, אך שליפת קלף אחר קלף עלולה ליצור בלבול במקום ודאות.</p>
            <p>קורא טוב יודע מתי ניתן מספיק מידע.</p>

            <h4>קראו את הפריסה כולה</h4>
            <p>אין לפרש קלף טארוט תמיד באופן מבודד. משמעותו מושפעת מהמיקום שלו, מהקלפים הסובבים אותו, מהשאלה, ומהיחס בין הקלפים.</p>
            <p>יש לראות את הפריסה השלמה כמכלול אחד, ולא לחפש קלף בודד שנותן את התשובה הרצויה.</p>

            <h4>גשו לקריאה בראש פתוח</h4>
            <p>נסו לגשת לקריאה בלי להחליט מראש מה הקלפים "חייבים" לומר.</p>
            <p>לעיתים קרובות, הקריאות המשמעותיות ביותר הן אלה שחושפות משהו בלתי צפוי.</p>

            <h4>עקרון אחרון</h4>
            <p><strong>אל תשאלו את הקלפים את מה שאתם כבר יודעים שאתם רוצים שהם יגידו. שאלו אותם את מה שאתם צריכים להבין.</strong></p>
        </>
    );
}

export function NoticeModal(): JSX.Element | null {
    const visible = useNoticeVisible();
    const lang = useLang();
    const dir = lang === 'he' ? 'rtl' : 'ltr';

    if (!visible) return null;

    return (
        <div className={styles.overlay} onClick={() => noticeStore.hide()}>
            <div className={styles.modal} onClick={e => e.stopPropagation()} dir={dir} role="dialog" aria-modal="true" aria-labelledby="notice-heading">
                <div className={styles.header}>
                    <h2 id="notice-heading" className={styles.title}>{lang === 'he' ? 'הודעה חשובה' : 'Important Notice'}</h2>
                    <button className={styles.close} onClick={() => noticeStore.hide()} aria-label="Close">
                        <X size={20} />
                    </button>
                </div>
                <div className={styles.body}>
                    {lang === 'he' ? <HebrewContent /> : <EnglishContent />}
                </div>
            </div>
        </div>
    );
}
