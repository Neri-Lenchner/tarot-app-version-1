import {JSX} from 'react';
import LegalPage from './LegalPage';
import {useLang} from "../../state/lang-state";

function EnglishContent(): JSX.Element {
    return (
        <>
            <p>Berta's Tarot Cards Spreads is a small, independent project built to bring a classic, contemplative tarot-reading experience online — the ten-card Celtic Cross, the Old Gipsy's three-card spread, the Master Spread — an old method whose precise origins remain uncertain — and the full 78-card Rider-Waite deck to browse and study at your own pace.</p>
            <p>Each reading pairs the traditional symbolism of the cards with AI-assisted interpretation, woven into a single flowing narrative rather than a rigid card-by-card script — while staying true to the spirit of classic tarot practice described in our reading guidelines (see the "Important Notice" link in the footer).</p>
            <p>This app is offered purely for <strong>entertainment, personal reflection, and spiritual guidance</strong>. It isn't a substitute for professional medical, legal, financial, or psychological advice. We hope it brings a bit of the same wonder that drew us to tarot in the first place.</p>
        </>
    );
}

function HebrewContent(): JSX.Element {
    return (
        <>
            <p>קלפי הטארוט של ברטה הוא פרויקט עצמאי קטן, שמטרתו להנגיש ברשת חוויית קריאת טארוט קלאסית והתבוננותית — הפריסה הקלטית בת עשרת הקלפים, פריסת הצועניה הזקנה בת שלושת הקלפים, פריסת המאסטר — שיטה עתיקה שמקורותיה המדויקים אינם ידועים — וחפיסת ריידר-וייט המלאה בת 78 הקלפים, לעיון ולימוד בקצב האישי שלכם.</p>
            <p>כל קריאה משלבת בין הסמליות המסורתית של הקלפים לבין פירוש הנעזר בבינה מלאכותית, הארוג לכדי סיפור זורם אחד — לא רשימת קלפים נוקשה — תוך שמירה על רוח מנהגי הטארוט הקלאסיים, כפי שהיא מתוארת בהנחיות הקריאה שלנו (ראו את הקישור "הודעה חשובה" בתחתית העמוד).</p>
            <p>אפליקציה זו מיועדת אך ורק <strong>לבידור, להתבוננות אישית ולהדרכה רוחנית</strong>, ואינה תחליף לייעוץ רפואי, משפטי, פיננסי או פסיכולוגי מקצועי. אנו מקווים שתעניק לכם ולו מעט מאותה תחושת פלא שמשכה אותנו אל הטארוט מלכתחילה.</p>
        </>
    );
}

function AboutPage(): JSX.Element {
    const lang = useLang();
    return (
        <LegalPage titleKey="footerAbout">
            {lang === 'he' ? <HebrewContent /> : <EnglishContent />}
        </LegalPage>
    );
}

export default AboutPage;
