import {JSX, useState, useEffect} from "react";
import {X} from "lucide-react";
import './ThreeCardsSpread.css';
import {interpretStore} from "../../../../state/interpret-state";
import {ITarotCard} from "../../../../arrays-&-models/tarot-deck-array/tarotCard.interface";
import {TarotCardData} from "../../../../arrays-&-models/TarotCardData.model";
import {useLang} from "../../../../state/lang-state";
import {translate, translatePosition} from "../../../../state/translations";
import {IReadyQuestion} from "../../../../arrays-&-models/readyQuestion.interface";
import {READY_QUESTIONS} from "../../../../arrays-&-models/readyQuestions";

function extractCardSection(text: string, cardName: string): string | null {
    const escaped = cardName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const cardRegex = new RegExp(escaped, 'i');
    const paragraph = text.split(/\n\n+/).find(p => cardRegex.test(p) && !/^\*\*Conclusion/i.test(p.trim()));
    return paragraph ? paragraph.trim() : null;
}

interface Props {
    isSpread3: boolean;
    cards: ITarotCard[];
    apiCards: TarotCardData[];
    positions: string[];
    onQuestionSelect: (q: IReadyQuestion) => void;
}

export function ThreeCardsSpread({ isSpread3, cards, apiCards, positions, onQuestionSelect }: Props): JSX.Element {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [modalLang, setModalLang] = useState<'en' | 'he'>('en');
    const lang = useLang();
    const [spreadData, setSpreadData] = useState(() => interpretStore.getState()['three-cards']);
    const [clearWarning, setClearWarning] = useState(false);

    useEffect((): (() => void) | void => {
        if (!clearWarning) return;
        const timer: ReturnType<typeof setTimeout> = setTimeout(() => setClearWarning(false), 3000);
        return () => clearTimeout(timer);
    }, [clearWarning]);

    const handleReadyQuestionClick = (q: IReadyQuestion): void => {
        if (isSpread3) {
            setClearWarning(true);
            return;
        }
        onQuestionSelect(q);
    };

    useEffect(() => {
        const unsubscribe = interpretStore.subscribe(() => {
            setSpreadData(interpretStore.getState()['three-cards']);
        });
        return unsubscribe;
    }, []);

    const interpretation = spreadData[modalLang];
    const hasBoth = spreadData.en !== null && spreadData.he !== null;

    const selectedCard = selectedIndex !== null ? cards[selectedIndex] : null;
    const selectedApiCard = selectedCard
        ? apiCards.find((c: TarotCardData) => c.name === selectedCard.name)
        : null;
    const cardSection = selectedCard && interpretation ? extractCardSection(interpretation, selectedCard.name) : null;

    return (
        <div className="three-cards-spread-container">
            <div className="ready-questions-stack">
                <h3 className="ready-questions-title" dir={lang === 'he' ? 'rtl' : 'ltr'}>{translate('maybeAsk', lang)}</h3>
                {READY_QUESTIONS.map(q => (
                    <div key={q.en} className="ready-question" onClick={() => handleReadyQuestionClick(q)} dir={lang === 'he' ? 'rtl' : 'ltr'}>
                        {lang === 'he' ? q.he : q.en}
                    </div>
                ))}
                {clearWarning && (
                    <div className="ready-question-warning" dir={lang === 'he' ? 'rtl' : 'ltr'}>
                        {translate('clearSpreadWarning', lang)}
                    </div>
                )}
            </div>
            {positions.map((label, i) => (
                <div
                    key={label}
                    className="card-container"
                    onClick={() => isSpread3 && setSelectedIndex(i)}
                    style={isSpread3 ? {cursor: "pointer"} : {}}
                >
                    <h2 dir={lang === 'he' ? 'rtl' : 'ltr'}>{translatePosition(label, lang)}</h2>
                    <div className="card-vignette">
                        <img
                            className="card"
                            src={isSpread3 ? (cards[i]?.src || "/Tarot-deck-images/cards-back.jpg") : "/Tarot-deck-images/cards-back.jpg"}
                            alt={isSpread3 ? cards[i]?.alt : "card back"}
                        />
                    </div>
                </div>
            ))}

            {selectedIndex !== null && (
                <div className="card-modal-overlay modal-widget-root" onClick={() => setSelectedIndex(null)}>
                    <div className="card-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="card-modal-header">
                            <button className="card-modal-close" onClick={() => setSelectedIndex(null)}><X size={18} /></button>
                            {hasBoth && (
                                <button className="card-modal-lang-btn" onClick={() => setModalLang(l => l === 'en' ? 'he' : 'en')}>
                                    {modalLang === 'en' ? 'HE' : 'EN'}
                                </button>
                            )}
                        </div>
                        <h3 className="card-modal-name">{selectedCard?.name}</h3>
                        <p className="card-modal-position" dir={modalLang === 'he' ? 'rtl' : 'ltr'}>{translatePosition(positions[selectedIndex], modalLang)}</p>
                        <div dir={modalLang === 'he' ? 'rtl' : 'ltr'}>
                            {cardSection ? (
                                <p className="card-modal-desc">{cardSection}</p>
                            ) : selectedApiCard ? (
                                <>
                                    <p className="card-modal-meaning"><strong>{translate('meaning', modalLang)}</strong> {modalLang === 'he' ? (selectedApiCard.meaning_up_he ?? selectedApiCard.meaning_up) : selectedApiCard.meaning_up}</p>
                                    <p className="card-modal-desc">{modalLang === 'he' ? (selectedApiCard.desc_he ?? selectedApiCard.desc) : selectedApiCard.desc}</p>
                                </>
                            ) : (
                                <p className="card-modal-meaning">{translate('noDetails', modalLang)}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
