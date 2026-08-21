import Joi from "joi";
import { ValidationError } from "./client-error";

export class Credentials {
    public email: string;
    public password: string;

    constructor(credentials: Credentials) {
        this.email = credentials.email;
        this.password = credentials.password;
    }

    private static validationSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(4).max(256),
    });

    public validate(): void {
        const result = Credentials.validationSchema.validate(this);
        if (result.error) throw new ValidationError(result.error.message);
    }
}
