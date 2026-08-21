import React, {JSX, useState, useEffect} from 'react';
import './SideBar.css';
import {NavLink, useNavigate} from "react-router-dom";
import {authStore, Logout, AuthUser} from "../../../state/auth-state";

function SideBar(): JSX.Element {
    const [user, setUser] = useState<AuthUser | null>(authStore.getState().user);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = authStore.subscribe(() => {
            setUser(authStore.getState().user);
        });
        return unsubscribe;
    }, []);

    function handleLogout(): void {
        authStore.dispatch(Logout());
        navigate("/");
    }

    return (
        <div className="SideBar">
            <div className="links">
                <NavLink to="/celtic-spread-global">Celtic Spread</NavLink>
                <NavLink to="/three-cards-spread">Old Gipsy Spread</NavLink>
                <NavLink to="/">Home Page</NavLink>
                {user ? (
                    <>
                        <span className="sidebar-user">Hello, {user.firstName}</span>
                        <button className="sidebar-logout" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login">Login</NavLink>
                        <NavLink to="/register">Register</NavLink>
                    </>
                )}
            </div>
        </div>
    );
}

export default SideBar;
