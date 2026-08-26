import { JSX, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { readingService } from "../../services/ReadingService";
import { IReadingRecord } from "../../arrays-&-models/readingRecord.interface";
import { cardsDeck } from "../../arrays-&-models/tarot-deck-array/tarotDeck";
import { useLang } from "../../state/lang-state";
import { translate, translatePosition } from "../../state/translations";
import "./MySpreadsPage.css";

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        + ' · '
        + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function renderInterpretation(text: string): JSX.Element[] {
    return text.split('\n').filter(l => l.trim()).map((line, i) => {
        if (line.trim().startsWith('**')) {
            return <h5 key={i} className="spread-details-interp-title">{line.replace(/\*\*/g, '').trim()}</h5>;
        }
        const matchedCard = cardsDeck.find(c => line.toLowerCase().includes(c.name.toLowerCase()));
        if (matchedCard) {
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
    const [viewLang, setViewLang] = useState<'en' | 'he'>('en');

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
    const spreadLabel = reading.spread_type === 'celtic' ? translate('navCeltic', lang) : translate('navThreeCards', lang);
    const spreadClass = reading.spread_type === 'celtic' ? 'celtic' : 'three-cards';
    const interpretation = viewLang === 'en' ? reading.interpretation_en : reading.interpretation_he;

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
                {reading.question && <p className="spread-details-question">"{reading.question}"</p>}
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
                    {renderInterpretation(interpretation)}
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
