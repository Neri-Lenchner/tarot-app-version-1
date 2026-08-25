import React, {JSX} from "react";
import { ITarotCard } from "../../arrays-&-models/tarot-deck-array/tarotCard.interface";
import { useTilt } from "../../hooks/useTilt";
import './TarotCardContainer.css';

interface ITarotCardContainerProps {
    tarotCard: ITarotCard;
    onClick?: () => void;
}

export function TarotCardContainer({ tarotCard, onClick }: ITarotCardContainerProps): JSX.Element {
    const { ref, onMouseMove, onMouseLeave } = useTilt<HTMLDivElement>();

    return (
        <div className="TarotCard" id={tarotCard.id.toString()} onClick={onClick} style={onClick ? {cursor: "pointer"} : {}}>
            <div className="small-card-tilt" ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
                <img
                    src={tarotCard.src}
                    alt={tarotCard.alt}
                    className="small-card"
                    loading="lazy"
                />
                <div className="card-particles">
                    <span></span><span></span><span></span>
                    <span></span><span></span><span></span>
                </div>
            </div>
        </div>
    );
}