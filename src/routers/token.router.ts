import { NextFunction, Request, Response, Router } from "express";
import { BaseRouter } from "../models/bases";
import { MongoService, MONGO_COLLECTIONS } from "../services";

export enum TOKEN_ROUTER_CONTEXT {
    BASE = '/',
    QUOTE = '/quote'
}

export class TokenRouter implements BaseRouter {
    router: Router;

    constructor(private mongoService: MongoService) {
        const tokenRouter = Router();

        tokenRouter.get(TOKEN_ROUTER_CONTEXT.BASE, this.getToken());
        tokenRouter.post(TOKEN_ROUTER_CONTEXT.BASE, this.createToken());
        tokenRouter.put(TOKEN_ROUTER_CONTEXT.BASE, this.updateToken());
        tokenRouter.delete(TOKEN_ROUTER_CONTEXT.BASE, this.deleteToken());

        tokenRouter.get(TOKEN_ROUTER_CONTEXT.QUOTE, this.getTokenQuote());
        tokenRouter.post(TOKEN_ROUTER_CONTEXT.QUOTE, this.createTokenQuote());
        tokenRouter.put(TOKEN_ROUTER_CONTEXT.QUOTE, this.updateTokenQuote());
        tokenRouter.delete(TOKEN_ROUTER_CONTEXT.QUOTE, this.deleteTokenQuote());

        this.router = tokenRouter;
    }

    private getToken() {
        const mongoService = this.mongoService;

        return (req: Request, res: Response, next: NextFunction) => {
            mongoService.getCollection(MONGO_COLLECTIONS.TOKEN).then(tokenCollection => {
                tokenCollection.find({}).toArray();
                
                res.send('hello');
            });
        }
    }

    private createToken() {
        return (req: Request, res: Response, next: NextFunction) => {
            
        }
    }

    private updateToken() {
        return (req: Request, res: Response, next: NextFunction) => {
            
            
        }
    }

    private deleteToken() {
        return (req: Request, res: Response, next: NextFunction) => {
            
            
        }
    }

    private getTokenQuote() {
        return (req: Request, res: Response, next: NextFunction) => {
            
            
        }
    }

    private createTokenQuote() {
        return (req: Request, res: Response, next: NextFunction) => {
            
            
        }
    }

    private updateTokenQuote() {
        return (req: Request, res: Response, next: NextFunction) => {
            
            
        }
    }

    private deleteTokenQuote() {
        return (req: Request, res: Response, next: NextFunction) => {
            
            
        }
    }

    getRouter(): Router {
        return this.router;
    }
}