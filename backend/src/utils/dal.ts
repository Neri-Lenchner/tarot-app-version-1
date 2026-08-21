import mysql2, { PoolOptions, QueryResult } from "mysql2";
import { appConfig } from "./app-config";

class Dal {
    private options: PoolOptions = {
        host: appConfig.dbHost,
        user: appConfig.dbUser,
        password: appConfig.dbPassword,
        database: appConfig.dbName,
    };

    private connection = mysql2.createPool(this.options);
    private poolPromise = this.connection.promise();

    public async execute(sql: string, params?: any[]): Promise<QueryResult> {
        const [result] = await this.poolPromise.query(sql, params);
        return result;
    }
}

export const dal = new Dal();
