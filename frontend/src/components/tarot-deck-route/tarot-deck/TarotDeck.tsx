import {cardsDeck} from "../../../arrays-&-models/tarot-deck-array/tarotDeck";
import {TarotCardContainer} from "../../tarot-card/TarotCardContainer";
import {ITarotCard} from "../../../arrays-&-models/tarot-deck-array/tarotCard.interface";
import {TarotCardData} from "../../../arrays-&-models/TarotCardData.model";
import './TarotDeck.css';
import {JSX, useEffect, useState} from "react";
import {X} from "lucide-react";
import {deckService} from "../../../services/DeckService";
import {deckStore} from "../../../state/deck-state";
import {useLang} from "../../../state/lang-state";
import {translate} from "../../../state/translations";

export function TarotDeck() {
    const lang = useLang();
    const [apiCards, setApiCards] = useState<TarotCardData[]>(deckService.tarotCardsDetails);
    const [selectedCard, setSelectedCard] = useState<ITarotCard | null>(null);

    useEffect(() => {
        const unsubscribe = deckStore.subscribe(() => {
            setApiCards(deckService.tarotCardsDetails);
        });
        return unsubscribe;
    }, []);

    const selectedApiCard = selectedCard
        ? apiCards.find((c: TarotCardData) => c.name === selectedCard.name)
        : null;

    return (
        <div className="tarot-deck-container">
            {cardsDeck.map((card: ITarotCard): JSX.Element => (
                <TarotCardContainer
                    key={card.id}
                    tarotCard={card}
                    onClick={() => setSelectedCard(card)}
                    isSelected={selectedCard?.id === card.id}
                />
            ))}

            {selectedCard !== null && (
                <div className="card-modal-overlay modal-widget-root" onClick={() => setSelectedCard(null)}>
                    <div className="card-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="card-modal-close" onClick={() => setSelectedCard(null)}><X size={18} /></button>
                        <h3 className="card-modal-name">{selectedCard.name}</h3>
                        {selectedApiCard ? (
                            <div dir={lang === 'he' ? 'rtl' : 'ltr'}>
                                <p className="card-modal-meaning"><strong>{translate('meaning', lang)}</strong> {lang === 'he' ? (selectedApiCard.meaning_up_he ?? selectedApiCard.meaning_up) : selectedApiCard.meaning_up}</p>
                                <p className="card-modal-desc">{lang === 'he' ? (selectedApiCard.desc_he ?? selectedApiCard.desc) : selectedApiCard.desc}</p>
                            </div>
                        ) : (
                            <p className="card-modal-meaning">{translate('noDetails', lang)}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
