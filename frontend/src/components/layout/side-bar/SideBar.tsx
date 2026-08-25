import React, {JSX, useState, useEffect} from 'react';
import './SideBar.css';
import {NavLink} from "react-router-dom";
import {authStore} from "../../../state/auth-state";
import {IAuthUser} from "../../../arrays-&-models/authUser.interface";
import {useLang} from "../../../state/lang-state";
import {translate} from "../../../state/translations";

function SideBar(): JSX.Element {
    const [user, setUser] = useState<IAuthUser | null>(authStore.getState().user);
    const lang = useLang();

    useEffect(() => {
        const unsubscribe = authStore.subscribe(() => {
            setUser(authStore.getState().user);
        });
        return unsubscribe;
    }, []);

    return (
        <div className="SideBar">
            <div className="links" dir={lang === 'he' ? 'rtl' : 'ltr'}>
                <NavLink to="/celtic-spread-global">{translate('navCeltic', lang)}</NavLink>
                <NavLink to="/three-cards-spread">{translate('navThreeCards', lang)}</NavLink>
                <NavLink to="/tarot-deck">{translate('navTarotDeck', lang)}</NavLink>
                <NavLink to="/">{translate('navHome', lang)}</NavLink>
                {user && <NavLink to="/my-spreads">{translate('navMySpreads', lang)}</NavLink>}
            </div>
        </div>
    );
}

export default SideBar;
