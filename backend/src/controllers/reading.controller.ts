import express, { Request, Response, NextFunction } from "express";
import { tokenMiddleware } from "../middleware/token.middleware";
import { securityService } from "../services/security.service";
import { readingService } from "../services/reading.service";

class ReadingController {
    public router = express.Router();

    constructor() {
        this.router.post("/api/readings", tokenMiddleware.validateToken, this.save);
        this.router.get("/api/readings", tokenMiddleware.validateToken, this.getMyReadings);
        this.router.get("/api/readings/:id", tokenMiddleware.validateToken, this.getOne);
        this.router.delete("/api/readings/:id", tokenMiddleware.validateToken, this.deleteOne);
    }

    private async save(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const token = request.headers.authorization!.substring(7);
            const user = securityService.extractUser(token)!;
            const { spreadType, question, cards, interpretationEn, interpretationHe } = request.body;
            const reading = await readingService.save(user.id!, spreadType, question, cards, interpretationEn, interpretationHe);
            response.status(201).json(reading);
        } catch (error) { next(error); }
    }

    private async getMyReadings(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const token = request.headers.authorization!.substring(7);
            const user = securityService.extractUser(token)!;
            const readings = await readingService.getUserReadings(user.id!);
            response.status(200).json(readings);
        } catch (error) { next(error); }
    }

    private async deleteOne(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const token = request.headers.authorization!.substring(7);
            const user = securityService.extractUser(token)!;
            const deleted = await readingService.deleteReading(user.id!, +request.params.id);
            if (!deleted) { response.status(404).json({ message: "Reading not found" }); return; }
            response.status(204).send();
        } catch (error) { next(error); }
    }

    private async getOne(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const token = request.headers.authorization!.substring(7);
            const user = securityService.extractUser(token)!;
            const reading = await readingService.getReading(user.id!, +request.params.id);
            if (!reading) { response.status(404).json({ message: "Reading not found" }); return; }
            response.status(200).json(reading);
        } catch (error) { next(error); }
    }
}

export const readingController = new ReadingController();
