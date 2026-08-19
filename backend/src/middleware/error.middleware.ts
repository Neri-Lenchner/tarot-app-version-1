import { Request, Response, NextFunction } from "express";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";

class ErrorMiddleware {
    public serverError(error: any, request: Request, response: Response, next: NextFunction): void {
        const statusCode = error instanceof ClientError ? error.statusCode : StatusCode.InternalServerError;
        const message = error.message || "Internal server error";
        console.error(`Error: ${message}`);
        response.status(statusCode).json({ message });
    }

    public catchAll(request: Request, response: Response): void {
        response.status(StatusCode.NotFound).json({ message: "Route not found" });
    }
}

export const errorMiddleware = new ErrorMiddleware();
