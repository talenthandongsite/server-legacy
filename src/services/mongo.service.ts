
import { MongoClient, Db, Collection } from 'mongodb';
import { ConfigService, CONFIG_KEY } from './config.service';


export enum MONGO_COLLECTIONS {
    TOKEN = 'token',
    TOKEN_QUOTE = 'tokenquote'
}

export class MongoService {

    private client: Promise<MongoClient>;
    private collections: { [key: string]: Collection } = { };

    constructor(private configService: ConfigService) { }

    // in main function use this instead of constructor
    forRoot() {
        const client = new MongoClient(this.configService.getValue(CONFIG_KEY.MONGO_CONNECTION_STRING));
        this.client = client.connect().then(result => {
            const db: Db = client.db(this.configService.getValue(CONFIG_KEY.MONGO_DB_NAME));
            Object.keys(MONGO_COLLECTIONS).forEach(key => {
                this.collections[key] = db.collection(MONGO_COLLECTIONS[key]);
            });
            return result;
        });

        return this;
    }

    getCollection(key: MONGO_COLLECTIONS | string): Promise<Collection> {
        if (!(key in MONGO_COLLECTIONS)) {
            throw `Collection named ${key} doesn't exist`;
        }
        return this.client.then(_ => this.collections[key]);
    }
}