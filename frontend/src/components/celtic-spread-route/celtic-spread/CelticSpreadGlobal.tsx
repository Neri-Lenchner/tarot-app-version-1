import {useState, useEffect, JSX} from "react";
import {SpreadHeader} from "../../general-components/SpreadHeader";
import {CelticSpread} from "./celtic-spread-components/CelticSpread";
import {InterpretWidget} from "../../general-components/InterpretWidget";
import './CelticSpreadGlobal.css';
import {TarotCard} from "../../../arrays-&-models/tarot-deck-array/tarotCard.interface";
import {deckService} from "../../../services/DeckService";
import {deckStore} from "../../../state/deck-state";
import {interpretStore, InterpretActionType} from "../../../state/interpret-state";

const POSITIONS = [
    "Positive Energy", "Negative Energy", "Past", "Present",
    "Near Future", "Far Future", "Inside", "Outside", "Fears", "Potential"
];

export function CelticSpreadGlobal(): JSX.Element {
    const [apiCards, setApiCards] = useState<any[]>(deckService.tarotCardsDetails as any[]);

    useEffect(() => {
        const unsubscribe = deckStore.subscribe(() => {
            setApiCards(deckService.tarotCardsDetails as any[]);
        });
        return unsubscribe;
    }, []);

    const [isSpread, setIsSpread] = useState<boolean>((): boolean => {
        const saved: string | null = localStorage.getItem("isSpread");
        if (saved === null) return false;
        try { return saved === "true"; } catch { return false; }
    });

    const [selectedCards, setSelectedCards] = useState<TarotCard[]>((): TarotCard[] => {
        const saved: string | null = localStorage.getItem("selectedCards");
        if (saved === null) return [];
        try { return JSON.parse(saved); } catch { return []; }
    });

    useEffect((): void => {
        localStorage.setItem("isSpread", JSON.stringify(isSpread));
        localStorage.setItem("selectedCards", JSON.stringify(selectedCards));
    }, [isSpread, selectedCards]);

    const spreadThem: () => void = (): void => {
        const [chosen, bool] = deckService.spreadThem();
        setSelectedCards(chosen);
        setIsSpread(bool);
        interpretStore.dispatch({ type: InterpretActionType.Clear, spreadType: 'celtic' });
    };

    const clearSpread: () => void = (): void => {
        const bool: boolean = deckService.clearSpread("isSpread", "selectedCards");
        setIsSpread(bool);
        setSelectedCards([]);
        interpretStore.dispatch({ type: InterpretActionType.Clear, spreadType: 'celtic' });
    };

    return (
        <div className="celtic-spread-container">
            <SpreadHeader spreadThem={spreadThem} clearSpread={clearSpread} />
            <CelticSpread isSpread={isSpread} cards={selectedCards} apiCards={apiCards} />
            {isSpread && selectedCards.length > 0 && (
                <InterpretWidget
                    spreadType="celtic"
                    cards={selectedCards}
                    apiCards={apiCards}
                    positions={POSITIONS}
                    theme="green"
                />
            )}
        </div>
    );
}
