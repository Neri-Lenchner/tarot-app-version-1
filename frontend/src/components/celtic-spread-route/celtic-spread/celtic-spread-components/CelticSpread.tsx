import './CelticSpread.css';
import {useState, useEffect} from "react";
import {interpretStore} from "../../../../state/interpret-state";
import {ISpreadInterpretation} from "../../../../arrays-&-models/SpreadInterpretation.model";
import {Unsubscribe} from "redux";

function extractCardSection(text: string, cardName: string): string | null {
    const escaped: string = cardName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const cardRegex = new RegExp(escaped, 'i');
    const paragraph: string | undefined = text.split(/\n\n+/).find(p => cardRegex.test(p) && !/^\*\*Conclusion/i.test(p.trim()));
    return paragraph ? paragraph.trim() : null;
}

const POSITIONS: string[] = [
    "Positive Energy", "Negative Energy", "Past", "Present",
    "Near Future", "Far Future", "Inside", "Outside", "Fears", "Potential"
];

export function CelticSpread({ isSpread, cards, apiCards }: { isSpread: boolean, cards: any[], apiCards: any[] }) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [lang, setLang] = useState<'en' | 'he'>('en');
    const [spreadData, setSpreadData] = useState((): ISpreadInterpretation => interpretStore.getState().celtic);

    useEffect((): Unsubscribe => {
        const unsubscribe: Unsubscribe = interpretStore.subscribe((): void => {
            setSpreadData(interpretStore.getState().celtic);
        });
        return unsubscribe;
    }, []);

    const interpretation: string | null = spreadData[lang];
    const hasBoth: boolean = spreadData.en !== null && spreadData.he !== null;

    const selectedCard = selectedIndex !== null ? cards[selectedIndex] : null;
    const selectedApiCard = selectedCard
        ? apiCards.find((c: any): boolean => c.name === selectedCard.name)
        : null;

    return (
        <div className="spread-container">
            {POSITIONS.map((label: string, i) => (
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
                        <div className="card-modal-header">
                            <button className="card-modal-close" onClick={() => setSelectedIndex(null)}>✕</button>
                            {hasBoth && (
                                <button className="card-modal-lang-btn" onClick={() => setLang(l => l === 'en' ? 'he' : 'en')}>
                                    {lang === 'en' ? 'HE' : 'EN'}
                                </button>
                            )}
                        </div>
                        <h3 className="card-modal-name">{selectedCard?.name}</h3>
                        <p className="card-modal-position">{POSITIONS[selectedIndex]}</p>
                        <div dir={lang === 'he' ? 'rtl' : 'ltr'}>
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
                </div>
            )}
        </div>
    );
}
