import express, { Request, Response, NextFunction } from "express";
import { tokenMiddleware } from "../middleware/token.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
import { maintenanceService } from "../services/maintenance.service";
import { ValidationError } from "../models/client-error";

class AdminController {
    public router = express.Router();

    constructor() {
        this.router.get("/api/admin/maintenance", tokenMiddleware.validateToken, adminMiddleware.requireAdmin, this.getMaintenance);
        this.router.post("/api/admin/maintenance", tokenMiddleware.validateToken, adminMiddleware.requireAdmin, this.setMaintenance);
    }

    private async getMaintenance(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const active = await maintenanceService.isActive();
            response.json({ active });
        } catch (error) { next(error); }
    }

    private async setMaintenance(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const { active } = request.body;
            if (typeof active !== "boolean") throw new ValidationError("active (boolean) is required");
            await maintenanceService.setActive(active);
            response.json({ active });
        } catch (error) { next(error); }
    }
}

export const adminController = new AdminController();
