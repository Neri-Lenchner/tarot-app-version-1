import {JSX} from "react";
import * as React from "react";
import './SpreadHeader.css';

export function SpreadHeader({ spreadThem, clearSpread }: { spreadThem: any; clearSpread: any }): JSX.Element {

    return (
        <div className="spread-header-container">
            <button onClick={spreadThem}>Spread Them</button>
            <button onClick={clearSpread}>Clear Spread</button>
        </div>
    );
}