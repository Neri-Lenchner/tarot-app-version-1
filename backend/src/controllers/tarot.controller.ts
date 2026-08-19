import express, { Request, Response, NextFunction } from "express";
import { tarotService } from "../services/tarot.service";
import { IInterpretRequest } from "../dto/tarot.dto";
import { ValidationError } from "../models/client-error";

class TarotController {
    public readonly router = express.Router();

    constructor() {
        this.router.post("/api/tarot/interpret", this.interpret);
    }

    public async interpret(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const { spreadType, cards, language }: IInterpretRequest = request.body;
            if (!spreadType || !cards || cards.length === 0) {
                throw new ValidationError("spreadType and cards are required");
            }
            const interpretation: string = await tarotService.interpretSpread(spreadType, cards, language);
            response.json({ interpretation });
        } catch (error) {
            next(error);
        }
    }
}

export const tarotController = new TarotController();
