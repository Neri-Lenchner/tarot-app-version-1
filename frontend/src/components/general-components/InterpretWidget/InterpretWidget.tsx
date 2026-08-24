import { JSX, useEffect, useState } from 'react';
import { interpretService } from '../../../services/InterpretService';
import { interpretStore, InterpretActionType, InterpretState, ensureHebrewTranslation, waitForHebrewTranslation } from '../../../state/interpret-state';
import { authStore } from '../../../state/auth-state';
import { langStore, LangActionType, Lang } from '../../../state/lang-state';
import { readingService } from '../../../services/ReadingService';
import { ICombinationMatch } from '../../../arrays-&-models/combinationMatch.interface';
import { ITarotCard } from '../../../arrays-&-models/tarot-deck-array/tarotCard.interface';
import './InterpretWidget.css';

interface IInterpretWidgetProps {
    cards: ITarotCard[];
    positions: string[];
    spreadType: 'celtic' | 'three-cards';
    theme: 'green' | 'blue';
    question?: string;
    isThirdPerson?: boolean;
    confirmedCombination?: ICombinationMatch;
    isOpen: boolean;
    onToggle: () => void;
}

function renderInterpretation(text: string, cards: ITarotCard[]): JSX.Element[] {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const CONCLUSION_RE = /^\*\*\s*(conclusion|מסקנה|סיכום|לסיכום)\s*:?\*\*$/i;
    const conclusionIdx = lines.findIndex(l => CONCLUSION_RE.test(l.trim()));
    const displayLines = conclusionIdx !== -1 ? lines.slice(0, conclusionIdx) : lines;
    const shownCards = new Set<string>();
    return displayLines.map((line, i) => {
        if (line.trim().startsWith('**')) {
            return <h5 key={i} className="iw-card-title">{line.replace(/\*\*/g, '').trim()}</h5>;
        }
        const matchedCards = cards.filter(c => {
            if (shownCards.has(c.name)) return false;
            const isMentioned = new RegExp(`\\b${c.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(line);
            if (isMentioned) shownCards.add(c.name);
            return isMentioned;
        });
        if (matchedCards.length > 0) {
            return (
                <div key={i} className="iw-card-row">
                    <div className="iw-card-images">
                        {matchedCards.map(c => (
                            <img key={c.name} src={c.src} alt={c.name} className="iw-card-img" />
                        ))}
                    </div>
                    <p className="iw-card-text">{line}</p>
                </div>
            );
        }
        return <p key={i} className="iw-card-text">{line}</p>;
    });
}

export function InterpretWidget({ cards, positions, spreadType, theme, question, isThirdPerson, confirmedCombination, isOpen, onToggle }: IInterpretWidgetProps): JSX.Element {
    const [isInterpreting, setIsInterpreting] = useState(false);
    const [lang, setLang] = useState<Lang>(langStore.getState().lang);
    const [stored, setStored] = useState<InterpretState>(interpretStore.getState());
    const [saved, setSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [loggedIn, setLoggedIn] = useState(!!authStore.getState().user);

    useEffect(() => {
        const unsubscribe = interpretStore.subscribe(() => {
            setStored(interpretStore.getState());
            setSaved(false);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const unsubscribe = langStore.subscribe(() => {
            setLang(langStore.getState().lang);
        });
        return unsubscribe;
    }, []);

    const toggleLang = (): void => {
        langStore.dispatch({ type: LangActionType.Toggle });
        if (langStore.getState().lang === 'he') {
            ensureHebrewTranslation(spreadType);
        }
    };

    useEffect(() => {
        const unsubscribe = authStore.subscribe(() => {
            setLoggedIn(!!authStore.getState().user);
        });
        return unsubscribe;
    }, []);

    const spreadData = stored[spreadType];
    const current = spreadData[lang];
    const canToggle = spreadData.en !== null;
    const isTranslating = lang === 'he' && spreadData.en !== null && spreadData.he === null;

    const saveReading = async (): Promise<void> => {
        setIsSaving(true);
        try {
            const he = spreadData.he ?? await waitForHebrewTranslation(spreadType);
            const saveCards = cards.slice(0, positions.length).map((c, i) => ({ name: c.name, position: positions[i] }));
            await readingService.save(
                spreadType, question ?? '', saveCards,
                spreadData.en!, he,
                spreadData.followupQ ?? null, spreadData.followupAnswer ?? null
            );
            setSaved(true);
        } catch {
            alert('Failed to save reading. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const interpret = async (): Promise<void> => {
        setIsInterpreting(true);
        try {
            const en = await interpretService.interpretSpread(spreadType, cards, positions, "en", question?.trim() || undefined, isThirdPerson, confirmedCombination);
            interpretStore.dispatch({ type: InterpretActionType.SetEnglish, spreadType, payload: { en } });
            if (langStore.getState().lang === 'he') {
                ensureHebrewTranslation(spreadType);
            }
        } catch {
            interpretStore.dispatch({
                type: InterpretActionType.SetEnglish,
                spreadType,
                payload: { en: 'Failed to get interpretation. Please try again.' },
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

    useEffect(() => {
        if (!confirmedCombination) return;
        interpret();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [confirmedCombination]);

    return (
        <div className={`interpret-widget theme-${theme}`}>
            {isOpen && (
                <div className="iw-panel">
                    <div className="iw-header">
                        <span>Reading Interpretation</span>
                        {canToggle && (
                            <button className="iw-lang-btn" onClick={toggleLang}>
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
                            {isInterpreting ? 'Reading the cards...' : canToggle ? 'Re-interpret' : 'Interpret Reading'}
                        </button>
                        {isInterpreting && (
                            <div className="iw-spinner-wrap">
                                <div className="iw-spinner" />
                                <span className="iw-spinner-text">The cards are speaking...</span>
                            </div>
                        )}
                        {canToggle && loggedIn && (
                            <button className="iw-save-btn" onClick={saveReading} disabled={saved || isSaving}>
                                {saved ? 'Saved ✓' : isSaving ? 'Saving...' : 'Save Reading'}
                            </button>
                        )}
                        {isTranslating && (
                            <div className="iw-spinner-wrap">
                                <div className="iw-spinner" />
                                <span className="iw-spinner-text">Translating to Hebrew...</span>
                            </div>
                        )}
                        {current && !isTranslating && (
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
