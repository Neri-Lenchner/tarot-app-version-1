import express, { Request, Response, NextFunction } from "express";
import { tarotService } from "../services/tarot.service";
import { IInterpretRequest } from "../dto/tarot.dto";
import { ValidationError, AuthorizationError } from "../models/client-error";
import { tokenMiddleware } from "../middleware/token.middleware";
import { maintenanceMiddleware } from "../middleware/maintenance.middleware";
import { securityService } from "../services/security.service";
import { quotaService } from "../services/quota.service";

class TarotController {
    public readonly router = express.Router();

    constructor() {
        this.router.post("/api/tarot/interpret", maintenanceMiddleware.blockIfDown, tokenMiddleware.validateToken, this.interpret);
        this.router.post("/api/tarot/check-combinations", maintenanceMiddleware.blockIfDown, this.checkCombinations);
        this.router.post("/api/tarot/followup", maintenanceMiddleware.blockIfDown, tokenMiddleware.validateToken, this.followup);
        this.router.post("/api/tarot/translate", maintenanceMiddleware.blockIfDown, this.translate);
    }

    public async translate(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const { text, gender }: { text: string; gender?: "male" | "female" } = request.body;
            if (!text?.trim()) {
                throw new ValidationError("text is required");
            }
            const translation = await tarotService.translateInterpretation(text, gender);
            response.json({ translation });
        } catch (error) {
            next(error);
        }
    }

    public checkCombinations(request: Request, response: Response, next: NextFunction): void {
        try {
            const { cardNames, question }: { cardNames: string[]; question?: string } = request.body;
            if (!Array.isArray(cardNames) || cardNames.length === 0) {
                throw new ValidationError("cardNames array is required");
            }
            const matches = tarotService.checkCombinations(cardNames, question);
            response.json(matches);
        } catch (error) {
            next(error);
        }
    }

    public async followup(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const token = request.headers.authorization!.substring(7);
            const user = securityService.extractUser(token);
            if (!user?.id) throw new AuthorizationError("Unauthorized");
            const { question, interpretation, language }: { question: string; interpretation: string; language?: "en" | "he" } = request.body;
            if (!question?.trim() || !interpretation?.trim()) {
                throw new ValidationError("question and interpretation are required");
            }
            await quotaService.assertQuestionAllowed(user.id);
            const answer = await tarotService.followupQuestion(question, interpretation, language);
            response.json({ answer });
        } catch (error) {
            next(error);
        }
    }

    public async interpret(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const token = request.headers.authorization!.substring(7);
            const user = securityService.extractUser(token);
            if (!user?.id) throw new AuthorizationError("Unauthorized");
            const { spreadType, cards, language, question, isThirdPerson, isEventBased, confirmedCombination, gender }: IInterpretRequest = request.body;
            if (!spreadType || !cards || cards.length === 0) {
                throw new ValidationError("spreadType and cards are required");
            }
            await quotaService.assertQuestionAllowed(user.id);
            const interpretation: string = await tarotService.interpretSpread(spreadType, cards, language, question, isThirdPerson, confirmedCombination, gender, isEventBased);
            response.json({ interpretation });
        } catch (error) {
            next(error);
        }
    }
}

export const tarotController = new TarotController();
