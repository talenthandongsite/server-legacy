import * as express from 'express';
import { Response, Request, NextFunction } from 'express';
import { AccessLevelGuardMiddleware } from '../middlewares';

import { BaseRouter } from '../models/bases';
import { InternalServerError, NdxBookData, NotFoundException } from '../models/dtos';
import { ACCESS_LEVEL_TYPE } from '../models/enums';
import { DataCacheService } from "../services";

enum CONTEXT {
    BASE = '/',
    NEXT = '/next'
}

export class NdxBookRouter implements BaseRouter {
    
    private ndxBookRouter;
    private ndxBookData: NdxBookData;

    constructor(
        private accessLevelGuardMiddleware: AccessLevelGuardMiddleware, 
        private dataCacheService: DataCacheService,
    ) {
        const ndxBookRouter = express.Router();
        
        ndxBookRouter.get(
            CONTEXT.BASE, 
            // this.accessLevelGuardMiddleware.getMiddleware(ACCESS_LEVEL_TYPE.MEMBER),
            this.getNdxBook()
        );

        this.ndxBookRouter = ndxBookRouter;
    }

    private getNdxBook() {
        return (_: Request, res: Response, next: NextFunction) => {
            if (this.ndxBookData) {
                res.send(this.dataCacheService.getNdxBookData());
                return;
            }
            next(new NotFoundException('Temporarilly not found. Try again later'));
        }
    }
    
    getRouter() {
        return this.ndxBookRouter;
    }
}