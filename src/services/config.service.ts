export class ConfigService {
    
    DB_TYPE: 'mysql' = 'mysql';
    DB_HOST: string = 'talenthandong.site';
    DB_PORT: number = 3306;
    DB_USER_NAME: string = 'root';
    DB_USER_PASSWORD: string = 'nasdaq15000!';
    DB_SCHEMA_NAME: string = 'talent';
    TABLE_USER: string = 'user';

    JWT_KEY: string = "jwt secret";
    JWT_ISSUER: string = "https://talenthandong.site";
    JWT_EXPIRATION_MILISECOND: number = 1000 * 60 * 60 * 24;
    
    constructor() {
        // TODO: the configs should be loaded from env files
    }

}