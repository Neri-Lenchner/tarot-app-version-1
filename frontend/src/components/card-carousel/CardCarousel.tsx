import { JSX, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cardsDeck } from '../../arrays-&-models/tarot-deck-array/tarotDeck';
import { ITarotCard } from '../../arrays-&-models/tarot-deck-array/tarotCard.interface';
import { TarotCardData } from '../../arrays-&-models/TarotCardData.model';
import { TarotCardContainer } from '../tarot-card/TarotCardContainer';
import { deckService } from '../../services/DeckService';
import { deckStore } from '../../state/deck-state';
import { useLang } from '../../state/lang-state';
import { translate } from '../../state/translations';
import './CardCarousel.css';

// Track holds the full deck twice back-to-back so the CSS loop (0% to -50%)
// resets on a point that looks pixel-identical to the start — see notes/carausel.txt.
export function CardCarousel(): JSX.Element {
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
        <>
            <div className="carousel-viewport">
                <div className="carousel-track">
                    {cardsDeck.map(card => (
                        <TarotCardContainer key={`a-${card.id}`} tarotCard={card} onClick={() => setSelectedCard(card)} tiltScale={1.35} tiltSpeedMs={280} />
                    ))}
                    {cardsDeck.map(card => (
                        <TarotCardContainer key={`b-${card.id}`} tarotCard={card} onClick={() => setSelectedCard(card)} tiltScale={1.35} tiltSpeedMs={280} />
                    ))}
                </div>
            </div>

            {selectedCard !== null && (
                // Deliberately a sibling of .carousel-viewport, not a child of
                // it — that element's mask-image forces the whole subtree
                // (including position:fixed descendants) into one composited,
                // clipped layer, which would trap this overlay near the
                // carousel's own bounds instead of covering the full viewport.
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
        </>
    );
}
