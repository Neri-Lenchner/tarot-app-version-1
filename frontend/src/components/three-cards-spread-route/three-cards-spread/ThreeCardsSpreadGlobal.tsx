import {JSX, useEffect, useState} from 'react';
import './ThreeCardsSpreadGlobal.css';
import {ThreeCardsSpread} from "./three-cards-spread-components/ThreeCardsSpread";
import {TarotCard} from "../../../arrays-&-models/tarot-deck-array/tarotCard.interface";
import {SpreadHeader} from "../../general-components/SpreadHeader";
import {deckService} from "../../../services/DeckService";
import {deckStore} from "../../../state/deck-state";

export function ThreeCardsSpreadGlobal(): JSX.Element {
    const [apiCards, setApiCards] = useState<any[]>(deckService.tarotCardsDetails as any[]);

    useEffect(() => {
        const unsubscribe = deckStore.subscribe(() => {
            setApiCards(deckService.tarotCardsDetails as any[]);
        });
        return unsubscribe;
    }, []);
    const [isSpread3, setIsSpread3] = useState<boolean>((): boolean => {
        const saved: string | null = localStorage.getItem("isSpread3");
        if (saved === null) return false;
        try {
            return saved === "true";
        } catch {
            return false;
        }
    });

    const [selected3Cards, setSelected3Cards] = useState<TarotCard[]>((): TarotCard[] => {
        const saved: string | null = localStorage.getItem("selected3Cards");
        if (saved === null) return [];
        try {
            return JSON.parse(saved);
        } catch {
            return [];
        }
    });

    useEffect((): void => {
        console.log("Saving to localStorage — isSpread:", isSpread3);
        localStorage.setItem("isSpread3", JSON.stringify(isSpread3));

        console.log("Saving selectedCards — length:", selected3Cards.length);
        localStorage.setItem("selected3Cards", JSON.stringify(selected3Cards));
    }, [isSpread3, selected3Cards]);

    const spreadThem3: () => void = (): void => {
        const [chosen, bool] = deckService.spreadThem();
        setSelected3Cards(chosen);
        setIsSpread3(bool);
    };

    const clearSpread3: () => void = (): void => {
        const bool: boolean = deckService.clearSpread("isSpread3", "selected3Cards")
        setIsSpread3(bool)
        setSelected3Cards([]);
    };
    return (
        <div className="three-cards-global-container">
            <SpreadHeader
                spreadThem={spreadThem3}
                clearSpread={clearSpread3}
            />
            <ThreeCardsSpread
                isSpread3={isSpread3}
                cards={selected3Cards}
                apiCards={apiCards}
            />
        </div>

    );
}

