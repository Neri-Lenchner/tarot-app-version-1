class AppConfig {
    public readonly port: number = parseInt(process.env.PORT || "4000");
    public readonly openAiApiKey: string = process.env.OPENAI_API_KEY!;
    public readonly dbHost: string = process.env.DB_HOST!;
    public readonly dbUser: string = process.env.DB_USER!;
    public readonly dbPassword: string = process.env.DB_PASSWORD!;
    public readonly dbName: string = process.env.DB_NAME!;
    public readonly jwtSecret: string = process.env.JWT_SECRET!;
}

export const appConfig = new AppConfig();
