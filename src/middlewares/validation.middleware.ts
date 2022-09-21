import { plainToClass, ClassConstructor } from "class-transformer";
import { validateOrReject, ValidatorOptions } from 'class-validator';
import { NextFunction, Request, Response } from "express";
import { BaseMiddleware } from "../models/bases";
import { BadRequestException } from "../models/dtos";


const VALIDATION_OPTION: ValidatorOptions = {
    skipMissingProperties: true,
    skipNullProperties: true,
    skipUndefinedProperties: true,
    whitelist: true
}

export function bodyValidation<T extends object>(type: ClassConstructor<T>): BaseMiddleware {
    return (req: Request, _: Response, next: NextFunction) => {
        const { body } = req;
        const instance = plainToClass(type, body, { excludeExtraneousValues: true, exposeUnsetFields: false });

        validateOrReject(instance, VALIDATION_OPTION).then(_ => {
            req.body = instance;
            next();
        }).catch(errors => {
            next(new BadRequestException(errors));
        });
    }
}
