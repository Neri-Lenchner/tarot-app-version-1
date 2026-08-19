import React, {JSX} from "react";
import { TarotCard } from "../../arrays-&-models/tarot-deck-array/tarotCard.interface";

interface TarotCardContainerProps {
    tarotCard: TarotCard;
    onClick?: () => void;
}

export function TarotCardContainer({ tarotCard, onClick }: TarotCardContainerProps): JSX.Element {
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