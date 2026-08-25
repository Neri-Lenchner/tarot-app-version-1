import {useState, useEffect, JSX} from "react";
import {SpreadHeader} from "../../general-components/SpreadHeader/SpreadHeader";
import {CelticSpread} from "./celtic-spread-components/CelticSpread";
import {IReadyQuestion} from "../../../arrays-&-models/readyQuestion.interface";
import {InterpretWidget} from "../../general-components/InterpretWidget/InterpretWidget";
import {CombinationsModal} from "../../general-components/CombinationsModal/CombinationsModal";
import {ConclusionModal} from "../../general-components/ConclusionModal/ConclusionModal";
import './CelticSpreadGlobal.css';
import {ITarotCard} from "../../../arrays-&-models/tarot-deck-array/tarotCard.interface";
import {TarotCardData} from "../../../arrays-&-models/TarotCardData.model";
import {ICombinationMatch} from "../../../arrays-&-models/combinationMatch.interface";
import {deckService} from "../../../services/DeckService";
import {deckStore} from "../../../state/deck-state";
import {interpretStore, InterpretActionType} from "../../../state/interpret-state";
import {useLang} from "../../../state/lang-state";
import {translate} from "../../../state/translations";
import {combinationsService, filterByProximity, CELTIC_ADJACENCY} from "../../../services/CombinationsService";

const POSITIONS = [
    "Positive Energy", "Negative Energy", "Past", "Present",
    "Near Future", "Far Future", "Inside", "Outside", "Fears", "Potential"
];

export function CelticSpreadGlobal(): JSX.Element {
    const [apiCards, setApiCards] = useState<TarotCardData[]>(deckService.tarotCardsDetails);

    useEffect(() => {
        const unsubscribe = deckStore.subscribe(() => {
            setApiCards(deckService.tarotCardsDetails);
        });
        return unsubscribe;
    }, []);

    const [question, setQuestion] = useState('');
    const [submittedQuestion, setSubmittedQuestion] = useState('');
    const [submittedQuestionHe, setSubmittedQuestionHe] = useState('');
    const lang = useLang();
    const [widgetOpen, setWidgetOpen] = useState(false);
    const [comboMatches, setComboMatches] = useState<ICombinationMatch[]>([]);
    const [isThirdPerson, setIsThirdPerson] = useState(false);
    const [confirmedCombination, setConfirmedCombination] = useState<ICombinationMatch | null>(null);

    const [isSpread, setIsSpread] = useState<boolean>((): boolean => {
        const saved: string | null = localStorage.getItem("isSpread");
        if (saved === null) return false;
        try { return saved === "true"; } catch { return false; }
    });

    const [selectedCards, setSelectedCards] = useState<ITarotCard[]>((): ITarotCard[] => {
        const saved: string | null = localStorage.getItem("selectedCards");
        if (saved === null) return [];
        try { return JSON.parse(saved); } catch { return []; }
    });

    useEffect((): void => {
        localStorage.setItem("isSpread", JSON.stringify(isSpread));
        localStorage.setItem("selectedCards", JSON.stringify(selectedCards));
    }, [isSpread, selectedCards]);

    const spreadThem: () => void = (): void => {
        if (question.trim()) {
            setSubmittedQuestion(question.trim());
            setSubmittedQuestionHe('');
            setQuestion('');
        }
        const [chosen, bool] = deckService.spreadThem();
        setSelectedCards(chosen);
        setIsSpread(bool);
        setWidgetOpen(true);
        setComboMatches([]);
        setConfirmedCombination(null);
        interpretStore.dispatch({ type: InterpretActionType.Clear, spreadType: 'celtic' });
        combinationsService.checkCombinations(chosen.map(c => c.name), question.trim() || submittedQuestion).then(matches => {
            setComboMatches(filterByProximity(matches, chosen, CELTIC_ADJACENCY));
        }).catch(() => {});
    };

    const clearSpread: () => void = (): void => {
        const bool: boolean = deckService.clearSpread("isSpread", "selectedCards");
        setIsSpread(bool);
        setSelectedCards([]);
        setSubmittedQuestion('');
        setSubmittedQuestionHe('');
        setWidgetOpen(false);
        setComboMatches([]);
        setConfirmedCombination(null);
        interpretStore.dispatch({ type: InterpretActionType.Clear, spreadType: 'celtic' });
    };

    const handleConfirmCombination = (combo: ICombinationMatch): void => {
        setConfirmedCombination(combo);
        setWidgetOpen(true);
    };

    const handleReadyQuestion = (q: IReadyQuestion): void => {
        setSubmittedQuestion(q.en);
        setSubmittedQuestionHe(q.he);
        setQuestion('');
        const [chosen, bool] = deckService.spreadThem();
        setSelectedCards(chosen);
        setIsSpread(bool);
        setWidgetOpen(true);
        setComboMatches([]);
        setConfirmedCombination(null);
        interpretStore.dispatch({ type: InterpretActionType.Clear, spreadType: 'celtic' });
        combinationsService.checkCombinations(chosen.map(c => c.name), q.en).then(matches => {
            setComboMatches(filterByProximity(matches, chosen, CELTIC_ADJACENCY));
        }).catch(() => {});
    };

    const displayQuestion: string = lang === 'he' ? (submittedQuestionHe || submittedQuestion) : submittedQuestion;

    return (
        <div className="celtic-spread-container">
            <SpreadHeader spreadThem={spreadThem} clearSpread={clearSpread}>
                <input
                    className="spread-question-input"
                    type="text"
                    placeholder={translate('questionPlaceholder', lang)}
                    value={question}
                    dir={lang === 'he' || /[\u0590-\u05FF]/.test(question) ? 'rtl' : 'ltr'}
                    onChange={e => setQuestion(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && spreadThem()}
                    onFocus={() => { if (isSpread) clearSpread(); }}
                />
            </SpreadHeader>
            <div className="spread-subheader-row">
                <button
                    className={`third-person-toggle${isThirdPerson ? ' active' : ''}`}
                    onClick={() => setIsThirdPerson(p => !p)}
                    type="button"
                    dir={lang === 'he' ? 'rtl' : 'ltr'}
                >
                    {translate('thirdPersonToggle', lang)}
                </button>
                {submittedQuestion && (
                    <div className="spread-question-display">
                        <span className="spread-question-label" dir={lang === 'he' ? 'rtl' : 'ltr'}>{translate('yourQuestion', lang)}</span>
                        <span className="spread-question-text" dir={/[\u0590-\u05FF]/.test(displayQuestion) ? 'rtl' : 'ltr'}>{displayQuestion}</span>
                    </div>
                )}
            </div>
            <CelticSpread isSpread={isSpread} cards={selectedCards} apiCards={apiCards} positions={POSITIONS} onQuestionSelect={handleReadyQuestion} />
            {comboMatches.length > 0 && (
                <CombinationsModal matches={comboMatches} onClose={() => setComboMatches([])} onConfirm={handleConfirmCombination} />
            )}
            {isSpread && selectedCards.length > 0 && (
                <ConclusionModal spreadType="celtic" theme="green" />
            )}
            {isSpread && selectedCards.length > 0 && (
                <InterpretWidget
                    spreadType="celtic"
                    cards={selectedCards}
                    positions={POSITIONS}
                    theme="green"
                    question={submittedQuestion}
                    isThirdPerson={isThirdPerson}
                    confirmedCombination={confirmedCombination ?? undefined}
                    isOpen={widgetOpen}
                    onToggle={() => setWidgetOpen(o => !o)}
                />
            )}
        </div>
    );
}
