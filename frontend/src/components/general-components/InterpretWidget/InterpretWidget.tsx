import { JSX, useEffect, useState } from 'react';
import { Info, X } from 'lucide-react';
import { interpretService } from '../../../services/InterpretService';
import { interpretStore, InterpretActionType, InterpretState, ensureHebrewTranslation, waitForHebrewTranslation } from '../../../state/interpret-state';
import { authStore } from '../../../state/auth-state';
import { useLang } from '../../../state/lang-state';
import { translate, POSITION_HE } from '../../../state/translations';
import { readingService } from '../../../services/ReadingService';
import { ICombinationMatch } from '../../../arrays-&-models/combinationMatch.interface';
import { ITarotCard } from '../../../arrays-&-models/tarot-deck-array/tarotCard.interface';
import './InterpretWidget.css';

interface IInterpretWidgetProps {
    cards: ITarotCard[];
    positions: string[];
    spreadType: 'celtic' | 'three-cards' | 'master-spread';
    theme: 'green' | 'blue' | 'gold';
    question?: string;
    questionHe?: string;
    isThirdPerson?: boolean;
    isEventBased?: boolean;
    confirmedCombination?: ICombinationMatch;
    isOpen: boolean;
    onToggle: () => void;
}

function renderInterpretation(text: string, cards: ITarotCard[], positions: string[]): JSX.Element[] {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const CONCLUSION_RE = /^\*\*\s*(conclusion|מסקנה|סיכום|לסיכום)\s*:?\*\*$/i;
    const conclusionIdx = lines.findIndex(l => CONCLUSION_RE.test(l.trim()));
    const displayLines = conclusionIdx !== -1 ? lines.slice(0, conclusionIdx) : lines;
    // A card's image is shown only the first time its name appears in the
    // whole reading — later mentions (e.g. an event-story paragraph or the
    // "Things You Should Pay Attention To" section referencing an
    // already-shown card) render as plain text instead of repeating the image.
    const shownCards = new Set<string>();
    return displayLines.map((line, i) => {
        if (line.trim().startsWith('**')) {
            return <h5 key={i} className="iw-card-title">{line.replace(/\*\*/g, '').trim()}</h5>;
        }

        // A position paragraph always states its position up front ("in the
        // Potential position..."), so anchor to the opening chunk and look the
        // card up by index directly — this can't be stolen by that paragraph
        // later mentioning other cards' names (e.g. Potential referencing the
        // positive/negative energy cards), unlike scanning the whole line.
        const openingChunk = line.slice(0, 60);
        const positionIdx = positions.findIndex(p => {
            const heName = POSITION_HE[p];
            const enRe = new RegExp(`\\b${p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
            return enRe.test(openingChunk) || (!!heName && openingChunk.includes(heName));
        });

        const rawMatchedCards = positionIdx !== -1
            ? [cards[positionIdx]].filter((c): c is ITarotCard => !!c)
            : cards.filter(c => new RegExp(`\\b${c.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(line));
        const matchedCards = rawMatchedCards.filter(c => !shownCards.has(c.name));
        matchedCards.forEach(c => shownCards.add(c.name));

        if (matchedCards.length > 0) {
            return (
                <div key={i} className="iw-card-row">
                    <div className="iw-card-images">
                        {matchedCards.map(c => (
                            <div key={c.name} className="iw-card-vignette">
                                <img src={c.src} alt={c.name} className="iw-card-img" />
                            </div>
                        ))}
                    </div>
                    <p className="iw-card-text">{line}</p>
                </div>
            );
        }
        return <p key={i} className="iw-card-text">{line}</p>;
    });
}

export function InterpretWidget({ cards, positions, spreadType, theme, question, questionHe, isThirdPerson, isEventBased, confirmedCombination, isOpen, onToggle }: IInterpretWidgetProps): JSX.Element {
    const [isInterpreting, setIsInterpreting] = useState(false);
    const lang = useLang();
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
        const unsubscribe = authStore.subscribe(() => {
            setLoggedIn(!!authStore.getState().user);
        });
        return unsubscribe;
    }, []);

    const spreadData = stored[spreadType];
    // question/questionHe arrive as the raw pair (so saveReading can persist
    // both) — this resolves whichever one matches the app's current
    // language, falling back to the other when only one exists (a
    // free-typed question was only ever captured in one language).
    const displayQuestion = lang === 'he' ? (questionHe || question) : question;
    // While Hebrew is still being translated (or failed), fall back to the
    // already-ready English text rather than blocking the view on a spinner —
    // the reading upgrades to Hebrew in place once the translation lands.
    const current = lang === 'he' ? (spreadData.he ?? spreadData.en) : spreadData.en;
    const contentIsHebrew = lang === 'he' && spreadData.he !== null;
    const canToggle = spreadData.en !== null;
    const awaitingHebrew = lang === 'he' && spreadData.he === null && !!spreadData.heLoading;
    const translationFailed = lang === 'he' && spreadData.en !== null && spreadData.he === null && !spreadData.heLoading && !!spreadData.heFailed;
    // A save persists both languages at once (see saveReading), so it isn't
    // meaningful until Hebrew has actually finished fetching too — not just
    // English. Unlike awaitingHebrew/translationFailed above, this isn't
    // gated on lang === 'he': Hebrew fetches in the background as soon as
    // English lands (see interpret()'s ensureHebrewTranslation call), so a
    // user who never switched away from English could otherwise save before
    // it's ready.
    const heStillPending = canToggle && spreadData.he === null && !spreadData.heFailed;

    const saveReading = async (): Promise<void> => {
        setIsSaving(true);
        try {
            const he = spreadData.he ?? await waitForHebrewTranslation(spreadType);
            const saveCards = cards.slice(0, positions.length).map((c, i) => ({ name: c.name, position: positions[i] }));
            await readingService.save(
                spreadType, question ?? '', questionHe ?? null, saveCards,
                spreadData.en!, he,
                spreadData.followupQ ?? null, spreadData.followupAnswer ?? null
            );
            setSaved(true);
        } catch {
            alert(translate('failedSave', lang));
        } finally {
            setIsSaving(false);
        }
    };

    const interpret = async (): Promise<void> => {
        setIsInterpreting(true);
        interpretStore.dispatch({ type: InterpretActionType.BeginInterpret, spreadType });
        const myRequestId = interpretStore.getState()[spreadType].requestId;
        try {
            const en = await interpretService.interpretSpread(spreadType, cards, positions, "en", question?.trim() || undefined, isThirdPerson, confirmedCombination, isEventBased);
            // Only commit if nothing superseded this request (another
            // interpret call, or the spread being cleared) while it was in
            // flight — e.g. the user navigating away without triggering a
            // new one still lets this result land normally when it's done.
            if (interpretStore.getState()[spreadType].requestId === myRequestId) {
                interpretStore.dispatch({ type: InterpretActionType.SetEnglish, spreadType, payload: { en } });
                ensureHebrewTranslation(spreadType);
            }
        } catch {
            if (interpretStore.getState()[spreadType].requestId === myRequestId) {
                interpretStore.dispatch({
                    type: InterpretActionType.SetEnglish,
                    spreadType,
                    payload: { en: translate('failedInterpretation', 'en') },
                });
            }
        } finally {
            // Guard against a stale call's finally clearing the spinner for
            // a newer request that's still running on this same widget
            // (e.g. confirming a combination mid-flight starts a second call).
            if (interpretStore.getState()[spreadType].requestId === myRequestId) {
                setIsInterpreting(false);
            }
        }
    };

    useEffect(() => {
        // Depends on `cards` (not just `isOpen`) so a new spread triggers a
        // fresh interpretation even while the panel stays open the whole
        // time — e.g. clicking a different ready question, or submitting a
        // new typed question, without ever closing/reopening the widget.
        // Deliberately ignores `isInterpreting`: if a previous call for an
        // now-superseded spread is still in flight, its requestId guard will
        // no-op it harmlessly, but it also skips resetting isInterpreting —
        // gating on it here would leave the spinner stuck forever with no
        // new call ever starting to eventually clear it.
        if (isOpen && cards.length > 0 && !spreadData.en) {
            interpret();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, cards]);

    useEffect(() => {
        if (!confirmedCombination) return;
        interpret();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [confirmedCombination]);

    useEffect(() => {
        document.body.classList.toggle('iw-open', isOpen);
        return () => document.body.classList.remove('iw-open');
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const handleClick = (e: MouseEvent): void => {
            const target = e.target as HTMLElement;
            if (!target.closest('.modal-widget-root') && !target.closest('.header-lang-btn')) {
                onToggle();
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [isOpen, onToggle]);

    return (
        <div className={`interpret-widget theme-${theme} modal-widget-root`}>
            {isOpen && (
                <div className="iw-panel">
                    <div className="iw-header">
                        <span dir={lang === 'he' ? 'rtl' : 'ltr'}>{translate('readingInterpretation', lang)}</span>
                    </div>
                    <div className="iw-body">
                        {displayQuestion && (
                            <div className="iw-question-display" dir={lang === 'he' ? 'rtl' : 'ltr'}>
                                <span className="iw-question-label">{translate('question', lang)}</span>
                                <p className="iw-question-text" dir={/[\u0590-\u05FF]/.test(displayQuestion) ? 'rtl' : 'ltr'}>{displayQuestion}</p>
                            </div>
                        )}
                        {!canToggle && (
                            <button className="iw-btn" onClick={interpret} disabled={isInterpreting} title={translate('interpretReading', lang)} dir={lang === 'he' ? 'rtl' : 'ltr'}>
                                {isInterpreting ? translate('readingCards', lang) : translate('interpretReading', lang)}
                            </button>
                        )}
                        {isInterpreting && (
                            <div className="iw-spinner-wrap">
                                <div className="iw-spinner" />
                                <span className="iw-spinner-text" dir={lang === 'he' ? 'rtl' : 'ltr'}>{translate('cardsSpeaking', lang)}</span>
                            </div>
                        )}
                        {canToggle && loggedIn && (
                            <button
                                className="iw-save-btn"
                                onClick={spreadData.heFailed ? () => ensureHebrewTranslation(spreadType) : saveReading}
                                disabled={saved || isSaving || heStillPending}
                                title={translate('saveReading', lang)}
                                dir={lang === 'he' ? 'rtl' : 'ltr'}
                            >
                                {saved ? translate('saved', lang)
                                    : isSaving ? translate('saving', lang)
                                    : heStillPending ? translate('translatingHebrew', lang)
                                    : spreadData.heFailed ? translate('failedTranslation', lang)
                                    : translate('saveReading', lang)}
                            </button>
                        )}
                        {awaitingHebrew && (
                            <div className="iw-spinner-wrap">
                                <div className="iw-spinner" />
                                <span className="iw-spinner-text" dir="rtl">{translate('translatingHebrew', lang)}</span>
                            </div>
                        )}
                        {translationFailed && (
                            <button
                                className="iw-btn"
                                onClick={() => ensureHebrewTranslation(spreadType)}
                                title={translate('failedTranslation', lang)}
                                dir="rtl"
                            >
                                {translate('failedTranslation', lang)}
                            </button>
                        )}
                        {current && (
                            <div className="iw-result" dir={contentIsHebrew ? 'rtl' : 'ltr'}>
                                {renderInterpretation(current, cards, positions)}
                            </div>
                        )}
                    </div>
                </div>
            )}
            <button className="iw-toggle-btn" onClick={onToggle} title={isOpen ? translate('close', lang) : translate('readingInterpretation', lang)}>
                {isOpen ? <X size={20} /> : <Info size={20} />}
            </button>
        </div>
    );
}
