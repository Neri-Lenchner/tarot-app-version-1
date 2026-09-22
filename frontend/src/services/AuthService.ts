import axios from "axios";
import { authStore, Login } from "../state/auth-state";
import { noticeStore } from "../state/notice-state";
import { API_BASE_URL } from "../config";

const BASE = `${API_BASE_URL}/api/auth`;

class AuthService {
    async register(firstName: string, lastName: string, email: string, password: string, gender: 'male' | 'female'): Promise<void> {
        const response = await axios.post<{ token: string }>(`${BASE}/register`, { firstName, lastName, email, password, gender });
        authStore.dispatch(Login(response.data.token));
        noticeStore.show();
    }

    async login(email: string, password: string): Promise<void> {
        const response = await axios.post<{ token: string }>(`${BASE}/login`, { email, password });
        authStore.dispatch(Login(response.data.token));
        noticeStore.show();
    }
}

export const authService = new AuthService();
