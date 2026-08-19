import {JSX, useState} from "react";
import './ThreeCardsSpread.css';

const POSITIONS = ["Past", "Present", "Future"];

export function ThreeCardsSpread({ isSpread3, cards, apiCards }: { isSpread3: boolean, cards: any[], apiCards: any[] }): JSX.Element {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const selectedCard = selectedIndex !== null ? cards[selectedIndex] : null;
    const selectedApiCard = selectedCard
        ? apiCards.find((c: any) => c.name === selectedCard.name)
        : null;

    return (
        <div className="three-cards-spread-container">
            {POSITIONS.map((label, i) => (
                <div
                    key={label}
                    className="card-container"
                    onClick={() => isSpread3 && setSelectedIndex(i)}
                    style={isSpread3 ? {cursor: "pointer"} : {}}
                >
                    <h2>{label}</h2>
                    <img
                        className="card"
                        src={isSpread3 ? (cards[i]?.src || "/Tarot-deck-images/cards-back.jpg") : "/Tarot-deck-images/cards-back.jpg"}
                        alt={isSpread3 ? cards[i]?.alt : "card back"}
                    />
                </div>
            ))}

            {selectedIndex !== null && (
                <div className="card-modal-overlay" onClick={() => setSelectedIndex(null)}>
                    <div className="card-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="card-modal-close" onClick={() => setSelectedIndex(null)}>✕</button>
                        <h3 className="card-modal-name">{selectedCard?.name}</h3>
                        <p className="card-modal-position">{POSITIONS[selectedIndex]}</p>
                        {selectedApiCard ? (
                            <>
                                <p className="card-modal-meaning"><strong>Meaning:</strong> {selectedApiCard.meaning_up}</p>
                                <p className="card-modal-desc">{selectedApiCard.desc}</p>
                            </>
                        ) : (
                            <p className="card-modal-meaning">No details available.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
