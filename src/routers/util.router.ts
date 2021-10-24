import { BaseRouter } from "../models/bases";
import * as request from "request-promise";

import * as express from 'express';
import { Router } from 'express';
import { HisnetScrapService } from "../services";
import { bodyValidation } from "../middlewares";
import { VerifyHisnetInput } from "../models/dtos";
import { HTTP_STATUS_CODE } from '../models/enums';

export class UtilRouter implements BaseRouter {
    private router: Router;
    
    constructor(private hisnetScrapService: HisnetScrapService) {
        const router = express.Router();

        router.get('/siteStatus', this.getSiteStatus());
        router.post('/verifyHisnet', bodyValidation(VerifyHisnetInput), this.verifyHistnet());

        this.router = router;
    }

    private verifyHistnet() {
        return (req, res) => {
            const { id, pw } = req.body;
            this.hisnetScrapService.runHisnetScrap(id, pw).then(result => {
                res.send(result);
            });
        }
    }

    private getSiteStatus() {
        return (_, res) => {
			const header = {
				Host: "hisnet.handong.edu",
				Origin: "https://hisnet.handong.edu",
				"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36"
            };
            
			const pendingHisnetStatus = request({
                method: "GET",
                uri: "https://hisnet.handong.edu",
                headers: header,
                resolveWithFullResponse: true
            });
			const pendingSmartStatus = request({
                method: "GET",
                uri: "http://smart.handong.edu",
                headers: header,
                resolveWithFullResponse: true
            });

            Promise.all([ pendingHisnetStatus, pendingSmartStatus ]).then(([ hisnetStatusResult, smartStatusResult ]) => {
                const { statusCode: hisnet } = hisnetStatusResult;
                const { statusCode: smart } = smartStatusResult;

                res.status(HTTP_STATUS_CODE.OK).send({ hisnet, smart });
            });
        }
    }

    getRouter() {
        return this.router;
    }
}