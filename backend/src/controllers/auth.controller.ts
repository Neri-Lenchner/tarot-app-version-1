import express, { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import { Credentials } from "../models/credentials.model";
import { authService } from "../services/auth.service";

class AuthController {
    public router = express.Router();

    constructor() {
        this.router.post("/api/auth/register", this.register);
        this.router.post("/api/auth/login", this.login);
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
