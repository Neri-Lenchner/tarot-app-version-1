import { JSX, useState, useEffect } from 'react';
import { ICombinationMatch } from '../../services/CombinationsService';
import { cardsDeck } from '../../arrays-&-models/tarot-deck-array/tarotDeck';
import { langStore, LangActionType, Lang } from '../../state/lang-state';
import './CombinationsModal.css';

interface ICombinationsModalProps {
    matches: ICombinationMatch[];
    onClose: () => void;
    onConfirm: (combo: ICombinationMatch) => void;
}

export function CombinationsModal({ matches, onClose, onConfirm }: ICombinationsModalProps): JSX.Element {
    const [collapsed, setCollapsed] = useState(false);
    const [visible, setVisible] = useState(true);
    const [confirmedIndices, setConfirmedIndices] = useState<Set<number>>(new Set());
    const [lang, setLang] = useState<Lang>(langStore.getState().lang);
    useEffect(() => {
        const unsubscribe = langStore.subscribe(() => {
            setLang(langStore.getState().lang);
        });
        return unsubscribe;
    }, []);


    if (!visible) {
        return (
            <button className="combo-reopen-btn" onClick={e => { e.stopPropagation(); setVisible(true); }}>✦</button>
        );
    }

    return (
        <div className={`combo-modal${collapsed ? ' combo-modal--collapsed' : ''}`}>
                <div className="combo-modal-header">
                    <span className="combo-modal-title">{lang === 'he' ? '✦ שילובי קלפים שזוהו' : '✦ Card Combinations Detected'}</span>
                    <div className="combo-header-actions">
                        <button className="combo-lang-btn" onClick={() => langStore.dispatch({ type: LangActionType.Toggle })}>
                            {lang === 'en' ? 'HE' : 'EN'}
                        </button>
                        <button className="combo-collapse-btn" onClick={() => setCollapsed(c => !c)}>
                            {collapsed ? '▲' : '▼'}
                        </button>
                    </div>
                </div>
                {!collapsed && (
                    <>
                        {matches.map((match, i) => (
                            <div key={i} className="combo-item" dir={lang === 'he' ? 'rtl' : 'ltr'}>
                                <div className="combo-card-images">
                                    {match.cards.map(cardName => {
                                        const baseName = cardName.replace(/ Rx$/i, '');
                                        const card = cardsDeck.find(c => c.name.toLowerCase() === baseName.toLowerCase());
                                        return (
                                            <div key={cardName} className="combo-card-image-wrap">
                                                {card && <img src={card.src} alt={card.name} className="combo-card-img" />}
                                                <span className="combo-card-name">{cardName}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="combo-meaning">
                                    {lang === 'he' ? match.meaning_he : match.meaning}
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
                        <button className="combo-modal-close" onClick={() => setVisible(false)}>{lang === 'he' ? 'הבנתי' : 'Got it'}</button>
                    </>
                )}
        </div>
    );
}
