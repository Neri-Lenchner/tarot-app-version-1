import {cardsDeck} from "../../../arrays-&-models/tarot-deck-array/tarotDeck";
import {ITarotCardContainer} from "../../tarot-card/ITarotCardContainer";
import {ITarotCard} from "../../../arrays-&-models/tarot-deck-array/tarotCard.interface";
import './TarotDeck.css';
import {JSX, useEffect, useState} from "react";
import {deckService} from "../../../services/DeckService";
import {deckStore} from "../../../state/deck-state";

export function TarotDeck() {
    const [apiCards, setApiCards] = useState<any[]>(deckService.tarotCardsDetails as any[]);
    const [selectedCard, setSelectedCard] = useState<ITarotCard | null>(null);

    useEffect(() => {
        const unsubscribe = deckStore.subscribe(() => {
            setApiCards(deckService.tarotCardsDetails as any[]);
        });
        return unsubscribe;
    }, []);

    const selectedApiCard = selectedCard
        ? apiCards.find((c: any) => c.name === selectedCard.name)
        : null;

    return (
        <div className="tarot-deck-container">
            {cardsDeck.map((card: ITarotCard): JSX.Element => (
                <ITarotCardContainer
                    key={card.id}
                    tarotCard={card}
                    onClick={() => setSelectedCard(card)}
                />
            ))}

            {selectedCard !== null && (
                <div className="card-modal-overlay" onClick={() => setSelectedCard(null)}>
                    <div className="card-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="card-modal-close" onClick={() => setSelectedCard(null)}>✕</button>
                        <h3 className="card-modal-name">{selectedCard.name}</h3>
                        {selectedApiCard ? (
                            <>
                                <p className="card-modal-meaning"><strong>Meaning:</strong> {selectedApiCard.meaning_up}</p>
                                <p className="card-modal-desc">{selectedApiCard.desc}</p>
                            </>
                        ) : (
                            <p className="card-modal-meaning">No details available.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
