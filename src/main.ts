import 'reflect-metadata';

import * as express from "express";
import * as dotenv from 'dotenv';
import * as cors from "cors";
import { json } from 'express';

import { ConfigService, DataCacheService, HisnetScrapService, NdxBookCrawlService } from './services';
import { globalErrorHandler } from './error-handlers';
import { AccessLevelGuardMiddleware, endpointAccessLogMiddleware } from "./middlewares";
import { NdxBookRouter, UtilRouter } from "./routers";
import { MainOptions } from './models/interfaces';

//Use .env Config File.
dotenv.config();

async function main(options: MainOptions) {

	// TODO: pass env to config service
	const configService: ConfigService = new ConfigService();
	const dataCahceService: DataCacheService = new DataCacheService();

	// const ormService: OrmService = new OrmService(configService, [ Member, Ticket, MemberHistory ]);
	// const authService: AuthService = new AuthService(configService);
	const accessLevelGuardMiddleware: AccessLevelGuardMiddleware = new AccessLevelGuardMiddleware(configService);

	/* Regular Scrapping from Koyfin */
	const hisnetScrapService: HisnetScrapService = new HisnetScrapService();
	const ndxBookCrawlService: NdxBookCrawlService = new NdxBookCrawlService(configService);

	const ndxBookRouter: NdxBookRouter = new NdxBookRouter(accessLevelGuardMiddleware, dataCahceService);
	const utilRouter: UtilRouter = new UtilRouter(hisnetScrapService);

	const app = express(); 
	const timeout = require("connect-timeout");
	const unless = require("express-unless");
	const to = timeout(300000);
	to.unless = unless;
	
	app.use(to.unless({ path: [{ url: "/url_v2" }] })); // 10초안에 응답 없으면 response 종료
	app.use(cors());
	app.use(json());
	app.use(endpointAccessLogMiddleware());

	app.get('/', (req, res) => {
		res.status(200).send("Legacy API Server");
	});

	// app.use('/member', memberRouter.getRouter());
	// app.use('/ticket', ticketRouter.getRouter());
	app.use('/ndxBook', ndxBookRouter.getRouter());
	app.use('/util', utilRouter.getRouter());

	console.log('Router loaded')

	// 
	app.use(globalErrorHandler());
	
	process.on("uncaughtException", err => {
		//예상치 못한 예외 처리
		console.log("uncaughtException occurred! : " + err);
	});

	app.listen(options.port, () => {
		console.log(`Server is listening on port ${ options.port }`)
	});
}

(async () => {
	const PORT = parseInt(process.env.PORT || "3000", 10);
	const NODE_ENV = process.env.NODE_ENV !== "production" ? "dev" : "production";
	const ENABLE_CORS = NODE_ENV !== "production";

	await main({
		enableCors: ENABLE_CORS,
		env: NODE_ENV,
		port: PORT,
		verbose: true
	});
})();

