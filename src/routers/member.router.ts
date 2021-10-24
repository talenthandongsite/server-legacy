import { Router, Request, Response, NextFunction } from "express";
import { BaseRouter } from "../models/bases";
import { Member, MemberHistory } from '../models/entities';
import { AccessLevelGuardMiddleware, bodyValidation } from '../middlewares';
import { Repository } from 'typeorm';
import { ACCESS_LEVEL_TYPE, STATUS_TYPE } from "../models/enums";
import { AuthService } from "../services";
import { ForbiddenException, LoginInput, RegisterKakaoTokenInput, UnauthorizedException, NotFoundException, UpdateMemberInput } from "../models/dtos";
import { RequestSubject } from '../models/interfaces';


export enum MEMBER_ROUTER_CONTEXT {
    LOGIN = '/login',
    REGISTER = '/register',
    VERIFY = '/verify',
    LIST = '/',
    SELECT = '/:id',
    UPDATE_BY_ID = '/:id',
}

export class MemberRouter implements BaseRouter {
    router: Router = Router();

    constructor(
        private accessLevelGuardMiddleware: AccessLevelGuardMiddleware, 
        private authService: AuthService,
        private memberRepository: Repository<Member>, 
        private memberHistoryRepository: Repository<MemberHistory>, 
    ) {
        this.router.post(
            MEMBER_ROUTER_CONTEXT.LOGIN, 
            bodyValidation(LoginInput),
            this.login()
        );
        this.router.post(
            MEMBER_ROUTER_CONTEXT.REGISTER,
            bodyValidation(RegisterKakaoTokenInput),
            this.registerKakaoToken()
        );
        this.router.get(
            MEMBER_ROUTER_CONTEXT.VERIFY,
            this.accessLevelGuardMiddleware.getMiddleware(ACCESS_LEVEL_TYPE.APPLICANT), 
            this.verify()
        );
        this.router.get(
            MEMBER_ROUTER_CONTEXT.LIST, 
            this.accessLevelGuardMiddleware.getMiddleware(ACCESS_LEVEL_TYPE.ADMIN), 
            this.list()
        );
        this.router.get(
            MEMBER_ROUTER_CONTEXT.SELECT,
            this.accessLevelGuardMiddleware.getMiddleware(ACCESS_LEVEL_TYPE.ADMIN),
            this.select()
        );
        this.router.put(
            MEMBER_ROUTER_CONTEXT.UPDATE_BY_ID,
            this.accessLevelGuardMiddleware.getMiddleware(ACCESS_LEVEL_TYPE.ADMIN), 
            bodyValidation(UpdateMemberInput),
            this.updateById()
        );
    }

    private login() {
        return ({ body }: Request, res: Response, next: NextFunction) => {
            const { uid } = body;

            this.memberRepository.findOne({ where: { kakaoAuthAccessToken: uid } }).then(result => {
                if (!result) {
                    next(new UnauthorizedException('You are not member or not registered yet'));
                    return;
                }

                const { id, nickname, accessLevel, status } = result;

                if (status === STATUS_TYPE.INACTIVE) {
                    next(new ForbiddenException('You are banned by administrator'));
                    return;
                }

                const token = 'Bearer ' + this.authService.issue(id, nickname, <ACCESS_LEVEL_TYPE>accessLevel);

                res.send({
                    status: true,
                    data: { nickname, accessLevel, token }
                });

                this.memberRepository.update({ id }, { lastAccessDatetime: new Date() });
            });
        }
    }

    private register() {

    }

    private registerKakaoToken() {
        return ({ body }: Request, res: Response, next: NextFunction) => {
            const { uid, studentId } = body;

            this.memberRepository.findOne({ where: { studentId } }).then(result => {
                
                if (!result) {
                    next(new NotFoundException('You are not registered'));
                    return;
                }

                const accessLevel = ACCESS_LEVEL_TYPE.MEMBER;
                const { id, nickname, status } = result;

                if (status === STATUS_TYPE.INACTIVE) {
                    next(new ForbiddenException('You are banned by administrator'));
                    return;
                }
                
                return this.memberRepository.update({ studentId, accessLevel }, { kakaoAuthAccessToken: uid }).then(_ => {
                    const token = 'Bearer ' + this.authService.issue(id, nickname, <ACCESS_LEVEL_TYPE>accessLevel);
                    res.send({
                        status: true,
                        data: { nickname, accessLevel, token }
                    });
                    this.memberRepository.update({ id }, { lastAccessDatetime: new Date() });
                });
            });
        }
    }

    private verify() {
        return (req: Request, res: Response) => {
            const subject: RequestSubject = <RequestSubject>req['subject'];
            const { nickname, accessLevel } = subject;

            res.send({ 
                status: true, 
                data: { nickname, accessLevel } 
            });
        }
    }

    private list() {
        return (_, res) => {
            this.memberRepository.find({ select: [ 'id', 'studentId', 'name', 'nickname', 'status', 'accessLevel', 'createDatetime', 'lastAccessDatetime', 'registerState', 'updateDatetime' ]  }).then(result => {

                res.send({ status: true, data: result });
            });
        }
    }

    private select() {
        return (req: Request, res: Response, next: NextFunction) => {
            const { id } = req.params;
            this.memberRepository.findOneOrFail(id, { relations: [ 'ticket', 'issuedTickets', 'history' ] }).then(result => {
                res.send({
                    status: true,
                    data: result
                });
            }).catch(error => {
                next(new NotFoundException(JSON.stringify(error)));
            });
        }
    }

    private updateById() {
        return (req: Request, res: Response, next: NextFunction) => {
            const data = <UpdateMemberInput>req.body;
            const { id: _id } = req.params;
            const _subject: RequestSubject = <RequestSubject>req['subject'];
            const { id: subject } = _subject;
            const member = parseInt(_id);

            this.memberRepository.findOneOrFail(member, { relations: [ 'history' ] }).then(result => {

                const history = Object.keys(data).map(key => {
                    const field = key;
                    const originalValue = result[key] || null;
                    const nextValue = data[key];
                    return { field, originalValue, nextValue, member, subject };
                });

                this.memberRepository.update(member, data).then(_ => {
                    res.send({ status: true });
                    this.memberHistoryRepository.insert(history);
                }).catch(error => {
                    next(error);
                });
            }).catch(error => {
                next(new NotFoundException(JSON.stringify(error)));
            });
        }
    }

    getRouter(): Router {
        return this.router;
    }
}