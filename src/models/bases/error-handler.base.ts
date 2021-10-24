import { NextFunction, Request, Response } from "express";

export type BaseErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => void;