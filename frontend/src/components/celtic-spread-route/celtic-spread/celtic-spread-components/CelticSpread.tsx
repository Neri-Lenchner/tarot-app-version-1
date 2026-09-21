import styles from './CelticSpread.module.css';
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
import {CardModal, cardModalText} from "../../../general-components/CardModal/CardModal";

// Indexed lookup instead of bracket access on `styles` (e.g.
// styles[`cardContainer${i + 1}`]) so a typo'd/renamed class is a
// compile-time error, not a silently-missing style at runtime.
const CARD_CONTAINER_CLASSES = [
    styles.cardContainer1, styles.cardContainer2, styles.cardContainer3,
    styles.cardContainer4, styles.cardContainer5, styles.cardContainer6,
    styles.cardContainer7, styles.cardContainer8, styles.cardContainer9,
    styles.cardContainer10,
];

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
        <div className={styles.container}>
            <div className={styles.readyQuestionsStack}>
                <h2 className={styles.readyQuestionsTitle} dir={lang === 'he' ? 'rtl' : 'ltr'}>{translate('maybeAsk', lang)}</h2>
                {READY_QUESTIONS.map(q => (
                    <div key={q.en} className={styles.readyQuestion} onClick={() => handleReadyQuestionClick(q)} dir={lang === 'he' ? 'rtl' : 'ltr'}>
                        {lang === 'he' ? q.he : q.en}
                    </div>
                ))}
                {clearWarning && (
                    <div className={styles.readyQuestionWarningOverlay}>
                        <div className={styles.readyQuestionWarning} dir={lang === 'he' ? 'rtl' : 'ltr'}>
                            {translate('clearSpreadWarning', lang)}
                        </div>
                    </div>
                )}
            </div>
            {positions.map((label: string, i): JSX.Element => (
                <div
                    key={label}
                    className={CARD_CONTAINER_CLASSES[i]}
                    onClick={(): false | void => isSpread && setSelectedIndex(i)}
                    style={isSpread ? {cursor: "pointer"} : {}}
                >
                    <h5 dir={lang === 'he' ? 'rtl' : 'ltr'}>{translatePosition(label, lang)}</h5>
                    <div className={styles.cardVignette}>
                        <img
                            className={styles.card}
                            src={isSpread ? (cards[i]?.src || "/Tarot-deck-images/cards-back.jpg") : "/Tarot-deck-images/cards-back.jpg"}
                            alt={isSpread ? cards[i]?.alt : "card back"}
                        />
                    </div>
                </div>
            ))}

            {selectedIndex !== null && (
                <CardModal
                    name={selectedCard?.name}
                    position={translatePosition(positions[selectedIndex], modalLang)}
                    dir={modalLang === 'he' ? 'rtl' : 'ltr'}
                    langLabel={hasBoth ? (modalLang === 'en' ? 'HE' : 'EN') : undefined}
                    onLangToggle={hasBoth ? () => setModalLang(language => language === 'en' ? 'he' : 'en') : undefined}
                    onClose={() => setSelectedIndex(null)}
                >
                    {cardSection ? (
                        <p className={cardModalText.desc}>{cardSection}</p>
                    ) : selectedApiCard ? (
                        <>
                            <p className={cardModalText.meaning}><strong>{translate('meaning', modalLang)}</strong> {modalLang === 'he' ? (selectedApiCard.meaning_up_he ?? selectedApiCard.meaning_up) : selectedApiCard.meaning_up}</p>
                            <p className={cardModalText.desc}>{modalLang === 'he' ? (selectedApiCard.desc_he ?? selectedApiCard.desc) : selectedApiCard.desc}</p>
                        </>
                    ) : (
                        <p className={cardModalText.meaning}>{translate('noDetails', modalLang)}</p>
                    )}
                </CardModal>
            )}
        </div>
    );
}
