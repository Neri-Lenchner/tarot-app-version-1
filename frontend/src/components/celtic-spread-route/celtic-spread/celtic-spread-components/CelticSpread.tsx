import './CelticSpread.css';
import {useState, useEffect, JSX} from "react";
import {interpretStore} from "../../../../state/interpret-state";
import {ISpreadInterpretation} from "../../../../arrays-&-models/SpreadInterpretation.model";
import {Unsubscribe} from "redux";
import {ITarotCard} from "../../../../arrays-&-models/tarot-deck-array/tarotCard.interface";
import {TarotCardData} from "../../../../arrays-&-models/TarotCardData.model";

function extractCardSection(text: string, cardName: string): string | null {
    const escaped: string = cardName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const cardRegex = new RegExp(escaped, 'i');
    const paragraph: string | undefined = text.split(/\n\n+/).find(p => cardRegex.test(p) && !/^\*\*Conclusion/i.test(p.trim()));
    return paragraph ? paragraph.trim() : null;
}

export interface IReadyQuestion {
    en: string;
    he: string;
}

const READY_QUESTIONS: IReadyQuestion[] = [
    { en: "Tell me what I need to know", he: "ספרו לי מה אני צריך לדעת" },
    { en: "Tell me about love", he: "ספרו לי על אהבה" },
    { en: "Tell me about money", he: "ספרו לי על כסף" },
    { en: "Tell me about health", he: "ספרו לי על בריאות" },
];

interface Props {
    isSpread: boolean;
    cards: ITarotCard[];
    apiCards: TarotCardData[];
    positions: string[];
    onQuestionSelect: (q: IReadyQuestion) => void;
}

export function CelticSpread({ isSpread, cards, apiCards, positions, onQuestionSelect }: Props) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [lang, setLang] = useState<'en' | 'he'>('en');
    const [spreadData, setSpreadData] = useState((): ISpreadInterpretation => interpretStore.getState().celtic);
    const [clearWarning, setClearWarning] = useState(false);

    useEffect((): (() => void) | void => {
        if (!clearWarning) return;
        const timer: ReturnType<typeof setTimeout> = setTimeout(() => setClearWarning(false), 3000);
        return () => clearTimeout(timer);
    }, [clearWarning]);

    const handleReadyQuestionClick = (q: IReadyQuestion): void => {
        if (isSpread) {
            setClearWarning(true);
            return;
        }
        onQuestionSelect(q);
    };

    useEffect((): Unsubscribe => {
        const unsubscribe: Unsubscribe = interpretStore.subscribe((): void => {
            setSpreadData(interpretStore.getState().celtic);
        });
        return unsubscribe;
    }, []);

    const interpretation: string | null = spreadData[lang];
    const hasBoth: boolean = spreadData.en !== null && spreadData.he !== null;

    const selectedCard: ITarotCard | null = selectedIndex !== null ? cards[selectedIndex] : null;
    const selectedApiCard: TarotCardData | null | undefined= selectedCard
        ? apiCards.find((c: TarotCardData): boolean => c.name === selectedCard.name)
        : null;

    const cardSection: string | null = selectedCard && interpretation ? extractCardSection(interpretation, selectedCard.name) : null;

    return (
        <div className="spread-container">
            <div className="ready-questions-stack">
                <h2 className="ready-questions-title">Maybe you want to ask: </h2>
                {READY_QUESTIONS.map(q => (
                    <div key={q.en} className="ready-question" onClick={() => handleReadyQuestionClick(q)}>
                        {q.en}
                    </div>
                ))}
                {clearWarning && (
                    <div className="ready-question-warning">
                        Please clear the current spread first
                    </div>
                )}
            </div>
            {positions.map((label: string, i): JSX.Element => (
                <div
                    key={label}
                    className={`card-container-${i + 1}`}
                    onClick={(): false | void => isSpread && setSelectedIndex(i)}
                    style={isSpread ? {cursor: "pointer"} : {}}
                >
                    <h5>{label}</h5>
                    <div className="card-vignette">
                        <img
                            className="card"
                            src={isSpread ? (cards[i]?.src || "/Tarot-deck-images/cards-back.jpg") : "/Tarot-deck-images/cards-back.jpg"}
                            alt={isSpread ? cards[i]?.alt : "card back"}
                        />
                    </div>
                </div>
            ))}

            {selectedIndex !== null && (
                <div className="card-modal-overlay" onClick={(): void => setSelectedIndex(null)}>
                    <div className="card-modal" onClick={(e): void => e.stopPropagation()}>
                        <div className="card-modal-header">
                            <button className="card-modal-close" onClick={() => setSelectedIndex(null)}>✕</button>
                            {hasBoth && (
                                <button className="card-modal-lang-btn" onClick={() => setLang(language => language === 'en' ? 'he' : 'en')}>
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
