import { BaseMiddleware } from "../models/bases";

export function endpointAccessLogMiddleware(): BaseMiddleware {
    return (req, res, next) => {
        console.log(req.method + " " + req.url);
        next();
    }
}