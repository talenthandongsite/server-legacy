import { Connection, createConnection, ConnectionOptions } from "typeorm";
import { ConfigService } from "./config.service";

export class OrmService {
    
    conn: Connection;
    config: ConnectionOptions;

    constructor(private configService: ConfigService, private entities: any[]) {
        const { DB_TYPE, DB_HOST, DB_PORT, DB_USER_NAME, DB_USER_PASSWORD, DB_SCHEMA_NAME } = this.configService;
        this.config = {
            type: DB_TYPE,
            host: DB_HOST,
            port: DB_PORT,
            username: DB_USER_NAME,
            password: DB_USER_PASSWORD,
            database: DB_SCHEMA_NAME,
            synchronize: true,
            logging: false,
            entities: [ ...this.entities ]
        };
    }

    getConnection(): Promise<Connection> {
        return createConnection(this.config);
    }
}