import { JSX, useState } from 'react';
import { ICombinationMatch } from '../../services/CombinationsService';
import { cardsDeck } from '../../arrays-&-models/tarot-deck-array/tarotDeck';
import './CombinationsModal.css';

interface CombinationsModalProps {
    matches: ICombinationMatch[];
    onClose: () => void;
    spreadCards: string[];
}

export function CombinationsModal({ matches, onClose, spreadCards }: CombinationsModalProps): JSX.Element {
    const spreadOrder = spreadCards.map(n => n.toLowerCase());
    const [collapsed, setCollapsed] = useState(false);
    const [visible, setVisible] = useState(true);

    if (!visible) {
        return (
            <button className="combo-reopen-btn" onClick={() => setVisible(true)}>✦</button>
        );
    }

    return (
        <div className="combo-modal-overlay" onClick={collapsed ? undefined : () => setVisible(false)}>
            <div className={`combo-modal${collapsed ? ' combo-modal--collapsed' : ''}`} onClick={e => e.stopPropagation()}>
                <div className="combo-modal-header">
                    <span className="combo-modal-title">✦ Card Combinations Detected</span>
                    <button className="combo-collapse-btn" onClick={() => setCollapsed(c => !c)}>
                        {collapsed ? '▲' : '▼'}
                    </button>
                </div>
                {!collapsed && (
                    <>
                        {matches.map((match, i) => {
                            const sortedCards = [...match.cards].sort((a, b) => {
                                const ia = spreadOrder.indexOf(a.replace(/ Rx$/i, '').toLowerCase());
                                const ib = spreadOrder.indexOf(b.replace(/ Rx$/i, '').toLowerCase());
                                return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
                            });

                            const renderCard = (cardName: string) => {
                                const baseName = cardName.replace(/ Rx$/i, '');
                                const card = cardsDeck.find(c => c.name.toLowerCase() === baseName.toLowerCase());
                                return (
                                    <div key={cardName} className="combo-card-image-wrap">
                                        {card && <img src={card.src} alt={card.name} className="combo-card-img" />}
                                        <span className="combo-card-name">{cardName}</span>
                                    </div>
                                );
                            };

                            const isPair = sortedCards.length === 2;

                            return (
                                <div key={i} className={`combo-item${isPair ? ' combo-item--pair' : ''}`}>
                                    {isPair ? (
                                        <>
                                            {renderCard(sortedCards[0])}
                                            <div className="combo-item-center">
                                                <div className="combo-meaning">{match.meaning}</div>
                                                <span className={`combo-badge ${match.category}`}>{match.category.replace('_', ' ')}</span>
                                            </div>
                                            {renderCard(sortedCards[1])}
                                        </>
                                    ) : (
                                        <>
                                            <div className="combo-card-images">
                                                {sortedCards.map(renderCard)}
                                            </div>
                                            <div className="combo-meaning">{match.meaning}</div>
                                            <span className={`combo-badge ${match.category}`}>{match.category.replace('_', ' ')}</span>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                        <button className="combo-modal-close" onClick={() => setVisible(false)}>Got it</button>
                    </>
                )}
            </div>
        </div>
    );
}
