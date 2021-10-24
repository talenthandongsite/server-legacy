import { BaseErrorHandler } from '../models/bases/error-handler.base';
import { BaseException } from '../models/bases/exception.base';
import { InternalServerError } from '../models/dtos';

export function globalErrorHandler(): BaseErrorHandler {
    return (error, req, res, next) => {

        if (error instanceof BaseException) {
            const { statusCode, payload } = error;
            res.status(statusCode);
            res.send(payload);
            return;
        }

        const errorObject = new InternalServerError(JSON.stringify(error));
        const { statusCode, payload } = errorObject;
        res.status(statusCode);
        res.send(payload);
    }    
}