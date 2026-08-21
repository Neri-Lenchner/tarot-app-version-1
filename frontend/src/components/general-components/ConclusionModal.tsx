import { JSX, useState, useEffect } from 'react';
import { interpretStore, InterpretState } from '../../state/interpret-state';
import './ConclusionModal.css';

interface ConclusionModalProps {
    spreadType: 'celtic' | 'three-cards';
    theme: 'green' | 'blue';
}

function extractConclusion(text: string): string {
    const lines = text.split('\n');
    const idx = lines.findIndex(l =>
        /\*\*conclusion\*\*/i.test(l.trim()) || l.trim().includes('**מסקנה**')
    );
    if (idx === -1) return '';
    return lines.slice(idx + 1).filter(l => l.trim() !== '').join('\n');
}

export function ConclusionModal({ spreadType, theme }: ConclusionModalProps): JSX.Element | null {
    const [stored, setStored] = useState<InterpretState>(interpretStore.getState());
    const [lang, setLang] = useState<'en' | 'he'>('en');
    const [visible, setVisible] = useState(true);
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const unsubscribe = interpretStore.subscribe(() => {
            setStored(interpretStore.getState());
            setVisible(true);
        });
        return unsubscribe;
    }, []);

    const spreadData = stored[spreadType];
    const en = spreadData.en ? extractConclusion(spreadData.en) : null;
    const he = spreadData.he ? extractConclusion(spreadData.he) : null;
    const hasBoth = !!en && !!he;
    const current = lang === 'en' ? en : he;

    if (!current) return null;

    if (!visible) {
        return (
            <button className={`conclusion-reopen-btn theme-${theme}`} onClick={() => setVisible(true)}>✦</button>
        );
    }

    return (
        <div className={`conclusion-modal theme-${theme}${collapsed ? ' conclusion-modal--collapsed' : ''}`}>
            <div className="conclusion-header">
                <span className="conclusion-title">✦ Conclusion</span>
                <div className="conclusion-header-actions">
                    {hasBoth && (
                        <button className="conclusion-lang-btn" onClick={() => setLang(l => l === 'en' ? 'he' : 'en')}>
                            {lang === 'en' ? 'HE' : 'EN'}
                        </button>
                    )}
                    <button className="conclusion-collapse-btn" onClick={() => setCollapsed(c => !c)}>
                        {collapsed ? '▲' : '▼'}
                    </button>
                    <button className="conclusion-close-btn" onClick={() => setVisible(false)}>✕</button>
                </div>
            </div>
            {!collapsed && (
                <div className="conclusion-body" dir={lang === 'he' ? 'rtl' : 'ltr'}>
                    {current.split('\n').map((line, i) => (
                        <p key={i} className="conclusion-text">{line}</p>
                    ))}
                </div>
            )}
        </div>
    );
}
