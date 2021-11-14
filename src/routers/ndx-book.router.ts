import * as express from 'express';
import { Response, Request, NextFunction } from 'express';
import { AccessLevelGuardMiddleware } from '../middlewares';

import { BaseRouter } from '../models/bases';
import { InternalServerError, NdxBookData, NotFoundException } from '../models/dtos';
import { ACCESS_LEVEL_TYPE } from '../models/enums';
import { NdxBookParseService } from "../services";

enum CONTEXT {
    BASE = '/',
    NEXT = '/next'
}

export class NdxBookRouter implements BaseRouter {
    
    private ndxBookRouter;
    private ndxBookData: NdxBookData;

    constructor(
        private accessLevelGuardMiddleware: AccessLevelGuardMiddleware, 
        private ndxBookParseService: NdxBookParseService,
    ) {
        const ndxBookRouter = express.Router();
        
        ndxBookRouter.get(
            CONTEXT.BASE, 
            // this.accessLevelGuardMiddleware.getMiddleware(ACCESS_LEVEL_TYPE.MEMBER),
            this.getNdxBook()
        );
        ndxBookRouter.post(
            CONTEXT.NEXT,
            this.nextNdxBook()
        )

        this.ndxBookRouter = ndxBookRouter;
    }

    private getNdxBook() {
        return (_: Request, res: Response, next: NextFunction) => {
            if (this.ndxBookData) {
                res.send(this.ndxBookData);
                return;
            }
            next(new NotFoundException('Temporarilly not found. Try again later'));
        }
    }

    private nextNdxBook() {
        return (req: Request, res: Response, next: NextFunction) => {
            const { data: rawData } = req.body;

            try {
                this.ndxBookData = this.ndxBookParseService.parse(rawData);

                console.log(`[Recieved][${new Date().toISOString()}]`);
                res.send({ status: true });
            } catch(error) {
                next(new InternalServerError(error));
            }
        }
    }
    
    getRouter() {
        return this.ndxBookRouter;
    }
}