import React, {JSX, useState, useEffect} from 'react';
import './SideBar.css';
import {NavLink} from "react-router-dom";
import {authStore, IAuthUser} from "../../../state/auth-state";

function SideBar(): JSX.Element {
    const [user, setUser] = useState<IAuthUser | null>(authStore.getState().user);

    useEffect(() => {
        const unsubscribe = authStore.subscribe(() => {
            setUser(authStore.getState().user);
        });
        return unsubscribe;
    }, []);

    return (
        <div className="SideBar">
            <div className="links">
                <NavLink to="/celtic-spread-global">Celtic Spread</NavLink>
                <NavLink to="/three-cards-spread">Old Gipsy Spread</NavLink>
                <NavLink to="/">Home Page</NavLink>
                {user && <NavLink to="/my-spreads">My Spreads</NavLink>}
            </div>
        </div>
    );
}

export default SideBar;
