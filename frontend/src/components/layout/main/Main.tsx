import React, {JSX} from 'react';
import './Main.css';
import {CardCarousel} from "./CardCarousel/CardCarousel";
import {useLang} from "../../../state/lang-state";
import {translate} from "../../../state/translations";

function Main(): JSX.Element {
    const lang = useLang();
    const dir = lang === 'he' ? 'rtl' : 'ltr';

    return (
        <div className="main-container">
            <div className="main-hero" dir={dir}>
                <h1>{translate('homeWelcome', lang)}</h1>
                <h2>{translate('homeDestinyCheck', lang)}</h2>
            </div>
            <CardCarousel />
        </div>
    );
}

export default Main;
