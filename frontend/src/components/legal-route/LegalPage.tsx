import {JSX, ReactNode} from 'react';
import {NavLink} from "react-router-dom";
import './LegalPage.css';
import {useLang} from "../../state/lang-state";
import {translate, TranslationKey} from "../../state/translations";

interface Props {
    titleKey: TranslationKey;
    children: ReactNode;
}

function LegalPage({titleKey, children}: Props): JSX.Element {
    const lang = useLang();
    const dir = lang === 'he' ? 'rtl' : 'ltr';

    return (
        <div className="legal-page" dir={dir}>
            <div className="legal-card">
                <h1>{translate(titleKey, lang)}</h1>
                <div className="legal-body">
                    {children}
                </div>
                <NavLink to="/" className="legal-back">
                    <span className="legal-back-arrow" aria-hidden="true">{lang === 'he' ? '↬' : '↫'}</span>
                    {translate('backToHome', lang)}
                </NavLink>
            </div>
        </div>
    );
}

export default LegalPage;
