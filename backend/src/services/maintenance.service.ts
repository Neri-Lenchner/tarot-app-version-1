import { dal } from "../utils/dal";

// Single-row settings table (id is always 1) — see tarot_db.sql for the
// seed row this reads/writes.
class MaintenanceService {
    public async isActive(): Promise<boolean> {
        const rows = await dal.execute("SELECT maintenanceMode FROM app_settings WHERE id = 1") as { maintenanceMode: number | boolean }[];
        return Boolean(rows[0]?.maintenanceMode);
    }

    public async setActive(active: boolean): Promise<void> {
        await dal.execute("UPDATE app_settings SET maintenanceMode = ? WHERE id = 1", [active]);
    }
}

export const maintenanceService = new MaintenanceService();
