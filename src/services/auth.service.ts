import { ACCESS_LEVEL_TYPE } from "../models/enums";
import * as jwt from 'jsonwebtoken';
import { TokenPayload } from "../models/interfaces";
import { ConfigService } from "./config.service";

export class AuthService {

    constructor(private configService: ConfigService) {

    }

    issue(id: number, nickname, accessLevel: ACCESS_LEVEL_TYPE) {
        const expirationTime = new Date();
        expirationTime.setTime(expirationTime.getTime() + this.configService.JWT_EXPIRATION_MILISECOND);
        const expiration = expirationTime.getTime();
        const issuer = this.configService.JWT_ISSUER;

        const payload: TokenPayload = { expiration, id, issuer, nickname, accessLevel};
        return jwt.sign(payload, this.configService.JWT_KEY);
    }

    verify(token: string) {
        return <TokenPayload>jwt.verify(token, this.configService.JWT_KEY);
    }
}