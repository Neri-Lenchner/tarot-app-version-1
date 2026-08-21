import {useState, useEffect, JSX} from "react";
import {SpreadHeader} from "../../general-components/SpreadHeader";
import {CelticSpread} from "./celtic-spread-components/CelticSpread";
import {InterpretWidget} from "../../general-components/InterpretWidget";
import {CombinationsModal} from "../../general-components/CombinationsModal";
import './CelticSpreadGlobal.css';
import {TarotCard} from "../../../arrays-&-models/tarot-deck-array/tarotCard.interface";
import {deckService} from "../../../services/DeckService";
import {deckStore} from "../../../state/deck-state";
import {interpretStore, InterpretActionType} from "../../../state/interpret-state";
import {combinationsService, ICombinationMatch} from "../../../services/CombinationsService";

const POSITIONS = [
    "Positive Energy", "Negative Energy", "Past", "Present",
    "Near Future", "Far Future", "Inside", "Outside", "Fears", "Potential"
];

export function CelticSpreadGlobal(): JSX.Element {
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

    const [isSpread, setIsSpread] = useState<boolean>((): boolean => {
        const saved: string | null = localStorage.getItem("isSpread");
        if (saved === null) return false;
        try { return saved === "true"; } catch { return false; }
    });

    const [selectedCards, setSelectedCards] = useState<TarotCard[]>((): TarotCard[] => {
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
            setQuestion('');
        }
        const [chosen, bool] = deckService.spreadThem();
        setSelectedCards(chosen);
        setIsSpread(bool);
        setWidgetOpen(true);
        interpretStore.dispatch({ type: InterpretActionType.Clear, spreadType: 'celtic' });
        combinationsService.checkCombinations(chosen.map(c => c.name)).then(matches => {
            setComboMatches(matches);
        }).catch(() => {});
    };

    const clearSpread: () => void = (): void => {
        const bool: boolean = deckService.clearSpread("isSpread", "selectedCards");
        setIsSpread(bool);
        setSelectedCards([]);
        setSubmittedQuestion('');
        setWidgetOpen(false);
        setComboMatches([]);
        interpretStore.dispatch({ type: InterpretActionType.Clear, spreadType: 'celtic' });
    };

    return (
        <div className="celtic-spread-container">
            <SpreadHeader spreadThem={spreadThem} clearSpread={clearSpread}>
                <input
                    className="spread-question-input"
                    type="text"
                    placeholder="What is your question for the cards?"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && spreadThem()}
                    onFocus={() => { if (isSpread) clearSpread(); }}
                />
            </SpreadHeader>
            {submittedQuestion && (
                <div className="spread-question-display">
                    <span className="spread-question-label">Your question:</span>
                    <span className="spread-question-text">{submittedQuestion}</span>
                </div>
            )}
            <CelticSpread isSpread={isSpread} cards={selectedCards} apiCards={apiCards} />
            {comboMatches.length > 0 && (
                <CombinationsModal matches={comboMatches} onClose={() => setComboMatches([])} />
            )}
            {isSpread && selectedCards.length > 0 && (
                <InterpretWidget
                    spreadType="celtic"
                    cards={selectedCards}
                    positions={POSITIONS}
                    theme="green"
                    question={submittedQuestion}
                    isOpen={widgetOpen}
                    onToggle={() => setWidgetOpen(o => !o)}
                />
            )}
        </div>
    );
}
