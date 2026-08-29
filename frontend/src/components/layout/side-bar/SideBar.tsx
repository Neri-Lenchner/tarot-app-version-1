import React, {JSX, useState, useEffect} from 'react';
import './SideBar.css';
import {NavLink} from "react-router-dom";
import {Home, Sparkles, Layers, LayoutGrid, BookMarked} from "lucide-react";
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
            {/* Each link's icon stays visible at every tier; the label span
                is what the Table tier (768-1023px) hides to collapse this
                into a 52px glyph rail — see SideBar.css. */}
            <div className="links" dir={lang === 'he' ? 'rtl' : 'ltr'}>
                <NavLink to="/"><Home size={18} /><span className="link-label">{translate('navHome', lang)}</span></NavLink>
                <NavLink to="/celtic-spread-global"><Sparkles size={18} /><span className="link-label">{translate('navCeltic', lang)}</span></NavLink>
                <NavLink to="/three-cards-spread"><Layers size={18} /><span className="link-label">{translate('navThreeCards', lang)}</span></NavLink>
                <NavLink to="/tarot-deck"><LayoutGrid size={18} /><span className="link-label">{translate('navTarotDeck', lang)}</span></NavLink>
                {user && <NavLink to="/my-spreads"><BookMarked size={18} /><span className="link-label">{translate('navMySpreads', lang)}</span></NavLink>}
            </div>
        </div>
    );
}

export default SideBar;
