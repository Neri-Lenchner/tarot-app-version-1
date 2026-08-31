import {cardsDeck} from "../../../arrays-&-models/tarot-deck-array/tarotDeck";
import {TarotCardContainer} from "../../tarot-card/TarotCardContainer";
import {ITarotCard} from "../../../arrays-&-models/tarot-deck-array/tarotCard.interface";
import {TarotCardData} from "../../../arrays-&-models/TarotCardData.model";
import {CardModal, cardModalText} from "../../general-components/CardModal/CardModal";
import styles from './TarotDeck.module.css';
import {JSX, useEffect, useState} from "react";
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
        <div className={styles.container}>
            {cardsDeck.map((card: ITarotCard): JSX.Element => (
                <TarotCardContainer
                    key={card.id}
                    tarotCard={card}
                    onClick={() => setSelectedCard(card)}
                />
            ))}

            {selectedCard !== null && (
                <CardModal name={selectedCard.name} onClose={() => setSelectedCard(null)}>
                    {selectedApiCard ? (
                        <div dir={lang === 'he' ? 'rtl' : 'ltr'}>
                            <p className={cardModalText.meaning}><strong>{translate('meaning', lang)}</strong> {lang === 'he' ? (selectedApiCard.meaning_up_he ?? selectedApiCard.meaning_up) : selectedApiCard.meaning_up}</p>
                            <p className={cardModalText.desc}>{lang === 'he' ? (selectedApiCard.desc_he ?? selectedApiCard.desc) : selectedApiCard.desc}</p>
                        </div>
                    ) : (
                        <p className={cardModalText.meaning}>{translate('noDetails', lang)}</p>
                    )}
                </CardModal>
            )}
        </div>
    );
}
