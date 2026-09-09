import {JSX, useEffect, useState} from 'react';
import {X} from 'lucide-react';
import styles from './CutDeckModal.module.css';
import {FannedDeck} from "../FannedDeck/FannedDeck";
import {ITarotCard} from "../../../arrays-&-models/tarot-deck-array/tarotCard.interface";
import {useLang} from "../../../state/lang-state";
import {translate} from "../../../state/translations";

interface Props {
    /** Already-shuffled pool to cut from — this component never re-shuffles it. */
    cards: ITarotCard[];
    /** Minimum cards that must remain from the clicked card onward — purely
     * a validation floor, NOT a slice length: onCut always receives every
     * card from the clicked one to the end of the pool, and it's up to the
     * caller to take only what it needs from that (e.g. Celtic/Three Cards
     * slice down to their fixed count; Master Spread keeps all of it so the
     * user can freely pick from the whole remainder). */
    needed: number;
    onCut: (cutCards: ITarotCard[]) => void;
    onCancel: () => void;
}

export function CutDeckModal({ cards, needed, onCut, onCancel }: Props): JSX.Element {
    const lang = useLang();
    const [warning, setWarning] = useState(false);

    useEffect((): (() => void) | void => {
        if (!warning) return;
        const timer: ReturnType<typeof setTimeout> = setTimeout(() => setWarning(false), 3000);
        return () => clearTimeout(timer);
    }, [warning]);

    const handleChoose = (card: ITarotCard): void => {
        const idx: number = cards.findIndex((c: ITarotCard): boolean => c.id === card.id);
        if (idx === -1) return;
        if (cards.length - idx < needed) {
            setWarning(true);
            return;
        }
        onCut(cards.slice(idx));
    };

    return (
        <div className={styles.overlay} onClick={onCancel}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3 className={styles.title} dir={lang === 'he' ? 'rtl' : 'ltr'}>{translate('cutDeckTitle', lang)}</h3>
                    <button className={styles.close} onClick={onCancel} aria-label="Close">
                        <X size={18} />
                    </button>
                </div>
                <p className={styles.instructions} dir={lang === 'he' ? 'rtl' : 'ltr'}>
                    {translate('cutDeckInstructions', lang)}
                </p>
                {warning && (
                    <p className={styles.warning} dir={lang === 'he' ? 'rtl' : 'ltr'}>
                        {translate('cutDeckWarning', lang)}
                    </p>
                )}
                <FannedDeck cards={cards} onChoose={handleChoose} />
            </div>
        </div>
    );
}
