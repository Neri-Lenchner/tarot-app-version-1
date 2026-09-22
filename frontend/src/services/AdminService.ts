import axios from "axios";
import { authStore } from "../state/auth-state";
import { API_BASE_URL } from "../config";

const BASE = `${API_BASE_URL}/api/admin`;

class AdminService {
    private get authHeader() {
        return { Authorization: `Bearer ${authStore.getState().token}` };
    }

    async getMaintenanceStatus(): Promise<boolean> {
        const response = await axios.get<{ active: boolean }>(`${BASE}/maintenance`, { headers: this.authHeader });
        return response.data.active;
    }

    async setMaintenanceStatus(active: boolean): Promise<boolean> {
        const response = await axios.post<{ active: boolean }>(`${BASE}/maintenance`, { active }, { headers: this.authHeader });
        return response.data.active;
    }
}

export const adminService = new AdminService();
