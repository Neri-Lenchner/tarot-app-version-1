import {JSX, useEffect, useRef, useState} from 'react';
import {User} from "lucide-react";
import './ThreeCardsSpreadGlobal.css';
import {ThreeCardsSpread} from "./three-cards-spread-components/ThreeCardsSpread";
import {ITarotCard} from "../../../arrays-&-models/tarot-deck-array/tarotCard.interface";
import {TarotCardData} from "../../../arrays-&-models/TarotCardData.model";
import {ICombinationMatch} from "../../../arrays-&-models/combinationMatch.interface";
import {SpreadHeader} from "../../general-components/SpreadHeader/SpreadHeader";
import {InterpretWidget} from "../../general-components/InterpretWidget/InterpretWidget";
import {CombinationsModal} from "../../general-components/CombinationsModal/CombinationsModal";
import {ConclusionModal} from "../../general-components/ConclusionModal/ConclusionModal";
import {CutDeckModal} from "../../general-components/CutDeckModal/CutDeckModal";
import {deckService} from "../../../services/DeckService";
import {deckStore} from "../../../state/deck-state";
import {interpretStore, InterpretActionType} from "../../../state/interpret-state";
import {combinationsService, filterByProximity, THREE_CARDS_ADJACENCY} from "../../../services/CombinationsService";
import {useLang} from "../../../state/lang-state";
import {translate} from "../../../state/translations";
import {IReadyQuestion} from "../../../arrays-&-models/readyQuestion.interface";

const POSITIONS = ["Past", "Present", "Future"];

export function ThreeCardsSpreadGlobal(): JSX.Element {
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
        (): string => localStorage.getItem("submittedQuestion3") ?? ''
    );
    const [submittedQuestionHe, setSubmittedQuestionHe] = useState<string>(
        (): string => localStorage.getItem("submittedQuestionHe3") ?? ''
    );
    const [widgetOpen, setWidgetOpen] = useState(false);
    const [comboMatches, setComboMatches] = useState<ICombinationMatch[]>([]);
    const [isThirdPerson, setIsThirdPerson] = useState(false);
    const [confirmedCombination, setConfirmedCombination] = useState<ICombinationMatch | null>(null);
    // Bumped on every spread/clear so an out-of-order (or stale, post-clear)
    // checkCombinations response can't overwrite a newer one — same class of
    // race the interpretStore's requestId guards against.
    const comboRequestRef = useRef(0);

    const [isSpread3, setIsSpread3] = useState<boolean>((): boolean => {
        const saved: string | null = localStorage.getItem("isSpread3");
        if (saved === null) return false;
        try { return saved === "true"; } catch { return false; }
    });

    // Non-null while the "cut the deck" modal is open — holds the already-
    // shuffled major-arcana pool the user is cutting from. Not persisted: a
    // refresh mid-cut just drops back to the pre-spread state.
    const [cutPool, setCutPool] = useState<ITarotCard[] | null>(null);

    const [selected3Cards, setSelected3Cards] = useState<ITarotCard[]>((): ITarotCard[] => {
        const saved: string | null = localStorage.getItem("selected3Cards");
        if (saved === null) return [];
        try {
            const parsed = JSON.parse(saved);
            return Array.isArray(parsed) && parsed.length === 3 ? parsed : [];
        } catch { return []; }
    });

    useEffect((): void => {
        localStorage.setItem("isSpread3", JSON.stringify(isSpread3));
        localStorage.setItem("selected3Cards", JSON.stringify(selected3Cards));
        localStorage.setItem("submittedQuestion3", submittedQuestion);
        localStorage.setItem("submittedQuestionHe3", submittedQuestionHe);
    }, [isSpread3, selected3Cards, submittedQuestion, submittedQuestionHe]);

    // Card combinations (the "left modal") are plain component state with no
    // persistence, unlike isSpread3/selected3Cards above — so navigating away
    // and back restores the spread itself but not its combo matches, and
    // with comboMatches empty the modal has no way to reopen. Re-run the
    // same lookup once on mount for whatever spread was restored.
    useEffect(() => {
        if (!isSpread3 || selected3Cards.length === 0) return;
        const myComboRequest = ++comboRequestRef.current;
        combinationsService.checkCombinations(selected3Cards.map(c => c.name), submittedQuestion).then(matches => {
            if (comboRequestRef.current === myComboRequest) {
                setComboMatches(filterByProximity(matches, selected3Cards, THREE_CARDS_ADJACENCY));
            }
        }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCutConfirmed = (chosen: ITarotCard[]): void => {
        setSelected3Cards(chosen);
        setIsSpread3(true);
        setWidgetOpen(true);
        setComboMatches([]);
        setConfirmedCombination(null);
        setCutPool(null);
        interpretStore.dispatch({ type: InterpretActionType.Clear, spreadType: 'three-cards' });
        const myComboRequest = ++comboRequestRef.current;
        combinationsService.checkCombinations(chosen.map(c => c.name), submittedQuestion).then(matches => {
            if (comboRequestRef.current === myComboRequest) {
                setComboMatches(filterByProximity(matches, chosen, THREE_CARDS_ADJACENCY));
            }
        }).catch(() => {});
    };

    const handleCancelCut = (): void => {
        setCutPool(null);
    };

    const spreadThem3: () => void = (): void => {
        if (question.trim()) {
            setSubmittedQuestion(question.trim());
            setSubmittedQuestionHe('');
            setQuestion('');
        }
        setCutPool(deckService.spreadMajorArcanaShuffle());
    };

    const clearSpread3: () => void = (): void => {
        const bool: boolean = deckService.clearSpread("isSpread3", "selected3Cards");
        setIsSpread3(bool);
        setSelected3Cards([]);
        setSubmittedQuestion('');
        setSubmittedQuestionHe('');
        setWidgetOpen(false);
        setComboMatches([]);
        setConfirmedCombination(null);
        comboRequestRef.current++;
        interpretStore.dispatch({ type: InterpretActionType.Clear, spreadType: 'three-cards' });
    };

    const handleDraw: () => void = (): void => {
        if (isSpread3) clearSpread3();
        spreadThem3();
    };

    const handleConfirmCombination = (combo: ICombinationMatch): void => {
        setConfirmedCombination(combo);
        setWidgetOpen(true);
    };

    const handleReadyQuestion = (q: IReadyQuestion): void => {
        setSubmittedQuestion(q.en);
        setSubmittedQuestionHe(q.he);
        setQuestion('');
        setCutPool(deckService.spreadMajorArcanaShuffle());
    };

    const displayQuestion: string = lang === 'he' ? (submittedQuestionHe || submittedQuestion) : submittedQuestion;

    return (
        <div className="three-cards-global-container">
            {cutPool && (
                <CutDeckModal cards={cutPool} needed={3} onCut={(rest) => handleCutConfirmed(rest.slice(0, 3))} onCancel={handleCancelCut} />
            )}
            <SpreadHeader spreadThem={handleDraw} clearSpread={clearSpread3}>
                <input
                    className="spread-question-input"
                    type="text"
                    placeholder={translate('questionPlaceholder', lang)}
                    value={question}
                    dir={lang === 'he' || /[\u0590-\u05FF]/.test(question) ? 'rtl' : 'ltr'}
                    onChange={e => {
                        setQuestion(e.target.value);
                        if (isSpread3) clearSpread3();
                    }}
                    onKeyDown={e => e.key === 'Enter' && handleDraw()}
                />
            </SpreadHeader>
            {isSpread3 && (
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
                        <span className="spread-question-text" dir={/[\u0590-\u05FF]/.test(displayQuestion) ? 'rtl' : 'ltr'}>{displayQuestion}</span>
                    </div>
                )}
            </div>
            <ThreeCardsSpread isSpread3={isSpread3} cards={selected3Cards} apiCards={apiCards} positions={POSITIONS} onQuestionSelect={handleReadyQuestion} />
            {comboMatches.length > 0 && (
                <CombinationsModal matches={comboMatches} onClose={() => setComboMatches([])} onConfirm={handleConfirmCombination} />
            )}
            {isSpread3 && selected3Cards.length > 0 && (
                <ConclusionModal spreadType="three-cards" theme="blue" />
            )}
            {isSpread3 && selected3Cards.length > 0 && (
                <InterpretWidget
                    spreadType="three-cards"
                    cards={selected3Cards}
                    positions={POSITIONS}
                    theme="blue"
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
