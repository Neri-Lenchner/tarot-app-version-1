import { Request, Response, NextFunction } from "express";
import { securityService } from "../services/security.service";
import { AuthorizationError } from "../models/client-error";

class TokenMiddleware {
    public validateToken(request: Request, response: Response, next: NextFunction): void {
        const token = request.headers.authorization?.substring(7);
        if (token && securityService.validateToken(token)) {
            next();
            return;
        }
        next(new AuthorizationError("Unauthorized"));
    }
}

export const tokenMiddleware = new TokenMiddleware();
