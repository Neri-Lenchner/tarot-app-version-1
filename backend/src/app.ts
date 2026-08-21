import "dotenv/config";
import express, {Express} from "express";
import cors from "cors";
import { loggerMiddleware } from "./middleware/logger.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import { appConfig } from "./utils/app-config";
import { tarotController } from "./controllers/tarot.controller";
import { authController } from "./controllers/auth.controller";

class App {
    public async start(): Promise<void> {
        const server: Express = express();
        server.set("etag", false);
        server.use(cors());
        server.use(express.json());
        server.use(loggerMiddleware.consoleLog);
        server.use(authController.router);
        server.use(tarotController.router);
        server.use(errorMiddleware.serverError);
        server.use(errorMiddleware.catchAll);
        server.listen(appConfig.port, (): void =>
            console.log(`Server is running on port ${appConfig.port}`)
        );
    }
}

const app = new App();
app.start();
