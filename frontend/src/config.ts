// Set VITE_API_URL in the deployed environment to the real backend URL —
// without it, this falls back to localhost, which only works in local dev.
export const API_BASE_URL: string = import.meta.env.VITE_API_URL || "http://localhost:4000";
