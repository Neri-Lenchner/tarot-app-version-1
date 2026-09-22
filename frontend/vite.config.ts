import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
    },
    // Vite blocks requests carrying an unrecognized Host header by default
    // (only localhost is trusted) — Railway serves the app behind a dynamic
    // *.up.railway.app domain it doesn't know about, so without this the
    // production preview server rejects every request with "Blocked
    // request. This host is not allowed."
    //
    // PORT is read here (not via `--port $PORT` in the start script)
    // because npm scripts run through cmd.exe on Windows, which doesn't
    // expand $VAR — reading process.env.PORT directly works identically
    // on every platform, including Railway's Linux build.
    preview: {
        host: true,
        allowedHosts: true,
        port: Number(process.env.PORT) || 4173,
    },
});
