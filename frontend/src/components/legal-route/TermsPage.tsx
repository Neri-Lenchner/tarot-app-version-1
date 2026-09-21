import {JSX} from 'react';
import LegalPage from './LegalPage';
import {useLang} from "../../state/lang-state";

function EnglishContent(): JSX.Element {
    return (
        <>
            <h2>1. Acceptance of Terms</h2>
            <p>By using Berta's Tarot Cards Spreads (the "App"), you agree to these Terms of Service. If you don't agree, please don't use the App.</p>

            <h2>2. Nature of the Service</h2>
            <p>The App provides tarot readings for <strong>entertainment, personal reflection, and spiritual guidance only</strong>. Interpretations — including any generated with AI assistance — are not factual predictions, guaranteed outcomes, or professional advice of any kind. See the "Important Notice" link in the footer for our full reading guidelines and disclaimer.</p>

            <h2>3. Accounts</h2>
            <p>Creating an account lets you save readings and revisit them later. You're responsible for keeping your login credentials secure and for anything that happens under your account.</p>

            <h2>4. Your Content</h2>
            <p>Questions you type in and readings you choose to save are yours. We store them so you can view them again, and you can delete a saved reading at any time from "My Spreads."</p>

            <h2>5. AI-Generated Content</h2>
            <p>Interpretations are generated using a third-party AI model. We don't guarantee their accuracy, consistency, or availability, and the wording may vary between readings even for the same cards.</p>

            <h2>6. Acceptable Use</h2>
            <p>Please don't use the App to attempt to disrupt the service, access other users' data, or misuse the interpretation features (for example, to generate unrelated or harmful content).</p>

            <h2>7. Changes</h2>
            <p>We may update these Terms as the App evolves. Continuing to use the App after a change means you accept the updated Terms.</p>

            <h2>8. Contact</h2>
            <p>Questions about these Terms can be sent through the contact details available on the App.</p>
        </>
    );
}

function HebrewContent(): JSX.Element {
    return (
        <>
            <h2>1. קבלת התנאים</h2>
            <p>השימוש באפליקציית "קלפי הטארוט של ברטה" (להלן: "האפליקציה") מהווה הסכמה לתנאי השימוש שלהלן. מי שאינו מסכים לתנאים מתבקש להימנע משימוש באפליקציה.</p>

            <h2>2. אופי השירות</h2>
            <p>האפליקציה מציעה קריאות טארוט <strong>לצורכי בידור, התבוננות אישית והדרכה רוחנית בלבד</strong>. הפירושים המוצגים בה — לרבות פירושים שנוצרו בסיוע בינה מלאכותית — אינם מהווים תחזית עובדתית, הבטחה לתוצאה כלשהי, או ייעוץ מקצועי מכל סוג. להנחיות הקריאה המלאות ולכתב הוויתור, ראו את הקישור "הודעה חשובה" בתחתית העמוד.</p>

            <h2>3. חשבון משתמש</h2>
            <p>פתיחת חשבון מאפשרת שמירת פריסות וצפייה חוזרת בהן בהמשך. האחריות לשמירה על סודיות פרטי ההתחברות, וכן לכל פעולה המתבצעת דרך החשבון, חלה עליכם בלבד.</p>

            <h2>4. תוכן המשתמש</h2>
            <p>שאלות שאתם מקלידים ופריסות שאתם בוחרים לשמור נותרות שלכם. אנו שומרים אותן כדי לאפשר צפייה חוזרת בהן, וניתן למחוק פריסה שמורה בכל עת דרך עמוד "הפריסות שלי".</p>

            <h2>5. תוכן שנוצר באמצעות בינה מלאכותית</h2>
            <p>פירושי הקריאות נוצרים בעזרת מודל בינה מלאכותית של צד שלישי. איננו מתחייבים לדיוקם, לעקביותם או לזמינותם הרציפה, והניסוח עשוי להשתנות מקריאה לקריאה גם כאשר מדובר באותם קלפים.</p>

            <h2>6. שימוש הוגן באפליקציה</h2>
            <p>אין לעשות באפליקציה שימוש שמטרתו לשבש את פעילות השירות, לגשת למידע של משתמשים אחרים ללא הרשאה, או לנצל לרעה את מנגנוני הפירוש (למשל, לצורך הפקת תוכן שאינו קשור לקריאה או תוכן פוגעני).</p>

            <h2>7. שינויים בתנאים</h2>
            <p>אנו רשאים לעדכן תנאים אלה מעת לעת, בהתאם להתפתחות האפליקציה. המשך השימוש באפליקציה לאחר פרסום עדכון מהווה הסכמה לתנאים המעודכנים.</p>

            <h2>8. יצירת קשר</h2>
            <p>לשאלות בנוגע לתנאי שימוש אלה, ניתן לפנות דרך פרטי הקשר המופיעים באפליקציה.</p>
        </>
    );
}

function TermsPage(): JSX.Element {
    const lang = useLang();
    return (
        <LegalPage titleKey="footerTerms">
            {lang === 'he' ? <HebrewContent /> : <EnglishContent />}
        </LegalPage>
    );
}

export default TermsPage;
