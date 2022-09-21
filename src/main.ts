import 'reflect-metadata';

import * as express from "express";
import * as dotenv from 'dotenv';
import * as cors from "cors";
import { json } from 'express';

import { Schedule } from './schedule';
import { ConfigService, DataCacheService, NdxBookCrawlService } from './services';
import { globalErrorHandler } from './error-handlers';
import { endpointAccessLogMiddleware } from "./middlewares";
import { NdxBookRouter } from "./routers";

//Use .env Config File.
dotenv.config();

type MainConfig = {
    enableCors: boolean;
    env: string;
    port: number;
    verbose?: boolean;
}

async function main(options: MainConfig) {

	// TODO: pass env to config service
	const configService: ConfigService = new ConfigService();
	const dataCacheService: DataCacheService = new DataCacheService();

	const ndxBookCrawlService: NdxBookCrawlService = new NdxBookCrawlService(configService);

	const ndxBookRouter: NdxBookRouter = new NdxBookRouter(dataCacheService);

	const schedule: Schedule = new Schedule(dataCacheService, ndxBookCrawlService);
	schedule.start();

	const app = express(); 
	
	app.use(cors());
	app.use(json());
	app.use(endpointAccessLogMiddleware());

	app.get('/', (req, res) => {
		res.status(200).send("Legacy API Server");
	});

	app.use('/ndxBook', ndxBookRouter.getRouter());

	app.use(globalErrorHandler());
	
	process.on("uncaughtException", err => {
		//예상치 못한 예외 처리
		console.log("uncaughtException occurred! : " + err);
	});


	const data = await ndxBookCrawlService.crawlData()
	dataCacheService.setNdxBookData(data);

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

