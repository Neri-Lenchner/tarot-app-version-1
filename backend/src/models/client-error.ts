export class ClientError extends Error {
    public statusCode: number;
    public constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class ValidationError extends ClientError {
    public constructor(message: string) { super(400, message); }
}

export class NotFoundError extends ClientError {
    public constructor(message: string) { super(404, message); }
}

export class AuthorizationError extends ClientError {
    public constructor(message: string) { super(401, message); }
}

export class RateLimitError extends ClientError {
    public constructor(message: string) { super(429, message); }
}

export class ServiceUnavailableError extends ClientError {
    public constructor(message: string) { super(503, message); }
}
