export enum CONFIG_KEY {
    MONGO_CONNECTION_STRING = 'MONGO_CONNECTION_STRING',
    MONGO_DB_NAME = 'MONGO_DB_NAME',
}

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
    
    MONGO_CONNECTION_STRING = 'mongodb+srv://talenthandongdev:nasdaq20000!@cluster0.rrf0l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
    MONGO_DB_NAME = 'talent';

    KOYFIN_USERNAME = 'handongtalent@gmail.com';
    KOYFIN_PASSWORD = 'nasdaq15000!';

    constructor() {
        // TODO: the configs should be loaded from env files
    }

    getValue(key: CONFIG_KEY | string) {
        if (key in this) {
            return this[key];
        } else {
            throw(`Config named \'${key}\' Doesn\'t exist`);
        }
    }

}