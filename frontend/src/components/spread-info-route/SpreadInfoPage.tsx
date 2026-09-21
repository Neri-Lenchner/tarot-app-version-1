import React, {JSX} from 'react';
import {Navigate, NavLink, useParams} from "react-router-dom";
import './SpreadInfoPage.css';
import {useLang} from "../../state/lang-state";
import {translate, TranslationKey} from "../../state/translations";

interface ISpreadInfoEntry {
    titleKey: TranslationKey;
    descKey: TranslationKey;
    route: string;
}

// Only used on this page — the key in the URL (/spread-info/:spreadKey) maps
// to the translation strings above and the real tool route the CTA sends you to.
const SPREAD_INFO: Record<string, ISpreadInfoEntry> = {
    'tarot-deck': {titleKey: 'navTarotDeck', descKey: 'descTarotDeck', route: '/tarot-deck'},
    'celtic-spread': {titleKey: 'navCeltic', descKey: 'descCeltic', route: '/celtic-spread-global'},
    'three-cards': {titleKey: 'navThreeCards', descKey: 'descThreeCards', route: '/three-cards-spread'},
    'master-spread': {titleKey: 'navMasterSpread', descKey: 'descMaster', route: '/master-spread'},
};

function SpreadInfoPage(): JSX.Element {
    const {spreadKey} = useParams<{ spreadKey: string }>();
    const lang = useLang();
    const dir = lang === 'he' ? 'rtl' : 'ltr';

    const entry = spreadKey ? SPREAD_INFO[spreadKey] : undefined;
    if (!entry) {
        return <Navigate to="/" replace/>;
    }

    return (
        <div className="spread-info-page" dir={dir}>
            <div className="spread-info-card">
                <h1>{translate(entry.titleKey, lang)}</h1>
                {translate(entry.descKey, lang).split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                ))}
                <NavLink to={entry.route} className="spread-info-cta">
                    {translate('goToSpread', lang)}
                </NavLink>
                <NavLink to="/" className="spread-info-back">
                    <span className="spread-info-back-arrow" aria-hidden="true">{lang === 'he' ? '↬' : '↫'}</span>
                    {translate('backToHome', lang)}
                </NavLink>
            </div>
        </div>
    );
}

export default SpreadInfoPage;
