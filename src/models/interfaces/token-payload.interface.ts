import { ACCESS_LEVEL_TYPE } from "../enums";

export interface TokenPayload {
    id: number;
    issuer: string;
    expiration: number;
    nickname: string;
    accessLevel: ACCESS_LEVEL_TYPE;
}