import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { BaseMiddleware, IBaseMiddleware } from '../models/bases';
import { BadRequestException, ForbiddenException, UnauthorizedException } from '../models/dtos';
import { ACCESS_LEVEL_TYPE } from '../models/enums';
import { TokenPayload, RequestSubject } from '../models/interfaces';
import { ConfigService } from '../services';

export class AccessLevelGuardMiddleware implements IBaseMiddleware {

    constructor(private configService: ConfigService) {

    }

    getMiddleware(leastMemberStatusLevel: ACCESS_LEVEL_TYPE): BaseMiddleware  {
        return (req: Request, res: Response, next: NextFunction) => {
            if (!req.headers.authorization) {
                next(new ForbiddenException('MISSING_TOKEN'));
                return;
            }
    
            const token = req.headers.authorization.split(' ')[1];
            if (!token || token === 'null') {
                next(new UnauthorizedException());
                return;
            }
        
            const { issuer, expiration, id, nickname, accessLevel } = <TokenPayload>jwt.verify(token, this.configService.JWT_KEY);
            if (!issuer || !expiration || !id || !accessLevel) {
                next(new BadRequestException('INVALID_TOKEN'));
                return;
            }
    
            const accessLevelCount = {
                INACTIVE: 0,
                APPLICANT: 1,
                MEMBER: 2,
                ADMIN: 3,
                SYS_ADMIN: 4,
                MASTER: 5
            }
            if ( accessLevelCount[accessLevel] < accessLevelCount[leastMemberStatusLevel]) {
                next(new ForbiddenException('NOT_ALLOWED'));
                return;
            }
        
            const currentTime = new Date();
            if(this.configService.JWT_ISSUER !== issuer) {
                next(new UnauthorizedException('INVALID_TOKEN'));
                return;
            }
        
            if (currentTime.valueOf() > expiration) {
                next(new UnauthorizedException('EXPIRED'));
                return;
            }
    
            req['subject'] = <RequestSubject>{ id, nickname, accessLevel };
                
            next();
        }
    }
    
}
