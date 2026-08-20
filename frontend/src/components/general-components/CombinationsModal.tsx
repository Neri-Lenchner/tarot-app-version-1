import { JSX, useState } from 'react';
import { ICombinationMatch } from '../../services/CombinationsService';
import { cardsDeck } from '../../arrays-&-models/tarot-deck-array/tarotDeck';
import './CombinationsModal.css';

interface CombinationsModalProps {
    matches: ICombinationMatch[];
    onClose: () => void;
}

export function CombinationsModal({ matches, onClose }: CombinationsModalProps): JSX.Element {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="combo-modal-overlay" onClick={collapsed ? undefined : onClose}>
            <div className={`combo-modal${collapsed ? ' combo-modal--collapsed' : ''}`} onClick={e => e.stopPropagation()}>
                <div className="combo-modal-header">
                    <span className="combo-modal-title">✦ Card Combinations Detected</span>
                    <button className="combo-collapse-btn" onClick={() => setCollapsed(c => !c)}>
                        {collapsed ? '▲' : '▼'}
                    </button>
                </div>
                {!collapsed && (
                    <>
                        {matches.map((match, i) => (
                            <div key={i} className="combo-item">
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
                                <div className="combo-meaning">{match.meaning}</div>
                                <span className={`combo-badge ${match.category}`}>{match.category.replace('_', ' ')}</span>
                            </div>
                        ))}
                        <button className="combo-modal-close" onClick={onClose}>Got it</button>
                    </>
                )}
            </div>
        </div>
    );
}
