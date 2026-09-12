import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { appConfig } from "../utils/app-config";
import { User } from "../models/user.model";

class SecurityService {

    public async hash(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    public generateToken(user: User): string {
        const { password, ...safeUser } = user;
        const container = { user: safeUser };
        const options: SignOptions = { expiresIn: "30d" };
        return jwt.sign(container, appConfig.jwtSecret, options);
    }

    public validateToken(token: string): boolean {
        if (!token) return false;
        try {
            jwt.verify(token, appConfig.jwtSecret);
            return true;
        } catch {
            return false;
        }
    }

    public extractUser(token: string): User | null {
        try {
            const container = jwt.verify(token, appConfig.jwtSecret) as { user: User };
            return container.user;
        } catch {
            return null;
        }
    }
}

export const securityService = new SecurityService();
