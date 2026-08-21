import express, { Request, Response, NextFunction } from "express";
import { tarotService } from "../services/tarot.service";
import { IInterpretRequest } from "../dto/tarot.dto";
import { ValidationError } from "../models/client-error";

class TarotController {
    public readonly router = express.Router();

    constructor() {
        this.router.post("/api/tarot/interpret", this.interpret);
        this.router.post("/api/tarot/check-combinations", this.checkCombinations);
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

    public async interpret(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const { spreadType, cards, language, question }: IInterpretRequest = request.body;
            if (!spreadType || !cards || cards.length === 0) {
                throw new ValidationError("spreadType and cards are required");
            }
            const interpretation: string = await tarotService.interpretSpread(spreadType, cards, language, question);
            response.json({ interpretation });
        } catch (error) {
            next(error);
        }
    }
}

export const tarotController = new TarotController();
