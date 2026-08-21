import Joi from "joi";
import { ValidationError } from "./client-error";

export class User {
    public id?: number;
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;

    constructor(user: User) {
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.password = user.password;
    }

    private static validationSchema = Joi.object({
        id: Joi.number().optional().positive(),
        firstName: Joi.string().required().min(2).max(50),
        lastName: Joi.string().required().min(2).max(50),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(4).max(256),
    });

    public validate(): void {
        const result = User.validationSchema.validate(this);
        if (result.error) throw new ValidationError(result.error.message);
    }
}
