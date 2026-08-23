import {JSX, useState, useEffect} from "react";
import './ThreeCardsSpread.css';
import {interpretStore} from "../../../../state/interpret-state";

function extractCardSection(text: string, cardName: string): string | null {
    const escaped = cardName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const cardRegex = new RegExp(escaped, 'i');
    const paragraph = text.split(/\n\n+/).find(p => cardRegex.test(p) && !/^\*\*Conclusion/i.test(p.trim()));
    return paragraph ? paragraph.trim() : null;
}

export function ThreeCardsSpread({ isSpread3, cards, apiCards, positions }: { isSpread3: boolean, cards: any[], apiCards: any[], positions: string[] }): JSX.Element {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [lang, setLang] = useState<'en' | 'he'>('en');
    const [spreadData, setSpreadData] = useState(() => interpretStore.getState()['three-cards']);

    useEffect(() => {
        const unsubscribe = interpretStore.subscribe(() => {
            setSpreadData(interpretStore.getState()['three-cards']);
        });
        return unsubscribe;
    }, []);

    const interpretation = spreadData[lang];
    const hasBoth = spreadData.en !== null && spreadData.he !== null;

    const selectedCard = selectedIndex !== null ? cards[selectedIndex] : null;
    const selectedApiCard = selectedCard
        ? apiCards.find((c: any) => c.name === selectedCard.name)
        : null;
    const cardSection = selectedCard && interpretation ? extractCardSection(interpretation, selectedCard.name) : null;

    return (
        <div className="three-cards-spread-container">
            {positions.map((label, i) => (
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
                        <div className="card-modal-header">
                            <button className="card-modal-close" onClick={() => setSelectedIndex(null)}>✕</button>
                            {hasBoth && (
                                <button className="card-modal-lang-btn" onClick={() => setLang(l => l === 'en' ? 'he' : 'en')}>
                                    {lang === 'en' ? 'HE' : 'EN'}
                                </button>
                            )}
                        </div>
                        <h3 className="card-modal-name">{selectedCard?.name}</h3>
                        <p className="card-modal-position">{positions[selectedIndex]}</p>
                        <div dir={lang === 'he' ? 'rtl' : 'ltr'}>
                            {cardSection ? (
                                <p className="card-modal-desc">{cardSection}</p>
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
                </div>
            )}
        </div>
    );
}
