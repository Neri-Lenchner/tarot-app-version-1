import React, {JSX} from "react";
import { ITarotCard } from "../../arrays-&-models/tarot-deck-array/tarotCard.interface";
import './ITarotCardContainer.css';

interface IITarotCardContainerProps {
    tarotCard: ITarotCard;
    onClick?: () => void;
}

export function ITarotCardContainer({ tarotCard, onClick }: IITarotCardContainerProps): JSX.Element {
    return (
        <div className="ITarotCard" id={tarotCard.id.toString()} onClick={onClick} style={onClick ? {cursor: "pointer"} : {}}>
            <img
                src={tarotCard.src}
                alt={tarotCard.alt}
                className="small-card"
                loading="lazy"
            />
        </div>
    );
}