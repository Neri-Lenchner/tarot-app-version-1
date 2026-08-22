import {JSX, useEffect, useState} from 'react';
import './ThreeCardsSpreadGlobal.css';
import {ThreeCardsSpread} from "./three-cards-spread-components/ThreeCardsSpread";
import {ITarotCard} from "../../../arrays-&-models/tarot-deck-array/tarotCard.interface";
import {SpreadHeader} from "../../general-components/SpreadHeader";
import {InterpretWidget} from "../../general-components/InterpretWidget";
import {CombinationsModal} from "../../general-components/CombinationsModal";
import {ConclusionModal} from "../../general-components/ConclusionModal";
import {deckService} from "../../../services/DeckService";
import {deckStore} from "../../../state/deck-state";
import {interpretStore, InterpretActionType} from "../../../state/interpret-state";
import {combinationsService, ICombinationMatch, filterByProximity, THREE_CARDS_ADJACENCY} from "../../../services/CombinationsService";

const POSITIONS = ["Past", "Present", "Future"];

export function ThreeCardsSpreadGlobal(): JSX.Element {
    const [apiCards, setApiCards] = useState<any[]>(deckService.tarotCardsDetails as any[]);

    useEffect(() => {
        const unsubscribe = deckStore.subscribe(() => {
            setApiCards(deckService.tarotCardsDetails as any[]);
        });
        return unsubscribe;
    }, []);

    const [question, setQuestion] = useState('');
    const [submittedQuestion, setSubmittedQuestion] = useState('');
    const [widgetOpen, setWidgetOpen] = useState(false);
    const [comboMatches, setComboMatches] = useState<ICombinationMatch[]>([]);
    const [isThirdPerson, setIsThirdPerson] = useState(false);

    const [isSpread3, setIsSpread3] = useState<boolean>((): boolean => {
        const saved: string | null = localStorage.getItem("isSpread3");
        if (saved === null) return false;
        try { return saved === "true"; } catch { return false; }
    });

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
    }, [isSpread3, selected3Cards]);

    const spreadThem3: () => void = (): void => {
        if (question.trim()) {
            setSubmittedQuestion(question.trim());
            setQuestion('');
        }
        const [chosen, bool] = deckService.spreadMajorArcana(3);
        setSelected3Cards(chosen);
        setIsSpread3(bool);
        setWidgetOpen(true);
        interpretStore.dispatch({ type: InterpretActionType.Clear, spreadType: 'three-cards' });
        combinationsService.checkCombinations(chosen.map(c => c.name), question.trim() || submittedQuestion).then(matches => {
            setComboMatches(filterByProximity(matches, chosen, THREE_CARDS_ADJACENCY));
        }).catch(() => {});
    };

    const clearSpread3: () => void = (): void => {
        const bool: boolean = deckService.clearSpread("isSpread3", "selected3Cards");
        setIsSpread3(bool);
        setSelected3Cards([]);
        setSubmittedQuestion('');
        setWidgetOpen(false);
        setComboMatches([]);
        interpretStore.dispatch({ type: InterpretActionType.Clear, spreadType: 'three-cards' });
    };

    return (
        <div className="three-cards-global-container">
            <SpreadHeader spreadThem={spreadThem3} clearSpread={clearSpread3}>
                <input
                    className="spread-question-input"
                    type="text"
                    placeholder="What is your question? / מה שאלתך לקלפים?"
                    value={question}
                    dir={/[\u0590-\u05FF]/.test(question) ? 'rtl' : 'ltr'}
                    onChange={e => setQuestion(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && spreadThem3()}
                    onFocus={() => { if (isSpread3) clearSpread3(); }}
                />
            </SpreadHeader>
            <button
                className={`third-person-toggle${isThirdPerson ? ' active' : ''}`}
                onClick={() => setIsThirdPerson(p => !p)}
                type="button"
            >
                👤 Reading about someone else
            </button>
            {submittedQuestion && (
                <div className="spread-question-display">
                    <span className="spread-question-label">Your question:</span>
                    <span className="spread-question-text" dir={/[\u0590-\u05FF]/.test(submittedQuestion) ? 'rtl' : 'ltr'}>{submittedQuestion}</span>
                </div>
            )}
            <ThreeCardsSpread isSpread3={isSpread3} cards={selected3Cards} apiCards={apiCards} />
            {comboMatches.length > 0 && (
                <CombinationsModal matches={comboMatches} onClose={() => setComboMatches([])} />
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
                    isThirdPerson={isThirdPerson}
                    isOpen={widgetOpen}
                    onToggle={() => setWidgetOpen(o => !o)}
                />
            )}
        </div>
    );
}
