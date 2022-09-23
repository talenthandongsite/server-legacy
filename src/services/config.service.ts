export enum CONFIG_KEY {
    NODE_ENV="NODE_ENV",
    PORT="PORT",
    KOYFIN_USERNAME="KOYFIN_USERNAME",
    KOYFIN_PASSWORD="KOYFIN_PASSWORD",
}

export class ConfigService {
    
    constructor(env: NodeJS.ProcessEnv) {
        Object.keys(CONFIG_KEY).forEach(key => {
            if (!env[key]) throw new Error("failed to get environment variable: " + key); 
            // console.log(key, env[key]);
            this[key] = env[key];
        });
    }

    getValue(key: CONFIG_KEY) {
        if (key in this) {
            return this[key];
        } else {
            throw(`Config named \'${key}\' Doesn\'t exist`);
        }
    }

}