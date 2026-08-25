import React, {JSX} from 'react';
import './HomePage.css';
import {CardCarousel} from "../card-carousel/CardCarousel";
import {useLang} from "../../state/lang-state";
import {translate} from "../../state/translations";

export function HomePage(): JSX.Element {
    const lang = useLang();
    const dir = lang === 'he' ? 'rtl' : 'ltr';

    return (
        <div className="home-page-container">
            <div className="home-hero" dir={dir}>
                <h1>{translate('homeWelcome', lang)}</h1>
                <h2>{translate('homeDestinyCheck', lang)}</h2>
            </div>
            <CardCarousel />
        </div>
    );
}
