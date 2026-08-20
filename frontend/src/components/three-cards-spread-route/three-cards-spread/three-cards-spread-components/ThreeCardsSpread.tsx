import {JSX, useState, useEffect} from "react";
import './ThreeCardsSpread.css';
import {interpretStore} from "../../../../state/interpret-state";

function extractCardSection(text: string, cardName: string): string | null {
    const escaped = cardName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const cardRegex = new RegExp(escaped, 'i');
    const paragraph = text.split(/\n\n+/).find(p => cardRegex.test(p) && !/^\*\*Conclusion/i.test(p.trim()));
    return paragraph ? paragraph.trim() : null;
}

const POSITIONS = ["Past", "Present", "Future"];

export function ThreeCardsSpread({ isSpread3, cards, apiCards }: { isSpread3: boolean, cards: any[], apiCards: any[] }): JSX.Element {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [interpretation, setInterpretation] = useState<string | null>(
        () => interpretStore.getState()['three-cards'].en
    );

    useEffect(() => {
        const unsubscribe = interpretStore.subscribe(() => {
            setInterpretation(interpretStore.getState()['three-cards'].en);
        });
        return unsubscribe;
    }, []);

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
                        {selectedCard && interpretation && extractCardSection(interpretation, selectedCard.name) ? (
                            <p className="card-modal-desc">{extractCardSection(interpretation, selectedCard.name)}</p>
                        ) : selectedApiCard ? (
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
