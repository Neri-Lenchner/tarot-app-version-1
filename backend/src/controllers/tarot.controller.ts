import express, { Request, Response, NextFunction } from "express";
import { tarotService } from "../services/tarot.service";
import { IInterpretRequest } from "../dto/tarot.dto";
import { ValidationError } from "../models/client-error";

class TarotController {
    public readonly router = express.Router();

    constructor() {
        this.router.post("/api/tarot/interpret", this.interpret);
        this.router.post("/api/tarot/check-combinations", this.checkCombinations);
        this.router.post("/api/tarot/followup", this.followup);
        this.router.post("/api/tarot/translate", this.translate);
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
            const { question, interpretation, language }: { question: string; interpretation: string; language?: "en" | "he" } = request.body;
            if (!question?.trim() || !interpretation?.trim()) {
                throw new ValidationError("question and interpretation are required");
            }
            const answer = await tarotService.followupQuestion(question, interpretation, language);
            response.json({ answer });
        } catch (error) {
            next(error);
        }
    }

    public async interpret(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const { spreadType, cards, language, question, isThirdPerson, confirmedCombination, gender }: IInterpretRequest = request.body;
            if (!spreadType || !cards || cards.length === 0) {
                throw new ValidationError("spreadType and cards are required");
            }
            const interpretation: string = await tarotService.interpretSpread(spreadType, cards, language, question, isThirdPerson, confirmedCombination, gender);
            response.json({ interpretation });
        } catch (error) {
            next(error);
        }
    }
}

export const tarotController = new TarotController();
