import React, {JSX} from "react";
import { ITarotCard } from "../../arrays-&-models/tarot-deck-array/tarotCard.interface";
import './TarotCardContainer.css';

interface ITarotCardContainerProps {
    tarotCard: ITarotCard;
    onClick?: () => void;
}

export function TarotCardContainer({ tarotCard, onClick }: ITarotCardContainerProps): JSX.Element {
    return (
        <div className="TarotCard" id={tarotCard.id.toString()} onClick={onClick} style={onClick ? {cursor: "pointer"} : {}}>
            <img
                src={tarotCard.src}
                alt={tarotCard.alt}
                className="small-card"
                loading="lazy"
            />
        </div>
    );
}