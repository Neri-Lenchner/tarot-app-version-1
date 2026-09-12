import { Request, Response, NextFunction } from "express";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";

class ErrorMiddleware {
    public serverError(error: unknown, request: Request, response: Response, next: NextFunction): void {
        const isClientError = error instanceof ClientError;
        const statusCode = isClientError ? error.statusCode : StatusCode.InternalServerError;
        const message = isClientError ? error.message : "Internal server error";
        console.error("Error:", error);
        response.status(statusCode).json({ message });
    }

    public catchAll(request: Request, response: Response): void {
        response.status(StatusCode.NotFound).json({ message: "Route not found" });
    }
}

export const errorMiddleware = new ErrorMiddleware();
