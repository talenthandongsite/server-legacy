import { NextFunction, Request, Response } from "express";

export interface IBaseMiddleware {
    getMiddleware: (...params: any[]) => BaseMiddleware;
}
export type BaseMiddleware = (req: Request, res: Response, next: NextFunction) => void;