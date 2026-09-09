import {JSX} from 'react';
import styles from './FannedDeck.module.css';
import {ITarotCard} from "../../../arrays-&-models/tarot-deck-array/tarotCard.interface";

interface Props {
    cards: ITarotCard[];
    onChoose: (card: ITarotCard) => void;
}

export function FannedDeck({ cards, onChoose }: Props): JSX.Element {
    return (
        <div className={styles.fanScroll}>
            <div className={styles.fan}>
                {cards.map((card: ITarotCard, i: number): JSX.Element => (
                    <div
                        key={card.id}
                        className={styles.fanCard}
                        style={{ zIndex: i }}
                        onClick={() => onChoose(card)}
                    >
                        <img src="/Tarot-deck-images/cards-back.jpg" alt="card back" className={styles.cardBackImg} />
                    </div>
                ))}
            </div>
        </div>
    );
}
