import * as iconv from "iconv-lite";
import { BadRequestException } from "../models/dtos";
import * as request from "request-promise";


export class HisnetScrapService {

	constructor() {
		
	}
	
	runHisnetScrap(username: string, password: string): Promise<{ id: string, name: string, status: string }> {
  		return this.doLogin(username, password).then(result => {
		
			// binary to STR
			const strContents = Buffer.from(result.body, "binary");
			// const iconv = new this.Iconv("euc-kr", "UTF8//IGNORE");
			const body = iconv.decode(strContents, 'euc-kr');
			// incorrect ID/PW 
			const loginCode: number = body.indexOf('top.location.replace("/login/logout.php")');

			if (loginCode != -1) {
				throw new BadRequestException(loginCode, 'Invalid username or password')
			}

			// 필요한 부분 발췌
			const trimmedBody = body.split('기본정보')[6]
				.split('<table border="0" cellSpacing="1"')[1]
				.replace(/&nbsp;/g, "")
				.replace(/<!--[^>](.*?)-->/g, "")
				.replace(/<br>/g, "");

			const studentInfoName = trimmedBody.split('<tr height="28" bgcolor="#ffffff">')[1].split(/<td[^>]*>/g)[2].split("<input ")[0];
			const studentInfoId = trimmedBody.split('<tr height="28" bgcolor="#ffffff">')[2].split(/<td[^>]*>/g)[2].split("</td>")[0].split('- ')[1];
			const studentInfoStatus = trimmedBody.split('<tr height="28" bgcolor="#ffffff">')[2].split(/<td[^>]*>/g)[4].split("</td>")[0];

			return {
				id: studentInfoId,
				name: studentInfoName,
				status: studentInfoStatus
			};			
		});
	}

	private doLogin(username: string, password: string): Promise<any> {
		const cookieJar = request.jar();

		const loginTasks: Array<any> = [
			{
				uri: "https://hisnet.handong.edu/login/_login.php",
				referer: "https://hisnet.handong.edu/login/login.php",
				method: "POST",
				body: {
					Language: "Korean",
					id: username,
					password: password,
					part: "",
					f_name: "",
					agree: ""
				}
			},
			{
				uri:"https://hisnet.handong.edu/login/goMenu_eval.php?cleaninet=1&language=Korean",
				referer: "https://hisnet.handong.edu/login/_login.php",
				method: "GET"
			},
			{
				uri: "http://hisnet.handong.edu/main.php",
				referer: "",
				method: "POST",
				body: { memo: "" }
			},
			{
				uri: "http://hisnet.handong.edu/for_student/main.php",
				referer: "http://hisnet.handong.edu/main.php",
				method: "GET"
			},
			{
				uri: "https://hisnet.handong.edu/haksa/hakjuk/HHAK110M.php",
				referer: "https://hisnet.handong.edu/for_student/main.php",
				method: "GET",
				body: {},
			}
		];


		return this.httpRequest(loginTasks[0], cookieJar).then(_ => {
			return this.httpRequest(loginTasks[1], cookieJar);
		}).then(_ => {
			return this.httpRequest(loginTasks[2], cookieJar);
		}).then(_ => {
			return this.httpRequest(loginTasks[3], cookieJar);
		}).then(_ => {
			return this.httpRequest(loginTasks[4], cookieJar);
		}).then((result) => {
			return result;
		}).catch(({ message }) => {
			return message;
		});
	}

	private httpRequest(info: any, cookieJar: any): Promise<any> {
		return request({
			jar: cookieJar,
			method: info.method,
			uri: `${info.uri}`,
			formData: info.body,
			encoding: null,
			headers: {
				Accept:
				"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
				"Accept-Encoding": "gzip, deflate",
				"Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
				"Cache-Control": "no-cache",
				"Content-Type": "application/x-www-form-urlencoded",
				Connection: "Keep-Alive",
				Host: "hisnet.handong.edu",
				Referer: info.referer,
				Origin: "https://hisnet.handong.edu",
				"Upgrade-Insecure-Requests": 1,
				"User-Agent":
				"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36"
			},
			resolveWithFullResponse: true
		});
	}
}