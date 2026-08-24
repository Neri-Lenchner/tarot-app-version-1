import { JSX, useState, useEffect } from 'react';
import { cardsDeck } from '../../../arrays-&-models/tarot-deck-array/tarotDeck';
import { langStore, LangActionType, Lang } from '../../../state/lang-state';
import { ensureHebrewTranslation, SpreadType } from '../../../state/interpret-state';
import './CombinationsModal.css';
import {Unsubscribe} from "redux";
import {ITarotCard} from "../../../arrays-&-models/tarot-deck-array/tarotCard.interface";
import {ICombinationMatch} from "../../../arrays-&-models/combinationMatch.interface";

interface ICombinationsModalProps {
    matches: ICombinationMatch[];
    spreadType: SpreadType;
    onClose: () => void;
    onConfirm: (combo: ICombinationMatch) => void;
}

export function CombinationsModal({ matches, spreadType, onClose, onConfirm }: ICombinationsModalProps): JSX.Element {
    const [visible, setVisible] = useState(true);
    const [confirmedIndices, setConfirmedIndices] = useState<Set<number>>(new Set());
    const [lang, setLang] = useState<Lang>(langStore.getState().lang);
    useEffect((): Unsubscribe => {
        const unsubscribe: Unsubscribe = langStore.subscribe((): void => {
            setLang(langStore.getState().lang);
        });
        return unsubscribe;
    }, []);

    const toggleLang = (): void => {
        langStore.dispatch({ type: LangActionType.Toggle });
        if (langStore.getState().lang === 'he') {
            ensureHebrewTranslation(spreadType);
        }
    };


    return (
        <div className="combo-widget">
            {visible && (
                <div className="combo-modal">
                    <div className="combo-modal-header">
                        <span className="combo-modal-title">
                            {lang === 'he' ? '✦ שילובי קלפים שזוהו' : '✦ Card Combinations Detected'}
                        </span>
                        <div className="combo-header-actions">
                            <button className="combo-lang-btn" onClick={toggleLang}>
                                {lang === 'en' ? 'HE' : 'EN'}
                            </button>
                        </div>
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
                                                        card && <img src={card.src} alt={card.name} className="combo-card-img" />
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
                {visible ? '✕' : '✦'}
            </button>
        </div>
    );
}
