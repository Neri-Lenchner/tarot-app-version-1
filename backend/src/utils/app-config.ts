class AppConfig {
    public readonly port: number = parseInt(process.env.PORT || "4000");
    public readonly openAiApiKey: string = process.env.OPENAI_API_KEY!;
}

export const appConfig = new AppConfig();
