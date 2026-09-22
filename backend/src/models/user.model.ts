import Joi from "joi";
import { ValidationError } from "./client-error";

export class User {
    public id?: number;
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public gender?: 'male' | 'female';
    // Always server-computed (see AuthService.isAdminEmail) — deliberately
    // NOT copied from the constructor's input object, so a client can never
    // self-promote by sending isAdmin in a register/login request body.
    public isAdmin: boolean = false;

    constructor(user: User) {
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.password = user.password;
        this.gender = user.gender;
    }

    private static validationSchema = Joi.object({
        id: Joi.number().optional().positive(),
        firstName: Joi.string().required().min(2).max(50),
        lastName: Joi.string().required().min(2).max(50),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(4).max(256),
        gender: Joi.string().valid('male', 'female').required(),
    });

    public validate(): void {
        const result = User.validationSchema.validate(this);
        if (result.error) throw new ValidationError(result.error.message);
    }
}
