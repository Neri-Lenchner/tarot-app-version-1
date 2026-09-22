import {JSX, useEffect, useState} from 'react';
import {Sparkles} from 'lucide-react';
import styles from './MasterSpread.module.css';
import {FannedDeck} from "../../../general-components/FannedDeck/FannedDeck";
import {interpretStore} from "../../../../state/interpret-state";
import {ISpreadInterpretation} from "../../../../arrays-&-models/SpreadInterpretation.model";
import {ITarotCard} from "../../../../arrays-&-models/tarot-deck-array/tarotCard.interface";
import {TarotCardData} from "../../../../arrays-&-models/TarotCardData.model";
import {useLang} from "../../../../state/lang-state";
import {translate, translatePosition} from "../../../../state/translations";
import {IReadyQuestion} from "../../../../arrays-&-models/readyQuestion.interface";
import {READY_QUESTIONS} from "../../../../arrays-&-models/readyQuestions";
import {CardModal, cardModalText} from "../../../general-components/CardModal/CardModal";

// Master Spread's interpretation is 4 fixed row paragraphs (Past, Present,
// Future, Potential — see masterBodyInstruction in tarot.service.ts), each
// synthesizing 3 cards together and often naming a card from an ADJACENT row
// too (court-card "meetings" that span rows, or the Potential paragraph
// recapping the Past/Present/Future story). Scanning for "the first paragraph
// that mentions this card's name" (the approach Celtic/ThreeCards use, where
// every paragraph is truly one card) can therefore land on the wrong
// paragraph. Instead, pick the row paragraph purely by its fixed ordinal
// position: paragraph 0 is always the opening impression, then exactly the
// four body paragraphs in order, then (optionally) the attention section and
// **Conclusion** — so the row's own paragraph is always bodyParagraphs[rowPos].
function extractRowSection(text: string, rowPos: number): string | null {
    const paragraphs = text.split(/\n\n+/).map(p => p.trim()).filter(p => p.length > 0);
    const bodyParagraphs: string[] = [];
    for (let i = 1; i < paragraphs.length; i++) {
        if (paragraphs[i].startsWith('**')) break;
        bodyParagraphs.push(paragraphs[i]);
    }
    return bodyParagraphs[rowPos] ?? null;
}

interface Props {
    isSpread: boolean;
    allChosen: boolean;
    positions: string[];
    chosenCards: (ITarotCard | null)[];
    fanCards: ITarotCard[];
    apiCards: TarotCardData[];
    onChoose: (card: ITarotCard) => void;
    onQuestionSelect: (q: IReadyQuestion) => void;
}

export function MasterSpread({ isSpread, allChosen, positions, chosenCards, fanCards, apiCards, onChoose, onQuestionSelect }: Props): JSX.Element {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [modalLang, setModalLang] = useState<'en' | 'he'>('en');
    const lang = useLang();
    const [spreadData, setSpreadData] = useState((): ISpreadInterpretation => interpretStore.getState()['master-spread']);
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

    useEffect((): (() => void) => {
        const unsubscribe = interpretStore.subscribe((): void => {
            setSpreadData(interpretStore.getState()['master-spread']);
        });
        return unsubscribe;
    }, []);

    const interpretation: string | null = spreadData[modalLang];
    const hasBoth: boolean = spreadData.en !== null && spreadData.he !== null;

    const selectedCard: ITarotCard | null = selectedIndex !== null ? chosenCards[selectedIndex] : null;
    const selectedApiCard: TarotCardData | null | undefined = selectedCard
        ? apiCards.find((c: TarotCardData): boolean => c.name === selectedCard.name)
        : null;
    const rowPos: number | null = selectedIndex !== null ? (selectedIndex === 9 ? 3 : Math.floor(selectedIndex / 3)) : null;
    const cardSection: string | null = rowPos !== null && interpretation ? extractRowSection(interpretation, rowPos) : null;

    return (
        <div className={styles.container}>
            <div className={styles.readyQuestionsStack}>
                <h3 className={styles.readyQuestionsTitle} dir={lang === 'he' ? 'rtl' : 'ltr'}>{translate('maybeAsk', lang)}</h3>
                {READY_QUESTIONS.map(q => (
                    <div key={q.en} className={styles.readyQuestion} onClick={() => handleReadyQuestionClick(q)} dir={lang === 'he' ? 'rtl' : 'ltr'}>
                        {lang === 'he' ? q.he : q.en}
                    </div>
                ))}
                {clearWarning && (
                    <div className={styles.readyQuestionWarningOverlay}>
                        <div className={styles.readyQuestionWarning} dir={lang === 'he' ? 'rtl' : 'ltr'} role="alert">
                            {translate('clearSpreadWarning', lang)}
                        </div>
                    </div>
                )}
            </div>

            {isSpread && !allChosen && (
                <FannedDeck cards={fanCards} onChoose={onChoose} />
            )}

            <div className={styles.gridArea}>
                <div className={styles.grid}>
                    {[0, 1, 2].map((rowIdx: number): JSX.Element => (
                        <div className={styles.row} key={rowIdx}>
                            <h5 className={styles.rowLabel} dir={lang === 'he' ? 'rtl' : 'ltr'}>
                                {translatePosition(positions[rowIdx * 3].split(' - ')[0], lang)}
                            </h5>
                            <div className={styles.rowCards}>
                                {[0, 1, 2].map((colIdx: number): JSX.Element => {
                                    const i = rowIdx * 3 + colIdx;
                                    return (
                                        <div
                                            key={positions[i]}
                                            className={styles.cell}
                                            onClick={() => chosenCards[i] && setSelectedIndex(i)}
                                            style={chosenCards[i] ? {cursor: "pointer"} : {}}
                                        >
                                            <div className={styles.cardSlot}>
                                                {chosenCards[i] ? (
                                                    <div className={styles.cardVignette}>
                                                        <img className={styles.card} src={chosenCards[i]!.src} alt={chosenCards[i]!.alt} />
                                                    </div>
                                                ) : (
                                                    <div className={styles.emptySlot}>
                                                        <Sparkles className={styles.emptySlotIcon} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                <div
                    className={styles.potentialCell}
                    onClick={() => chosenCards[9] && setSelectedIndex(9)}
                    style={chosenCards[9] ? {cursor: "pointer"} : {}}
                >
                    <h5 dir={lang === 'he' ? 'rtl' : 'ltr'}>{translatePosition(positions[9], lang)}</h5>
                    <div className={styles.cardSlot}>
                        {chosenCards[9] ? (
                            <div className={styles.cardVignette}>
                                <img className={styles.card} src={chosenCards[9]!.src} alt={chosenCards[9]!.alt} />
                            </div>
                        ) : (
                            <div className={styles.emptySlot}>
                                <Sparkles className={styles.emptySlotIcon} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

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
