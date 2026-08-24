import './CelticSpread.css';
import {useState, useEffect, JSX} from "react";
import {interpretStore} from "../../../../state/interpret-state";
import {ISpreadInterpretation} from "../../../../arrays-&-models/SpreadInterpretation.model";
import {Unsubscribe} from "redux";
import {ITarotCard} from "../../../../arrays-&-models/tarot-deck-array/tarotCard.interface";
import {TarotCardData} from "../../../../arrays-&-models/TarotCardData.model";
import {useLang} from "../../../../state/lang-state";
import {translate, translatePosition} from "../../../../state/translations";
import {IReadyQuestion} from "../../../../arrays-&-models/readyQuestion.interface";
import {READY_QUESTIONS} from "../../../../arrays-&-models/readyQuestions";

function extractCardSection(text: string, cardName: string): string | null {
    const escaped: string = cardName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const cardRegex = new RegExp(escaped, 'i');
    const paragraph: string | undefined = text.split(/\n\n+/).find(p => cardRegex.test(p) && !/^\*\*Conclusion/i.test(p.trim()));
    return paragraph ? paragraph.trim() : null;
}

interface Props {
    isSpread: boolean;
    cards: ITarotCard[];
    apiCards: TarotCardData[];
    positions: string[];
    onQuestionSelect: (q: IReadyQuestion) => void;
}

export function CelticSpread({ isSpread, cards, apiCards, positions, onQuestionSelect }: Props) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [modalLang, setModalLang] = useState<'en' | 'he'>('en');
    const lang = useLang();
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

    const interpretation: string | null = spreadData[modalLang];
    const hasBoth: boolean = spreadData.en !== null && spreadData.he !== null;

    const selectedCard: ITarotCard | null = selectedIndex !== null ? cards[selectedIndex] : null;
    const selectedApiCard: TarotCardData | null | undefined= selectedCard
        ? apiCards.find((c: TarotCardData): boolean => c.name === selectedCard.name)
        : null;

    const cardSection: string | null = selectedCard && interpretation ? extractCardSection(interpretation, selectedCard.name) : null;

    return (
        <div className="spread-container">
            <div className="ready-questions-stack">
                <h2 className="ready-questions-title" dir={lang === 'he' ? 'rtl' : 'ltr'}>{translate('maybeAsk', lang)}</h2>
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
            {positions.map((label: string, i): JSX.Element => (
                <div
                    key={label}
                    className={`card-container-${i + 1}`}
                    onClick={(): false | void => isSpread && setSelectedIndex(i)}
                    style={isSpread ? {cursor: "pointer"} : {}}
                >
                    <h5 dir={lang === 'he' ? 'rtl' : 'ltr'}>{translatePosition(label, lang)}</h5>
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
                <div className="card-modal-overlay modal-widget-root" onClick={(): void => setSelectedIndex(null)}>
                    <div className="card-modal" onClick={(e): void => e.stopPropagation()}>
                        <div className="card-modal-header">
                            <button className="card-modal-close" onClick={() => setSelectedIndex(null)}>✕</button>
                            {hasBoth && (
                                <button className="card-modal-lang-btn" onClick={() => setModalLang(language => language === 'en' ? 'he' : 'en')}>
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
                                    <p className="card-modal-meaning"><strong>{translate('meaning', modalLang)}</strong> {selectedApiCard.meaning_up}</p>
                                    <p className="card-modal-desc">{selectedApiCard.desc}</p>
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
