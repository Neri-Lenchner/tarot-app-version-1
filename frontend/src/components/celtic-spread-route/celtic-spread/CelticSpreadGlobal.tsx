import {useState, useEffect, JSX} from "react";
import {SpreadHeader} from "../../general-components/SpreadHeader";
import { CelticSpread } from "./celtic-spread-components/CelticSpread";
import './CelticSpreadGlobal.css';
import {TarotCard} from "../../../arrays-&-models/tarot-deck-array/tarotCard.interface";
import {deckService} from "../../../services/DeckService";
import {deckStore} from "../../../state/deck-state";


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
        try {
            return saved === "true";
        } catch {
            return false;
        }
    });

    const [selectedCards, setSelectedCards] = useState<TarotCard[]>((): TarotCard[] => {
        const saved: string | null = localStorage.getItem("selectedCards");
        if (saved === null) return [];
        try {
            return JSON.parse(saved);
        } catch {
            return [];
        }
    });

    useEffect((): void => {
        console.log("Saving to localStorage — isSpread:", isSpread);
        localStorage.setItem("isSpread", JSON.stringify(isSpread));

        console.log("Saving selectedCards — length:", selectedCards.length);
        localStorage.setItem("selectedCards", JSON.stringify(selectedCards));
    }, [isSpread, selectedCards]);

    const spreadThem: () => void = (): void => {
        const [chosen, bool] = deckService.spreadThem();
        setSelectedCards(chosen);
        setIsSpread(bool);
    };

    const clearSpread: () => void = (): void => {
        const bool: boolean = deckService.clearSpread("isSpread", "selectedCards")
        setIsSpread(bool)
        setSelectedCards([]);
    };

    return (
        <div className="celtic-spread-container">
            <>
                <SpreadHeader
                    spreadThem={spreadThem}
                    clearSpread={clearSpread}
                />
                <CelticSpread
                    isSpread={isSpread}
                    cards={selectedCards}
                    apiCards={apiCards}
                />
            </>
        </div>
    );
}
