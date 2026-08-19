import { JSX, useEffect, useState } from 'react';
import { interpretService } from '../../services/InterpretService';
import { interpretStore, InterpretActionType, InterpretState } from '../../state/interpret-state';
import './InterpretWidget.css';

interface InterpretWidgetProps {
    cards: any[];
    apiCards: any[];
    positions: string[];
    spreadType: 'celtic' | 'three-cards';
    theme: 'green' | 'blue';
}

function renderInterpretation(text: string): JSX.Element[] {
    return text.split('\n').filter(line => line.trim() !== '').map((line, i) => {
        if (line.trim().startsWith('**')) {
            return <h5 key={i} className="iw-card-title">{line.replace(/\*\*/g, '').trim()}</h5>;
        }
        return <p key={i} className="iw-card-text">{line}</p>;
    });
}

export function InterpretWidget({ cards, apiCards, positions, spreadType, theme }: InterpretWidgetProps): JSX.Element {
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
            const result = await interpretService.interpretBoth(spreadType, cards, apiCards, positions);
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
                        <button className="iw-btn" onClick={interpret} disabled={isInterpreting}>
                            {isInterpreting ? 'Reading the cards...' : hasBoth ? 'Re-interpret' : 'Interpret Reading'}
                        </button>
                        {current && (
                            <div className="iw-result" dir={lang === 'he' ? 'rtl' : 'ltr'}>
                                {renderInterpretation(current)}
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
