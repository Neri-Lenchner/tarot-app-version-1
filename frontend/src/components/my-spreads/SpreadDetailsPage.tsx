import { JSX, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { readingService } from "../../services/ReadingService";
import { IReadingRecord } from "../../arrays-&-models/readingRecord.interface";
import { cardsDeck } from "../../arrays-&-models/tarot-deck-array/tarotDeck";
import { useLang } from "../../state/lang-state";
import { translate, translatePosition, POSITION_HE } from "../../state/translations";
import "./MySpreadsPage.css";

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        + ' · '
        + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

// Matches a line to the card it's about, not just any card whose name
// happens to appear in it — otherwise a paragraph like Celtic's "Potential"
// (which legitimately mentions the position-1/2 cards' names while talking
// about them) grabs whichever card comes first in cardsDeck's own order,
// regardless of which card the line is actually the paragraph for. Same
// position-anchored + shownCards-dedup approach as InterpretWidget's
// renderInterpretation.
function renderInterpretation(text: string, cards: { name: string; position: string }[]): JSX.Element[] {
    const escapeRe = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const shownCards = new Set<string>();
    return text.split('\n').filter(l => l.trim()).map((line, i) => {
        if (line.trim().startsWith('**')) {
            return <h5 key={i} className="spread-details-interp-title">{line.replace(/\*\*/g, '').trim()}</h5>;
        }

        const openingChunk = line.slice(0, 60);
        const positionIdx = cards.findIndex(c => {
            const heName = POSITION_HE[c.position];
            const enRe = new RegExp(`\\b${escapeRe(c.position)}\\b`, 'i');
            return enRe.test(openingChunk) || (!!heName && openingChunk.includes(heName));
        });

        let matchedName: string | null = null;
        if (positionIdx !== -1 && !shownCards.has(cards[positionIdx].name)) {
            matchedName = cards[positionIdx].name;
        } else {
            const byName = cards.find(c => !shownCards.has(c.name) && new RegExp(`\\b${escapeRe(c.name)}\\b`, 'i').test(line));
            matchedName = byName ? byName.name : null;
        }

        const matchedCard = matchedName ? cardsDeck.find(c => c.name.toLowerCase() === matchedName!.toLowerCase()) : undefined;
        if (matchedCard) {
            shownCards.add(matchedCard.name);
            return (
                <div key={i} className="iw-card-row">
                    <div className="iw-card-vignette">
                        <img src={`/${matchedCard.src}`} alt={matchedCard.name} className="iw-card-img" />
                    </div>
                    <p className="spread-details-interp-text">{line}</p>
                </div>
            );
        }
        return <p key={i} className="spread-details-interp-text">{line}</p>;
    });
}

function SpreadDetailsPage(): JSX.Element {
    const params = useParams();
    const navigate = useNavigate();
    const lang = useLang();
    const [reading, setReading] = useState<IReadingRecord | null>(null);
    const [loading, setLoading] = useState(true);
    // Starts from the app's current language rather than a hardcoded 'en' —
    // otherwise every saved reading opened while in Hebrew mode still showed
    // English first, reading as if the Hebrew translation had never saved.
    const [viewLang, setViewLang] = useState<'en' | 'he'>(lang);

    useEffect((): void => {
        async function getSingleReading(id: number): Promise<void> {
            try {
                const reading = await readingService.getReadingById(id);
                setReading(reading);
                setLoading(false);
            } catch {
                navigate('/my-spreads');
            }
        }

        if (params.id) {
            void getSingleReading(+params.id);
        }
    }, [params.id]);

    if (loading) {
        return <div className="spread-details-page"><p className="my-spreads-empty">{translate('loading', lang)}</p></div>;
    }

    if (!reading) return <></>;

    const cards: { name: string; position: string }[] =
        typeof reading.cards === 'string' ? JSON.parse(reading.cards) : reading.cards;
    const spreadLabel = reading.spread_type === 'celtic' ? translate('navCeltic', lang) : reading.spread_type === 'master-spread' ? translate('navMasterSpread', lang) : translate('navThreeCards', lang);
    const spreadClass = reading.spread_type === 'celtic' ? 'celtic' : reading.spread_type === 'master-spread' ? 'master-spread' : 'three-cards';
    const interpretation = viewLang === 'en' ? reading.interpretation_en : reading.interpretation_he;
    // A free-typed question was only ever captured in one language — fall
    // back to whichever exists, same as the live spread page's pattern.
    const displayQuestion = viewLang === 'he' ? (reading.question_he || reading.question) : reading.question;

    return (
        <div className="spread-details-page" dir={lang === 'he' ? 'rtl' : 'ltr'}>
            <button className="spread-details-back" onClick={() => navigate('/my-spreads')} dir={lang === 'he' ? 'rtl' : 'ltr'}>
                {lang === 'he' ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                {translate('backToMySpreads', lang)}
            </button>
            <div className="spread-details-card">
                <div className="spread-details-meta">
                    <span className="spread-details-date">{formatDate(reading.created_at)}</span>
                    <span className={`my-spread-type ${spreadClass}`}>{spreadLabel}</span>
                </div>
                {displayQuestion && (
                    <p className="spread-details-question" dir={/[֐-׿]/.test(displayQuestion) ? 'rtl' : 'ltr'}>"{displayQuestion}"</p>
                )}
                <div className="spread-details-cards">
                    {cards.map((c, i) => (
                        <span key={i} className="spread-details-card-pill">{translatePosition(c.position, viewLang)}: {c.name}</span>
                    ))}
                </div>
                <div className="spread-details-actions">
                    <button className="spread-details-lang" onClick={() => setViewLang(l => l === 'en' ? 'he' : 'en')}>
                        {viewLang === 'en' ? 'HE' : 'EN'}
                    </button>
                </div>
                <div className="spread-details-interpretation" dir={viewLang === 'he' ? 'rtl' : 'ltr'}>
                    {renderInterpretation(interpretation, cards)}
                </div>
                {(reading.followup_question || reading.followup_answer) && (
                    <div className="spread-details-interpretation" dir={viewLang === 'he' ? 'rtl' : 'ltr'}>
                        <h5 className="spread-details-interp-title">{translate('followupQuestionTitle', viewLang)}</h5>
                        {reading.followup_question && (
                            <p className="spread-details-interp-text" style={{ fontStyle: 'italic', opacity: 0.8 }}>"{reading.followup_question}"</p>
                        )}
                        {reading.followup_answer && (
                            <p className="spread-details-interp-text">{reading.followup_answer}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SpreadDetailsPage;
