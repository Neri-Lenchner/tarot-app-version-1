import {JSX} from "react";
import * as React from "react";
import './SpreadHeader.css';

interface ISpreadHeaderProps {
    spreadThem: () => void;
    clearSpread: () => void;
    children?: React.ReactNode;
}

export function SpreadHeader({ spreadThem, clearSpread, children }: ISpreadHeaderProps): JSX.Element {
    return (
        <div className="spread-header-container">
            <button onClick={spreadThem}>Spread Them</button>
            <button onClick={clearSpread}>Clear Spread</button>
            {children}
        </div>
    );
}
