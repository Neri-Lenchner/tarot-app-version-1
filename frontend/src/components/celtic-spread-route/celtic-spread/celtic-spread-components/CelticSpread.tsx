import './CelticSpread.css';
import {useState} from "react";

const POSITIONS = [
    "Positive Energy", "Negative Energy", "Past", "Present",
    "Near Future", "Far Future", "Inside", "Outside", "Fears", "Potential"
];

export function CelticSpread({ isSpread, cards, apiCards }: { isSpread: boolean, cards: any[], apiCards: any[] }) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const selectedCard = selectedIndex !== null ? cards[selectedIndex] : null;
    const selectedApiCard = selectedCard
        ? apiCards.find((c: any) => c.name === selectedCard.name)
        : null;

    return (
        <div className="spread-container">
            {POSITIONS.map((label, i) => (
                <div
                    key={label}
                    className={`card-container-${i + 1}`}
                    onClick={() => isSpread && setSelectedIndex(i)}
                    style={isSpread ? {cursor: "pointer"} : {}}
                >
                    <h5>{label}</h5>
                    <img
                        className="card"
                        src={isSpread ? (cards[i]?.src || "/Tarot-deck-images/cards-back.jpg") : "/Tarot-deck-images/cards-back.jpg"}
                        alt={isSpread ? cards[i]?.alt : "card back"}
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
