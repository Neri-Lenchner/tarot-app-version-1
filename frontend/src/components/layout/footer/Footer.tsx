import React, {JSX} from 'react';
import './Footer.css';
import {NavLink} from "react-router-dom";
import {useLang} from "../../../state/lang-state";
import {translate} from "../../../state/translations";
import {noticeStore} from "../../../state/notice-state";

const SPREAD_LINKS: { key: string; navLabelKey: Parameters<typeof translate>[0] }[] = [
    {key: 'tarot-deck', navLabelKey: 'navTarotDeck'},
    {key: 'celtic-spread', navLabelKey: 'navCeltic'},
    {key: 'three-cards', navLabelKey: 'navThreeCards'},
    {key: 'master-spread', navLabelKey: 'navMasterSpread'},
];

function Footer(): JSX.Element {
    const lang = useLang();
    const dir = lang === 'he' ? 'rtl' : 'ltr';

    return (
        <footer className="Footer" dir={dir}>
            <div className="footer-links">
                <span className="footer-links-title">{translate('footerExplore', lang)}</span>
                <nav>
                    {SPREAD_LINKS.map(({key, navLabelKey}) => (
                        <NavLink key={key} to={`/spread-info/${key}`}>
                            {translate(navLabelKey, lang)}
                        </NavLink>
                    ))}
                </nav>
            </div>
            <div className="footer-legal">
                <button className="footer-notice-link" onClick={() => noticeStore.show()}>
                    {translate('footerNotice', lang)}
                </button>
                <NavLink to="/about" className="footer-legal-link">
                    {translate('footerAbout', lang)}
                </NavLink>
                <NavLink to="/terms" className="footer-legal-link">
                    {translate('footerTerms', lang)}
                </NavLink>
                <NavLink to="/privacy" className="footer-legal-link">
                    {translate('footerPrivacy', lang)}
                </NavLink>
            </div>
            <div className="footer-rights">
                {translate('headerTitleShort', lang)} · © {new Date().getFullYear()} · {translate('footerRights', lang)}
            </div>
        </footer>
    );
}

export default Footer;
