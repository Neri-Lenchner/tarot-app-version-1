import { JSX, useEffect, useState } from 'react';
import { interpretService } from '../../services/InterpretService';
import { interpretStore, InterpretActionType, InterpretState } from '../../state/interpret-state';
import './InterpretWidget.css';

interface InterpretWidgetProps {
    cards: any[];
    positions: string[];
    spreadType: 'celtic' | 'three-cards';
    theme: 'green' | 'blue';
    question?: string;
}

function extractConclusion(text: string): string {
    // Split by any **Heading** and take the last piece (the conclusion body)
    const sections = text.split(/\*\*[^*\n]+\*\*/);
    return sections[sections.length - 1].trim();
}

function renderConclusion(text: string): JSX.Element[] {
    const conclusion = extractConclusion(text);
    return conclusion
        .split('\n')
        .filter(line => line.trim() !== '')
        .map((line, i) => <p key={i} className="iw-card-text">{line}</p>);
}

export function InterpretWidget({ cards, positions, spreadType, theme, question }: InterpretWidgetProps): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const [isInterpreting, setIsInterpreting] = useState(false);
    const [lang, setLang] = useState<'en' | 'he'>('en');
    const [stored, setStored] = useState<InterpretState>(interpretStore.getState());

    useEffect(() => {
        const unsubscribe = interpretStore.subscribe(() => {
            setStored(interpretStore.getState());
        });
        return unsubscribe;
    }, []);

    const spreadData = stored[spreadType];
    const current = spreadData[lang];
    const hasBoth = spreadData.en !== null && spreadData.he !== null;

    const interpret = async (): Promise<void> => {
        setIsInterpreting(true);
        try {
            const result = await interpretService.interpretBoth(spreadType, cards, positions, question.trim() || undefined);
            interpretStore.dispatch({ type: InterpretActionType.SetBoth, spreadType, payload: result });
        } catch {
            interpretStore.dispatch({
                type: InterpretActionType.SetBoth,
                spreadType,
                payload: { en: 'Failed to get interpretation. Please try again.', he: 'אירעה שגיאה. אנא נסה שוב.' },
            });
        } finally {
            setIsInterpreting(false);
        }
    };

    return (
        <div className={`interpret-widget theme-${theme}`}>
            {isOpen && (
                <div className="iw-panel">
                    <div className="iw-header">
                        <span>Reading Interpretation</span>
                        {hasBoth && (
                            <button className="iw-lang-btn" onClick={() => setLang(l => l === 'en' ? 'he' : 'en')}>
                                {lang === 'en' ? 'HE' : 'EN'}
                            </button>
                        )}
                    </div>
                    <div className="iw-body">
                        {question && (
                            <div className="iw-question-display">
                                <span className="iw-question-label">Question</span>
                                <p className="iw-question-text">{question}</p>
                            </div>
                        )}
                        <button className="iw-btn" onClick={interpret} disabled={isInterpreting}>
                            {isInterpreting ? 'Reading the cards...' : hasBoth ? 'Re-interpret' : 'Interpret Reading'}
                        </button>
                        {current && (
                            <div className="iw-result" dir={lang === 'he' ? 'rtl' : 'ltr'}>
                                <h5 className="iw-card-title">Conclusion</h5>
                                {renderConclusion(current)}
                            </div>
                        )}
                    </div>
                </div>
            )}
            <button className="iw-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '✕' : '✦'}
            </button>
        </div>
    );
}
