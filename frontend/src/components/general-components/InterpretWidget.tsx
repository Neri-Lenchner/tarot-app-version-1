import { JSX, useEffect, useState } from 'react';
import { interpretService } from '../../services/InterpretService';
import { interpretStore, InterpretActionType, InterpretState } from '../../state/interpret-state';
import { authStore } from '../../state/auth-state';
import { readingService } from '../../services/ReadingService';
import './InterpretWidget.css';

interface InterpretWidgetProps {
    cards: any[];
    positions: string[];
    spreadType: 'celtic' | 'three-cards';
    theme: 'green' | 'blue';
    question?: string;
    isOpen: boolean;
    onToggle: () => void;
}

function renderInterpretation(text: string, cards: any[]): JSX.Element[] {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const conclusionIdx = lines.findIndex(l => /\*\*conclusion\*\*/i.test(l.trim()) || l.trim().includes('**מסקנה**'));
    const displayLines = conclusionIdx !== -1 ? lines.slice(0, conclusionIdx) : lines;
    return displayLines.map((line, i) => {
        if (line.trim().startsWith('**')) {
            return <h5 key={i} className="iw-card-title">{line.replace(/\*\*/g, '').trim()}</h5>;
        }
        const matchedCard = cards.find(c => line.toLowerCase().includes(c.name.toLowerCase()));
        if (matchedCard) {
            return (
                <div key={i} className="iw-card-row">
                    <img src={matchedCard.src} alt={matchedCard.name} className="iw-card-img" />
                    <p className="iw-card-text">{line}</p>
                </div>
            );
        }
        return <p key={i} className="iw-card-text">{line}</p>;
    });
}

export function InterpretWidget({ cards, positions, spreadType, theme, question, isOpen, onToggle }: InterpretWidgetProps): JSX.Element {
    const [isInterpreting, setIsInterpreting] = useState(false);
    const [lang, setLang] = useState<'en' | 'he'>('en');
    const [stored, setStored] = useState<InterpretState>(interpretStore.getState());
    const [saved, setSaved] = useState(false);
    const [loggedIn, setLoggedIn] = useState(!!authStore.getState().user);

    useEffect(() => {
        const unsubscribe = interpretStore.subscribe(() => {
            setStored(interpretStore.getState());
            setSaved(false);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const unsubscribe = authStore.subscribe(() => {
            setLoggedIn(!!authStore.getState().user);
        });
        return unsubscribe;
    }, []);

    const spreadData = stored[spreadType];
    const current = spreadData[lang];
    const hasBoth = spreadData.en !== null && spreadData.he !== null;

    const saveReading = async (): Promise<void> => {
        try {
            const saveCards = cards.slice(0, positions.length).map((c, i) => ({ name: c.name, position: positions[i] }));
            await readingService.save(spreadType, question ?? '', saveCards, spreadData.en!, spreadData.he!);
            setSaved(true);
        } catch {
            alert('Failed to save reading. Please try again.');
        }
    };

    const interpret = async (): Promise<void> => {
        setIsInterpreting(true);
        try {
            const result = await interpretService.interpretBoth(spreadType, cards, positions, question?.trim() || undefined);
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

    useEffect(() => {
        if (isOpen && cards.length > 0 && !spreadData.en && !isInterpreting) {
            interpret();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    return (
        <div className={`interpret-widget theme-${theme}`}>
            {isOpen && <div className="iw-backdrop" onClick={onToggle} />}
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
                                <p className="iw-question-text" dir={/[\u0590-\u05FF]/.test(question) ? 'rtl' : 'ltr'}>{question}</p>
                            </div>
                        )}
                        <button className="iw-btn" onClick={interpret} disabled={isInterpreting}>
                            {isInterpreting ? 'Reading the cards...' : hasBoth ? 'Re-interpret' : 'Interpret Reading'}
                        </button>
                        {isInterpreting && (
                            <div className="iw-spinner-wrap">
                                <div className="iw-spinner" />
                                <span className="iw-spinner-text">The cards are speaking...</span>
                            </div>
                        )}
                        {hasBoth && loggedIn && (
                            <button className="iw-save-btn" onClick={saveReading} disabled={saved}>
                                {saved ? 'Saved ✓' : 'Save Reading'}
                            </button>
                        )}
                        {current && (
                            <div className="iw-result" dir={lang === 'he' ? 'rtl' : 'ltr'}>
                                {renderInterpretation(current, cards)}
                            </div>
                        )}
                    </div>
                </div>
            )}
            <button className="iw-toggle-btn" onClick={onToggle}>
                {isOpen ? '✕' : '✦'}
            </button>
        </div>
    );
}
