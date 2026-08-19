import { Request, Response, NextFunction } from "express";

class LoggerMiddleware {
    public consoleLog(request: Request, response: Response, next: NextFunction): void {
        console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
        next();
    }
}

export const loggerMiddleware = new LoggerMiddleware();
