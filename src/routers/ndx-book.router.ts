import * as express from 'express';
import { Response, Request, NextFunction } from 'express';

import { BaseRouter } from '../models/bases';
import { NotFoundException } from '../models/dtos';
import { DataCacheService } from "../services";

enum CONTEXT {
    BASE = '/',
}

export class NdxBookRouter implements BaseRouter {
    
    private ndxBookRouter;

    constructor(
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
            const ndxBookData = this.dataCacheService.getNdxBookData();
            if (!ndxBookData) {
                next(new NotFoundException('Temporarilly not found. Try again later'));
                return
            }
            res.send(ndxBookData);
        }
    }
    
    getRouter() {
        return this.ndxBookRouter;
    }
}