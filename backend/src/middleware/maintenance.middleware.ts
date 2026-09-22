import { Request, Response, NextFunction } from "express";
import { maintenanceService } from "../services/maintenance.service";
import { ServiceUnavailableError } from "../models/client-error";

class MaintenanceMiddleware {
    public async blockIfDown(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const active = await maintenanceService.isActive();
            if (active) {
                throw new ServiceUnavailableError("Berta's Tarot is temporarily paused for maintenance. Please try again shortly.");
            }
            next();
        } catch (error) {
            next(error);
        }
    }
}

export const maintenanceMiddleware = new MaintenanceMiddleware();
