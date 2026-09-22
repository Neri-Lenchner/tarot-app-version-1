import bcrypt from "bcrypt";
import { ResultSetHeader } from "mysql2";
import { dal } from "../utils/dal";
import { User } from "../models/user.model";
import { Credentials } from "../models/credentials.model";
import { ValidationError, AuthorizationError } from "../models/client-error";
import { securityService } from "./security.service";
import { quotaService } from "./quota.service";
import { appConfig } from "../utils/app-config";

class AuthService {

    public async register(user: User): Promise<string> {
        user.validate();
        await quotaService.assertRegistrationAllowed();
        const exists = await this.emailExists(user.email);
        if (exists) throw new ValidationError("Email already taken");
        user.password = await securityService.hash(user.password);
        user.isAdmin = this.isAdminEmail(user.email);
        const sql = "INSERT INTO users (firstName, lastName, email, password, gender, isAdmin) VALUES (?, ?, ?, ?, ?, ?)";
        const result = await dal.execute(sql, [user.firstName, user.lastName, user.email, user.password, user.gender ?? null, user.isAdmin]) as ResultSetHeader;
        user.id = result.insertId;
        return securityService.generateToken(user);
    }

    public async login(credentials: Credentials): Promise<string> {
        credentials.validate();
        const sql = "SELECT * FROM users WHERE email = ?";
        const rows = await dal.execute(sql, [credentials.email]) as User[];
        const user = rows[0];
        if (!user) throw new AuthorizationError("Incorrect email or password");
        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) throw new AuthorizationError("Incorrect email or password");
        // Self-healing promotion: if this email matches the configured admin
        // email but the DB row predates ADMIN_EMAIL being set (or drifted
        // out of sync some other way), flip it here so admin access never
        // depends on a manual SQL step — it corrects itself on next login.
        const shouldBeAdmin = Boolean(user.isAdmin) || this.isAdminEmail(user.email);
        if (shouldBeAdmin !== Boolean(user.isAdmin)) {
            await dal.execute("UPDATE users SET isAdmin = TRUE WHERE id = ?", [user.id]);
        }
        user.isAdmin = shouldBeAdmin;
        return securityService.generateToken(user);
    }

    private isAdminEmail(email: string): boolean {
        return !!appConfig.adminEmail && email.toLowerCase() === appConfig.adminEmail.toLowerCase();
    }

    private async emailExists(email: string): Promise<boolean> {
        const sql = "SELECT id FROM users WHERE email = ?";
        const rows = await dal.execute(sql, [email]) as { id: number }[];
        return rows.length > 0;
    }
}

export const authService = new AuthService();
