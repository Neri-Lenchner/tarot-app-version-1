import React, {JSX, useState, useEffect} from 'react';
import './Header.css';
import berta from '../../../assets/images/berta-1.png';
import {NavLink, useNavigate} from "react-router-dom";
import {authStore, Logout} from "../../../state/auth-state";
import {IAuthUser} from "../../../arrays-&-models/authUser.interface";
import {interpretStore, InterpretActionType} from "../../../state/interpret-state";

function Header(): JSX.Element {
    const [user, setUser] = useState<IAuthUser | null>(authStore.getState().user);
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
            <img src={berta} alt="Berta" className="header-berta" />
            <h1>BERTA'S TAROT CARDS SPREADS</h1>
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
