import { JSX, useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { adminService } from "../../services/AdminService";
import { useLang } from "../../state/lang-state";
import { translate } from "../../state/translations";
import "./AdminPage.css";

function AdminPage(): JSX.Element {
    const lang = useLang();
    const [active, setActive] = useState<boolean | null>(null);
    const [busy, setBusy] = useState(false);
    const dir = lang === 'he' ? 'rtl' : 'ltr';

    useEffect(() => {
        adminService.getMaintenanceStatus()
            .then(setActive)
            .catch(() => setActive(null));
    }, []);

    const toggle = async (): Promise<void> => {
        if (active === null) return;
        const next = !active;
        if (next && !window.confirm(translate('adminMaintenanceConfirm', lang))) return;
        setBusy(true);
        try {
            const result = await adminService.setMaintenanceStatus(next);
            setActive(result);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="admin-page" dir={dir}>
            <h2 className="admin-title">{translate('adminTitle', lang)}</h2>
            <div className="admin-card admin-danger-zone">
                <div className="admin-danger-label">
                    <AlertTriangle size={16} />
                    <span>{translate('adminDangerZone', lang)}</span>
                </div>
                <h3 className="admin-card-heading">{translate('adminMaintenanceHeading', lang)}</h3>
                {active === null ? (
                    <p className="admin-status-text">{translate('loading', lang)}</p>
                ) : (
                    <>
                        <p className={`admin-status-text ${active ? 'admin-status-danger' : 'admin-status-ok'}`}>
                            {active ? translate('adminMaintenanceActive', lang) : translate('adminMaintenanceInactive', lang)}
                        </p>
                        <button
                            className={`admin-toggle-btn ${active ? 'admin-toggle-btn--resume' : 'admin-toggle-btn--stop'}`}
                            onClick={toggle}
                            disabled={busy}
                        >
                            {active ? translate('adminDisableMaintenance', lang) : translate('adminEnableMaintenance', lang)}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default AdminPage;
