import {JSX, useEffect, useRef, useState} from 'react';
import {User} from "lucide-react";
import {SpreadHeader} from "../../general-components/SpreadHeader/SpreadHeader";
import {MasterSpread} from "./master-spread-components/MasterSpread";
import {InterpretWidget} from "../../general-components/InterpretWidget/InterpretWidget";
import {CombinationsModal} from "../../general-components/CombinationsModal/CombinationsModal";
import {ConclusionModal} from "../../general-components/ConclusionModal/ConclusionModal";
import {ITarotCard} from "../../../arrays-&-models/tarot-deck-array/tarotCard.interface";
import {TarotCardData} from "../../../arrays-&-models/TarotCardData.model";
import {ICombinationMatch} from "../../../arrays-&-models/combinationMatch.interface";
import {IReadyQuestion} from "../../../arrays-&-models/readyQuestion.interface";
import {deckService} from "../../../services/DeckService";
import {deckStore} from "../../../state/deck-state";
import {interpretStore, InterpretActionType} from "../../../state/interpret-state";
import {combinationsService, filterByProximity, MASTER_ADJACENCY} from "../../../services/CombinationsService";
import {useLang} from "../../../state/lang-state";
import {translate} from "../../../state/translations";
import './MasterSpreadGlobal.css';

// Read top-to-bottom, and each row left-to-right like a story (Past, then
// Present, then Future); position 10 (Potential) is filled last and is
// handled the same way the Celtic spread treats its Potential card.
const POSITIONS = [
    "Past - Beginning", "Past - Middle", "Past - End",
    "Present - Beginning", "Present - Center", "Present - End",
    "Future - Beginning", "Future - Middle", "Future - End",
    "Potential",
];

const TOTAL_CARDS: number = POSITIONS.length;

function emptyChosen(): (ITarotCard | null)[] {
    return Array(TOTAL_CARDS).fill(null);
}

export function MasterSpreadGlobal(): JSX.Element {
    const lang = useLang();
    const [apiCards, setApiCards] = useState<TarotCardData[]>(deckService.tarotCardsDetails);

    useEffect(() => {
        const unsubscribe = deckStore.subscribe(() => {
            setApiCards(deckService.tarotCardsDetails);
        });
        return unsubscribe;
    }, []);

    const [question, setQuestion] = useState('');
    const [submittedQuestion, setSubmittedQuestion] = useState<string>(
        (): string => localStorage.getItem("submittedQuestionMaster") ?? ''
    );
    const [submittedQuestionHe, setSubmittedQuestionHe] = useState<string>(
        (): string => localStorage.getItem("submittedQuestionHeMaster") ?? ''
    );
    const [widgetOpen, setWidgetOpen] = useState(false);
    const [comboMatches, setComboMatches] = useState<ICombinationMatch[]>([]);
    const [isThirdPerson, setIsThirdPerson] = useState(false);
    const [confirmedCombination, setConfirmedCombination] = useState<ICombinationMatch | null>(null);
    // Bumped on every spread/clear so an out-of-order (or stale, post-clear)
    // checkCombinations response can't overwrite a newer one — same class of
    // race the interpretStore's requestId guards against.
    const comboRequestRef = useRef(0);

    const [isSpread, setIsSpread] = useState<boolean>((): boolean => {
        return localStorage.getItem("isSpreadMaster") === "true";
    });

    const [fanCards, setFanCards] = useState<ITarotCard[]>((): ITarotCard[] => {
        const saved: string | null = localStorage.getItem("masterFanCards");
        if (saved === null) return [];
        try {
            const parsed = JSON.parse(saved);
            return Array.isArray(parsed) ? parsed : [];
        } catch { return []; }
    });

    const [chosenCards, setChosenCards] = useState<(ITarotCard | null)[]>((): (ITarotCard | null)[] => {
        const saved: string | null = localStorage.getItem("masterChosenCards");
        if (saved === null) return emptyChosen();
        try {
            const parsed = JSON.parse(saved);
            return Array.isArray(parsed) && parsed.length === TOTAL_CARDS ? parsed : emptyChosen();
        } catch { return emptyChosen(); }
    });

    useEffect((): void => {
        localStorage.setItem("isSpreadMaster", JSON.stringify(isSpread));
        localStorage.setItem("masterFanCards", JSON.stringify(fanCards));
        localStorage.setItem("masterChosenCards", JSON.stringify(chosenCards));
        localStorage.setItem("submittedQuestionMaster", submittedQuestion);
        localStorage.setItem("submittedQuestionHeMaster", submittedQuestionHe);
    }, [isSpread, fanCards, chosenCards, submittedQuestion, submittedQuestionHe]);

    const allChosen: boolean = chosenCards.every((c: ITarotCard | null): boolean => c !== null);

    // Card combinations (the "left modal") are plain component state with no
    // persistence — so navigating away and back restores the spread itself
    // but not its combo matches. Re-run the same lookup once on mount for
    // whatever completed spread was restored (mirrors ThreeCardsSpreadGlobal).
    useEffect(() => {
        if (!isSpread || !allChosen) return;
        const myComboRequest = ++comboRequestRef.current;
        combinationsService.checkCombinations(chosenCards.map(c => c!.name), submittedQuestion).then(matches => {
            if (comboRequestRef.current === myComboRequest) {
                setComboMatches(filterByProximity(matches, chosenCards as ITarotCard[], MASTER_ADJACENCY));
            }
        }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const beginReading = (): void => {
        setFanCards(deckService.spreadThemShuffle());
        setChosenCards(emptyChosen());
        setIsSpread(true);
        setWidgetOpen(false);
        setComboMatches([]);
        setConfirmedCombination(null);
        comboRequestRef.current++;
        interpretStore.dispatch({ type: InterpretActionType.Clear, spreadType: 'master-spread' });
    };

    const clearSpread = (): void => {
        setIsSpread(false);
        setFanCards([]);
        setChosenCards(emptyChosen());
        setSubmittedQuestion('');
        setSubmittedQuestionHe('');
        setWidgetOpen(false);
        setComboMatches([]);
        setConfirmedCombination(null);
        comboRequestRef.current++;
        interpretStore.dispatch({ type: InterpretActionType.Clear, spreadType: 'master-spread' });
    };

    const spreadThemMaster = (): void => {
        if (question.trim()) {
            setSubmittedQuestion(question.trim());
            setSubmittedQuestionHe('');
            setQuestion('');
        }
        beginReading();
    };

    const handleDraw = (): void => {
        if (isSpread) clearSpread();
        spreadThemMaster();
    };

    const handleChooseCard = (card: ITarotCard): void => {
        setChosenCards((prev: (ITarotCard | null)[]): (ITarotCard | null)[] => {
            const nextIndex: number = prev.findIndex((c: ITarotCard | null): boolean => c === null);
            if (nextIndex === -1) return prev;
            const updated: (ITarotCard | null)[] = [...prev];
            updated[nextIndex] = card;
            if (updated.every((c): boolean => c !== null)) {
                const finalCards = updated as ITarotCard[];
                const myComboRequest = ++comboRequestRef.current;
                combinationsService.checkCombinations(finalCards.map(c => c.name), submittedQuestion).then(matches => {
                    if (comboRequestRef.current === myComboRequest) {
                        setComboMatches(filterByProximity(matches, finalCards, MASTER_ADJACENCY));
                    }
                }).catch(() => {});
            }
            return updated;
        });
        setFanCards((prev: ITarotCard[]): ITarotCard[] => prev.filter((c: ITarotCard): boolean => c.id !== card.id));
    };

    const handleConfirmCombination = (combo: ICombinationMatch): void => {
        setConfirmedCombination(combo);
        setWidgetOpen(true);
    };

    const handleReadyQuestion = (q: IReadyQuestion): void => {
        setSubmittedQuestion(q.en);
        setSubmittedQuestionHe(q.he);
        setQuestion('');
        beginReading();
    };

    const displayQuestion: string = lang === 'he' ? (submittedQuestionHe || submittedQuestion) : submittedQuestion;

    return (
        <div className="master-spread-global-container">
            <SpreadHeader spreadThem={handleDraw} clearSpread={clearSpread}>
                <input
                    className="spread-question-input"
                    type="text"
                    placeholder={translate('questionPlaceholder', lang)}
                    value={question}
                    dir={lang === 'he' || /[֐-׿]/.test(question) ? 'rtl' : 'ltr'}
                    onChange={e => {
                        setQuestion(e.target.value);
                        if (isSpread) clearSpread();
                    }}
                    onKeyDown={e => e.key === 'Enter' && handleDraw()}
                />
            </SpreadHeader>
            {isSpread && (
                <p className="spread-redraw-warning" dir={lang === 'he' ? 'rtl' : 'ltr'}>
                    {translate('redrawWarning', lang)}
                </p>
            )}
            <div className="spread-subheader-row">
                <div className="spread-toggle-group">
                    <button
                        className={`third-person-toggle${isThirdPerson ? ' active' : ''}`}
                        onClick={() => setIsThirdPerson(p => !p)}
                        type="button"
                        dir={lang === 'he' ? 'rtl' : 'ltr'}
                    >
                        <User size={14} />
                        {translate('thirdPersonToggle', lang)}
                    </button>
                </div>
                {submittedQuestion && (
                    <div className="spread-question-display" dir={lang === 'he' ? 'rtl' : 'ltr'}>
                        <span className="spread-question-label">{translate('yourQuestion', lang)}</span>
                        <span className="spread-question-text" dir={/[֐-׿]/.test(displayQuestion) ? 'rtl' : 'ltr'}>{displayQuestion}</span>
                    </div>
                )}
            </div>
            {isSpread && !allChosen && (
                <p className="master-spread-instructions" dir={lang === 'he' ? 'rtl' : 'ltr'}>
                    {translate('chooseCardsInstruction', lang)}
                </p>
            )}
            <MasterSpread
                isSpread={isSpread}
                allChosen={allChosen}
                positions={POSITIONS}
                chosenCards={chosenCards}
                fanCards={fanCards}
                apiCards={apiCards}
                onChoose={handleChooseCard}
                onQuestionSelect={handleReadyQuestion}
            />
            {comboMatches.length > 0 && (
                <CombinationsModal matches={comboMatches} onClose={() => setComboMatches([])} onConfirm={handleConfirmCombination} />
            )}
            {isSpread && allChosen && (
                <ConclusionModal spreadType="master-spread" theme="gold" />
            )}
            {isSpread && allChosen && (
                <InterpretWidget
                    spreadType="master-spread"
                    cards={chosenCards as ITarotCard[]}
                    positions={POSITIONS}
                    theme="gold"
                    question={submittedQuestion}
                    questionHe={submittedQuestionHe || undefined}
                    isThirdPerson={isThirdPerson}
                    confirmedCombination={confirmedCombination ?? undefined}
                    isOpen={widgetOpen}
                    onToggle={() => setWidgetOpen(o => !o)}
                />
            )}
        </div>
    );
}
