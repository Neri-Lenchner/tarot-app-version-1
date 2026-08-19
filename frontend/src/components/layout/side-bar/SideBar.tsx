import React, {JSX} from 'react';
import './SideBar.css';
import {NavLink} from "react-router-dom";

function SideBar(): JSX.Element {

    return (
        <div className="SideBar">
            <div className="links">
                <NavLink to="/celtic-spread-global">Celtic Spread</NavLink>
                <NavLink to="/three-cards-spread">Three Cards Spread</NavLink>
                <NavLink to="/">Home Page</NavLink>
            </div>
        </div>
    );
}

export default SideBar;
