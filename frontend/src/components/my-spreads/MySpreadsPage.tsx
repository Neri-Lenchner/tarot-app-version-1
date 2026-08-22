import { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authStore } from "../../state/auth-state";
import { readingService, IReadingRecord } from "../../services/ReadingService";
import "./MySpreadsPage.css";

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        + ' · '
        + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function MySpreadsPage(): JSX.Element {
    const navigate = useNavigate();
    const [readings, setReadings] = useState<IReadingRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authStore.getState().user) { navigate('/login'); return; }
        readingService.getMyReadings()
            .then(r => { setReadings(r); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const handleDelete = async (e: React.MouseEvent, id: number): Promise<void> => {
        e.stopPropagation();
        await readingService.delete(id);
        setReadings(prev => prev.filter(r => r.id !== id));
    };

    return (
        <div className="my-spreads-page">
            <h2 className="my-spreads-title">My Spreads</h2>
            {loading && <p className="my-spreads-empty">Loading...</p>}
            {!loading && readings.length === 0 && <p className="my-spreads-empty">No saved readings yet.</p>}
            <div className="my-spreads-list">
                {readings.map(r => {
                    const spreadLabel = r.spread_type === 'celtic' ? 'Celtic Spread' : 'Old Gipsy Spread';
                    const spreadClass = r.spread_type === 'celtic' ? 'celtic' : 'three-cards';
                    return (
                        <div key={r.id} className="my-spread-item" onClick={() => navigate(`/my-spreads/${r.id}`)}>
                            <div className="my-spread-item-left">
                                <span className="my-spread-date">{formatDate(r.created_at)}</span>
                                {r.question && <span className="my-spread-question-preview">"{r.question}"</span>}
                            </div>
                            <div className="my-spread-item-right">
                                <span className={`my-spread-type ${spreadClass}`}>{spreadLabel}</span>
                                <button
                                    className="my-spread-delete-btn"
                                    onClick={e => handleDelete(e, r.id)}
                                    title="Delete"
                                >✕</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default MySpreadsPage;
