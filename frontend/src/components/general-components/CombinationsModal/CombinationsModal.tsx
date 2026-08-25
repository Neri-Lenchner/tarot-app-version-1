import { JSX, useEffect, useState } from 'react';
import { cardsDeck } from '../../../arrays-&-models/tarot-deck-array/tarotDeck';
import { useLang } from '../../../state/lang-state';
import './CombinationsModal.css';
import {ITarotCard} from "../../../arrays-&-models/tarot-deck-array/tarotCard.interface";
import {ICombinationMatch} from "../../../arrays-&-models/combinationMatch.interface";

interface ICombinationsModalProps {
    matches: ICombinationMatch[];
    onClose: () => void;
    onConfirm: (combo: ICombinationMatch) => void;
}

export function CombinationsModal({ matches, onClose, onConfirm }: ICombinationsModalProps): JSX.Element {
    const [visible, setVisible] = useState<boolean>(true);
    const [confirmedIndices, setConfirmedIndices] = useState<Set<number>>(new Set());
    const lang = useLang();

    useEffect(() => {
        if (!visible) return;
        const handleClick = (e: MouseEvent): void => {
            if (!(e.target as HTMLElement).closest('.modal-widget-root')) {
                setVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [visible]);

    return (
        <div className="combo-widget modal-widget-root">
            {visible && (
                <div className="combo-modal">
                    <div className="combo-modal-header">
                        <span className="combo-modal-title">
                            {lang === 'he' ? '+ שילובי קלפים שזוהו' : '+ Card Combinations Detected'}
                        </span>
                    </div>
                    <>
                        {matches.map((match, i) => (
                                <div
                                    key={i}
                                    className="combo-item"
                                    dir={lang === 'he' ? 'rtl' : 'ltr'}>
                                    <div className="combo-card-images">
                                        {match.cards.map(cardName => {
                                            const baseName: string = cardName.replace(/ Rx$/i, '');
                                            const card: ITarotCard | undefined = cardsDeck.find(card => card.name.toLowerCase() === baseName.toLowerCase());
                                            return (
                                                <div key={cardName} className="combo-card-image-wrap">
                                                    {
                                                        card && (
                                                            <div className="combo-card-vignette">
                                                                <img src={card.src} alt={card.name} className="combo-card-img" />
                                                            </div>
                                                        )
                                                    }
                                                    <span className="combo-card-name">
                                                        {cardName}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="combo-meaning">
                                        {
                                            lang === 'he'
                                                ? match.meaning_he
                                                : match.meaning
                                        }
                                    </div>
                                    <span className={`combo-badge ${match.category}`}>
                                        {lang === 'he' ? match.category_he : match.category.replace('_', ' ')}
                                    </span>
                                    <button
                                        className="combo-confirm-btn"
                                        disabled={confirmedIndices.has(i)}
                                        onClick={e => {
                                            e.stopPropagation();
                                            setConfirmedIndices(prev => new Set(prev).add(i));
                                            onConfirm(match);
                                        }}
                                    >
                                        {confirmedIndices.has(i)
                                            ? (lang === 'he' ? '✓ נשלח — מפרש מחדש...' : '✓ Sent — Re-reading...')
                                            : (lang === 'he' ? '✓ זה מדבר אליי — פרש מחדש' : '✓ This resonates with my life — Re-read with this context')
                                        }
                                    </button>
                                </div>
                            ))}
                        </>
                </div>
            )}
            <button className="combo-reopen-btn" onClick={e => { e.stopPropagation(); setVisible(v => !v); }}>
                {visible ? '✕' : 'i'}
            </button>
        </div>
    );
}
