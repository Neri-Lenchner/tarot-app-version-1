import { JSX, useState, useEffect } from 'react';
import { interpretStore, InterpretState, InterpretActionType, ensureHebrewTranslation } from '../../../state/interpret-state';
import { langStore, LangActionType, Lang } from '../../../state/lang-state';
import { interpretService } from '../../../services/InterpretService';
import './ConclusionModal.css';

interface IConclusionModalProps {
    spreadType: 'celtic' | 'three-cards';
    theme: 'green' | 'blue';
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
    const [lang, setLang] = useState<Lang>(langStore.getState().lang);
    const [visible, setVisible] = useState(true);
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
    const canToggle = spreadData.en !== null;
    const isTranslating = lang === 'he' && spreadData.en !== null && spreadData.he === null;
    const current = lang === 'en' ? en : he;

    if (!current && !isTranslating) return null;

    return (
        <div className="conclusion-widget">
            {visible && (
                <div className={`conclusion-modal theme-${theme}`} onClick={e => e.stopPropagation()}>
                    <div className="conclusion-header">
                        <span className="conclusion-title">{lang === 'he' ? '✦ מסקנה' : '✦ Conclusion'}</span>
                        <div className="conclusion-header-actions">
                            {canToggle && (
                                <button className="conclusion-lang-btn" onClick={toggleLang}>
                                    {lang === 'en' ? 'HE' : 'EN'}
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="conclusion-body" dir={lang === 'he' ? 'rtl' : 'ltr'}>
                        {isTranslating ? (
                            <p className="conclusion-text">Translating to Hebrew...</p>
                        ) : (
                            current!.split('\n').map((line, i) => (
                                <p key={i} className="conclusion-text">{line}</p>
                            ))
                        )}
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
                                {followupLoading ? '...' : '✦'}
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
            <button className={`conclusion-reopen-btn theme-${theme}`} onClick={e => { e.stopPropagation(); setVisible(v => !v); }}>
                {visible ? '✕' : '✦'}
            </button>
        </div>
    );
}
