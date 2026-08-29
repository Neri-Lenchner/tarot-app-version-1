import {JSX} from "react";
import * as React from "react";
import './SpreadHeader.css';
import {useLang} from "../../../state/lang-state";
import {translate} from "../../../state/translations";

interface ISpreadHeaderProps {
    spreadThem: () => void;
    clearSpread: () => void;
    children?: React.ReactNode;
}

export function SpreadHeader({ spreadThem, clearSpread, children }: ISpreadHeaderProps): JSX.Element {
    const lang = useLang();
    return (
        <div className="spread-header-container">
            <button className="spread-btn-primary" onClick={spreadThem}>{translate('spreadThem', lang)}</button>
            <button className="spread-btn-secondary" onClick={clearSpread}>{translate('clearSpread', lang)}</button>
            {children}
        </div>
    );
}
