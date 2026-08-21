import React, {JSX, useState, useEffect} from 'react';
import './Header.css';
import {NavLink, useNavigate} from "react-router-dom";
import {authStore, Logout, AuthUser} from "../../../state/auth-state";
import {interpretStore, InterpretActionType} from "../../../state/interpret-state";

function Header(): JSX.Element {
    const [user, setUser] = useState<AuthUser | null>(authStore.getState().user);
    const navigate = useNavigate();

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
            <h1>TAROT Cards Spreads</h1>
            <div className="header-auth">
                {user ? (
                    <>
                        <span className="header-user">Hello, {user.firstName}</span>
                        <button className="header-logout" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <NavLink to="/login" className="header-login">Login</NavLink>
                )}
            </div>
        </div>
    );
}

export default Header;
