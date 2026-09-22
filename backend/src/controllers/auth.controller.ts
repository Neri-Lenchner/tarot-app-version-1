import express, { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { User } from "../models/user.model";
import { Credentials } from "../models/credentials.model";
import { authService } from "../services/auth.service";

// Per-IP brute-force guard on login — 10 attempts per 15 minutes is enough
// slack for a real user mistyping their password a few times, while still
// meaningfully slowing down credential-guessing. In-memory (resets on
// server restart) is fine at this app's scale; a distributed store would
// only matter across multiple server instances.
const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many login attempts. Please try again later." },
});

class AuthController {
    public router = express.Router();

    constructor() {
        this.router.post("/api/auth/register", this.register);
        this.router.post("/api/auth/login", loginRateLimiter, this.login);
    }

    public async register(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const user = new User(request.body);
            const token = await authService.register(user);
            response.status(201).json({ token });
        } catch (error) { next(error); }
    }

    public async login(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const credentials = new Credentials(request.body);
            const token = await authService.login(credentials);
            response.status(200).json({ token });
        } catch (error) { next(error); }
    }
}

export const authController = new AuthController();
