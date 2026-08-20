import { JSX } from 'react';
import { ICombinationMatch } from '../../services/CombinationsService';
import { cardsDeck } from '../../arrays-&-models/tarot-deck-array/tarotDeck';
import './CombinationsModal.css';

interface CombinationsModalProps {
    matches: ICombinationMatch[];
    onClose: () => void;
}

export function CombinationsModal({ matches, onClose }: CombinationsModalProps): JSX.Element {
    return (
        <div className="combo-modal-overlay" onClick={onClose}>
            <div className="combo-modal" onClick={e => e.stopPropagation()}>
                <h3 className="combo-modal-title">✦ Card Combinations Detected</h3>
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
            </div>
        </div>
    );
}
