import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

interface AuthState {
    token: string | null;
    user: AuthUser | null;
}

function decodeToken(token: string): AuthUser | null {
    try {
        const base64url = token.split('.')[1];
        const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        return payload.user ?? null;
    } catch {
        return null;
    }
}

const savedToken = localStorage.getItem("tarot-token");

const initialState: AuthState = {
    token: savedToken,
    user: savedToken ? decodeToken(savedToken) : null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        Login(state, action: PayloadAction<string>) {
            state.token = action.payload;
            state.user = decodeToken(action.payload);
            localStorage.setItem("tarot-token", action.payload);
        },
        Logout(state) {
            state.token = null;
            state.user = null;
            localStorage.removeItem("tarot-token");
        },
    },
});

export const { Login, Logout } = authSlice.actions;

export const authStore = configureStore({ reducer: authSlice.reducer });
