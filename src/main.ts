import 'reflect-metadata';

import * as express from "express";
import * as dotenv from 'dotenv';
import * as cors from "cors";
import * as morgan from "morgan";
import * as schedule from 'node-schedule';
import { json } from 'express';

import { Repository } from 'typeorm';

import { MemberRouter, NdxBookRouter, TicketRouter, UtilRouter } from './routers';
import { ConfigService, OrmService, AuthService, ScrapService, HisnetScrapService, NdxBookParseService } from './services';
import { globalErrorHandler } from './error-handlers';
import { AccessLevelGuardMiddleware, endpointAccessLogMiddleware } from "./middlewares";

import { Member, MemberHistory, Ticket } from './models/entities';
import { MainOptions } from './models/interfaces';

//Use .env Config File.
dotenv.config();

export function main(options: MainOptions) {

	// TODO: pass env to config service
	const configService: ConfigService = new ConfigService();

	const ormService: OrmService = new OrmService(configService, [ Member, Ticket, MemberHistory ]);
	const authService: AuthService = new AuthService(configService);
	const accessLevelGuardMiddleware: AccessLevelGuardMiddleware = new AccessLevelGuardMiddleware(configService);

	/* Regular Scrapping from Koyfin */
	const ndxBookParseService: NdxBookParseService = new NdxBookParseService();
	const hisnetScrapService: HisnetScrapService = new HisnetScrapService();

	return ormService.getConnection().then(connection => {
		const memberRepository: Repository<Member> = connection.getRepository(Member);
		const ticketRepository: Repository<Ticket> = connection.getRepository(Ticket);
		const memberHistoryRepository: Repository<MemberHistory> = connection.getRepository(MemberHistory);

		const memberRouter: MemberRouter = new MemberRouter(accessLevelGuardMiddleware, authService, memberRepository, memberHistoryRepository);
		const ticketRouter: TicketRouter = new TicketRouter(ticketRepository);
		const ndxBookRouter: NdxBookRouter = new NdxBookRouter(accessLevelGuardMiddleware, ndxBookParseService);
		const utilRouter: UtilRouter = new UtilRouter(hisnetScrapService);

		const app = express(); 
		const timeout = require("connect-timeout");
		const unless = require("express-unless");
		const to = timeout(300000);
		to.unless = unless;
		
		app.use(to.unless({ path: [{ url: "/url_v2" }] })); // 10초안에 응답 없으면 response 종료
		app.use(cors());
		app.use(json());
		app.use(morgan(options.env));
		app.use(endpointAccessLogMiddleware());

		app.get('/', (req, res) => {
			res.status(200).send("OK");
		});

		app.use('/member', memberRouter.getRouter());
		app.use('/ticket', ticketRouter.getRouter());
		app.use('/ndxBook', ndxBookRouter.getRouter());
		app.use('/util', utilRouter.getRouter());

		app.use(globalErrorHandler());

		
		process.on("uncaughtException", err => {
			//예상치 못한 예외 처리
			console.log("uncaughtException occurred! : " + err);
		});

		return new Promise((resolve, reject) => {
			let server = app.listen(options.port, () => {
				console.log(`Server is listening on port ${ options.port }`)
				resolve(server);
			}).on("error", (err: Error) => {
				reject(err);
			});
		});
	});
}

if (require.main === module) {
	const PORT = parseInt(process.env.PORT || "3000", 10);
	const NODE_ENV = process.env.NODE_ENV !== "production" ? "dev" : "production";
	const ENABLE_CORS = NODE_ENV !== "production";

	main({
		enableCors: ENABLE_CORS,
		env: NODE_ENV,
		port: PORT,
		verbose: true
	});
}
