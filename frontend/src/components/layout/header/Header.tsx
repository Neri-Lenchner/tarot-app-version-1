import React, {JSX, useState, useEffect} from 'react';
import './Header.css';
import berta from '../../../assets/images/berta-1.png';
import {NavLink, useNavigate} from "react-router-dom";
import {authStore, Logout} from "../../../state/auth-state";
import {IAuthUser} from "../../../arrays-&-models/authUser.interface";
import {interpretStore, InterpretActionType, ensureHebrewTranslation} from "../../../state/interpret-state";
import {langStore, LangActionType, useLang} from "../../../state/lang-state";
import {translate} from "../../../state/translations";

function Header(): JSX.Element {
    const [user, setUser] = useState<IAuthUser | null>(authStore.getState().user);
    const navigate = useNavigate();
    const lang = useLang();
    const t = (key: Parameters<typeof translate>[0]): string => translate(key, lang);

    useEffect(() => {
        const unsubscribe = authStore.subscribe(() => {
            setUser(authStore.getState().user);
        });
        return unsubscribe;
    }, []);

    function handleLogout(): void {
        localStorage.removeItem("isSpread");
        localStorage.removeItem("selectedCards");
        localStorage.removeItem("isSpread3");
        localStorage.removeItem("selected3Cards");
        interpretStore.dispatch({ type: InterpretActionType.Clear, spreadType: 'celtic' });
        interpretStore.dispatch({ type: InterpretActionType.Clear, spreadType: 'three-cards' });
        authStore.dispatch(Logout());
        navigate("/");
    }

    return (
        <div className="Header">
            <img src={berta} alt="Berta" className="header-berta" />
            <h1 dir={lang === 'he' ? 'rtl' : 'ltr'}>{t('headerTitle')}</h1>
            <div className="header-auth">
                <button
                    className="header-lang-btn"
                    onClick={() => {
                        langStore.dispatch({ type: LangActionType.Toggle });
                        if (langStore.getState().lang === 'he') {
                            ensureHebrewTranslation('celtic');
                            ensureHebrewTranslation('three-cards');
                        }
                    }}
                    title="עברית / English"
                >
                    {lang === 'en' ? 'HE' : 'EN'}
                </button>
                {user ? (
                    <>
                        <span className="header-user" dir={lang === 'he' ? 'rtl' : 'ltr'}>{t('hello')}, {user.firstName}</span>
                        <button className="header-logout" onClick={handleLogout}>{t('logout')}</button>
                    </>
                ) : (
                    <NavLink to="/login" className="header-login">{t('login')}</NavLink>
                )}
            </div>
        </div>
    );
}

export default Header;
