import { ACCESS_LEVEL_TYPE } from "../enums";

/**
 * @description Request Subject is data set created by guard middleware. It specifies the subject who request. When http request is inbound to guard middleware, guard should unmarshall token the request has, and should add request subject to express request object. Key should be 'subject'.
 */
export class RequestSubject {
    id: number;
    nickname: string;
    accessLevel: ACCESS_LEVEL_TYPE;
}