import axios from "axios";
import { authStore, Login } from "../state/auth-state";

const BASE = "http://localhost:4000/api/auth";

class AuthService {
    async register(firstName: string, lastName: string, email: string, password: string, gender: 'male' | 'female'): Promise<void> {
        const response = await axios.post<{ token: string }>(`${BASE}/register`, { firstName, lastName, email, password, gender });
        authStore.dispatch(Login(response.data.token));
    }

    async login(email: string, password: string): Promise<void> {
        const response = await axios.post<{ token: string }>(`${BASE}/login`, { email, password });
        authStore.dispatch(Login(response.data.token));
    }
}

export const authService = new AuthService();
