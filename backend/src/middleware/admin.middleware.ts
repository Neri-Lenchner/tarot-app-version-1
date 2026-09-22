import { Request, Response, NextFunction } from "express";
import { securityService } from "../services/security.service";
import { AuthorizationError } from "../models/client-error";

// Must run after tokenMiddleware.validateToken so the token is already
// known-valid here — this only re-decodes it to check the isAdmin claim.
class AdminMiddleware {
    public requireAdmin(request: Request, response: Response, next: NextFunction): void {
        const token = request.headers.authorization?.substring(7);
        const user = token ? securityService.extractUser(token) : null;
        if (!user?.isAdmin) {
            next(new AuthorizationError("Admin access required"));
            return;
        }
        next();
    }
}

export const adminMiddleware = new AdminMiddleware();
