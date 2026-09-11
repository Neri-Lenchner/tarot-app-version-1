import { JSX, useState, useEffect } from 'react';
import { Info, X } from 'lucide-react';
import { interpretStore, InterpretState, InterpretActionType, ensureHebrewTranslation } from '../../../state/interpret-state';
import { useLang } from '../../../state/lang-state';
import { translate } from '../../../state/translations';
import { interpretService } from '../../../services/InterpretService';
import './ConclusionModal.css';

interface IConclusionModalProps {
    spreadType: 'celtic' | 'three-cards' | 'master-spread';
    theme: 'green' | 'blue' | 'gold';
}

function extractConclusion(text: string): string {
    const lines = text.split('\n');
    const CONCLUSION_RE = /^\*\*\s*(conclusion|מסקנה|סיכום|לסיכום)\s*:?\*\*$/i;
    const idx = lines.findIndex(l => CONCLUSION_RE.test(l.trim()));
    if (idx === -1) return '';
    return lines.slice(idx + 1).filter(l => l.trim() !== '').join('\n');
}

export function ConclusionModal({ spreadType, theme }: IConclusionModalProps): JSX.Element | null {
    const [stored, setStored] = useState<InterpretState>(interpretStore.getState());
    const lang = useLang();
    // Starts closed: this component remounts fresh on every navigation to a
    // spread page (each spread route is a distinct top-level component), but
    // interpretStore itself is a global, session-persisted store — so a
    // spread visited earlier already has data waiting. Defaulting to visible
    // would pop this modal open immediately on arrival/navigation instead of
    // requiring an explicit click on the reopen button.
    const [visible, setVisible] = useState(false);
    const [followupQ, setFollowupQ] = useState('');
    const [followupAnswer, setFollowupAnswer] = useState<string | null>(null);
    const [followupLoading, setFollowupLoading] = useState(false);
    useEffect(() => {
        const unsubscribe = interpretStore.subscribe(() => {
            const newStored = interpretStore.getState();
            setStored(newStored);
            setVisible(true);
            if (newStored[spreadType].followupAnswer == null) {
                setFollowupQ('');
                setFollowupAnswer(null);
            }
        });
        return unsubscribe;
    }, []);

    const handleFollowup = async (): Promise<void> => {
        if (!followupQ.trim() || followupLoading) return;
        const spreadData = stored[spreadType];
        const interpretation = spreadData.en || spreadData.he || '';
        if (!interpretation) return;
        setFollowupLoading(true);
        setFollowupAnswer(null);
        try {
            const answer = await interpretService.followupQuestion(followupQ.trim(), interpretation, lang);
            setFollowupAnswer(answer);
            interpretStore.dispatch({ type: InterpretActionType.SetFollowup, spreadType, followup: { question: followupQ.trim(), answer } });
        } finally {
            setFollowupLoading(false);
        }
    };

    const spreadData = stored[spreadType];
    const en = spreadData.en ? extractConclusion(spreadData.en) : null;
    const he = spreadData.he ? extractConclusion(spreadData.he) : null;
    // Fall back to the ready English conclusion while Hebrew is still
    // translating (or failed) instead of blocking the view on a spinner.
    const current = lang === 'he' ? (he ?? en) : en;
    const contentIsHebrew = lang === 'he' && he !== null;
    const awaitingHebrew = lang === 'he' && spreadData.he === null && !!spreadData.heLoading;
    const translationFailed = lang === 'he' && spreadData.en !== null && spreadData.he === null && !spreadData.heLoading && !!spreadData.heFailed;

    useEffect(() => {
        if (!visible) return;
        const handleClick = (e: MouseEvent): void => {
            const target = e.target as HTMLElement;
            if (!target.closest('.modal-widget-root') && !target.closest('.conclusion-reopen-btn') && !target.closest('.header-lang-btn')) {
                setVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [visible]);

    if (!current && !awaitingHebrew && !translationFailed) return null;

    return (
        <>
            <div className="conclusion-widget modal-widget-root">
                {visible && (
                    <div className={`conclusion-modal theme-${theme}`} onClick={e => e.stopPropagation()}>
                        <div className="conclusion-header">
                            <span className="conclusion-title">{lang === 'he' ? '+ מסקנה' : '+ Conclusion'}</span>
                        </div>
                        <div className="conclusion-body">
                            {awaitingHebrew && (
                                <p className="conclusion-text" dir="rtl">{translate('translatingHebrew', lang)}</p>
                            )}
                            {translationFailed && (
                                <p
                                    className="conclusion-text"
                                    dir="rtl"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => ensureHebrewTranslation(spreadType)}
                                >
                                    {translate('failedTranslation', lang)}
                                </p>
                            )}
                            {current && current.split('\n').map((line, i) => (
                                <p key={i} className="conclusion-text" dir={contentIsHebrew ? 'rtl' : 'ltr'}>{line}</p>
                            ))}
                        </div>
                        <div className="conclusion-followup" dir={lang === 'he' ? 'rtl' : 'ltr'}>
                            <div className="conclusion-followup-row">
                                <input
                                    className="conclusion-followup-input"
                                    type="text"
                                    placeholder={lang === 'he' ? 'שאל שאלה נוספת על הפריסה...' : 'Ask a follow-up question about this spread...'}
                                    value={followupQ}
                                    onChange={e => setFollowupQ(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleFollowup()}
                                    disabled={followupLoading}
                                />
                                <button
                                    className="conclusion-followup-btn"
                                    onClick={handleFollowup}
                                    disabled={!followupQ.trim() || followupLoading}
                                >
                                    {followupLoading ? '...' : 'i'}
                                </button>
                            </div>
                            {followupAnswer && (
                                <div className="conclusion-followup-answer">
                                    {followupAnswer}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <button className={`conclusion-reopen-btn theme-${theme}`} onClick={e => { e.stopPropagation(); setVisible(v => !v); }}>
                {visible ? <X size={18} /> : <Info size={18} />}
            </button>
        </>
    );
}
