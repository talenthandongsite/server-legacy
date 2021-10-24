import { KoyfinScrapData } from "../models/interfaces";

export class NdxBookParseService {

    constructor() {}

    /* 
    현재 나스닥100 종목의 총 시가총액 = SUM(현재 나스닥100 구성종목의 시가총액)
    현재 나스닥100 지수 = kofin에서 scraping으로 가져온 나스닥100 지수 값
    발행주식수 = (종목의 현재시가총액/현재가)
    나스닥100종목의 TP에서의 시가총액 = SUM(각 종목의 TP * 발행주식수)
    "나스닥100 지수의 TP" = (나스닥100종목의 TP에서의 시가총액 * 현재 나스닥100 지수) / 현재 나스닥100 종목의 총 시가총액
    */
    parse(rawString: string) {

        let scrapDataTypeArr = [];
    
        /* Data Arrays for API */
        let outputObj:any = {};
        let outputArr=[];
    
        let splittedStr = rawString.split("\r\n");
        let totalMarketCap = 0;
    
    
        /* Chart Data */
    
        //Base Data
        let totalLastPrice = 0;
    
        // CHART-1
        let totalStrongSell = 0;
        let totalSell = 0;
        let totalHold = 0;
        let totalBuy = 0;
        let totalStrongBuy = 0;
    
        // CHART-2
        let totaly1PT:number = 0;
        let totalm6PT:number = 0;
        let totalm3PT:number = 0;
        let totalm1PT:number = 0;
        let totalw1PT:number = 0;
        let totalcurPT:number = 0;
    
        //Chart-4
        let totalNTM = 0;
        let totalFY1E = 0;
        let totalFY2E = 0;
        let totalFY3E = 0;
    
        /* GET Nasdaq INDEX */
        let splitted = splittedStr[splittedStr.length-3].split(',');
        let ndx100Idx = splitted[2];
    
    
        let tpTotalMarketCap = 0;
    
        /* Data Parsing from CSV File */
        splittedStr.forEach((row: any, idx: number) => {
            let splittedRow = row.split(",");
            if (idx !== 0 && idx <= splittedStr.length - 4) {
                
                let scrapData: KoyfinScrapData = {
                    ticker: splittedRow[0],
                    name: splittedRow[1],
                    lastPrice: splittedRow[2],
                    marketCap: splittedRow[3],
                    peNTM: splittedRow[4],
                    peLTM: splittedRow[5],
                    evSalesNTM: splittedRow[6],
                    evSalesLTM: splittedRow[7],
                    divYield: splittedRow[8],
                    priceTargetNumbers: splittedRow[9],
                    priceTarget: splittedRow[10] === '-' ? 0 : splittedRow[10],
                    w1PriceTarget: splittedRow[11]  === '-' ? 0 : splittedRow[11],
                    m1PriceTarget: splittedRow[12]  === '-' ? 0 : splittedRow[12],
                    m3PriceTarget: splittedRow[13]  === '-' ? 0 : splittedRow[13],
                    m6PriceTarget: splittedRow[14]  === '-' ? 0 : splittedRow[14],
                    y1PriceTarget: splittedRow[15]  === '-' ? 0 : splittedRow[15],
                    strongBuy: splittedRow[16],
                    buy: splittedRow[17],
                    hold: splittedRow[18],
                    sell: splittedRow[19],
                    strongSell: splittedRow[20],
                    epsNTM: splittedRow[21],
                    epsLTM: splittedRow[22],
                    epsFY1E: splittedRow[23],
                    epsFY2E: splittedRow[24],
                    nextEarnings: splittedRow[25],
                    epsFY3E: splittedRow[26],
                    w52High: splittedRow[27],
                    w52Low: splittedRow[28],
                };
    
    
                /* Accumulate Total MarketCap */
                let marketCap = 0;
                if (typeof(splittedRow[3])==='string'){
                    marketCap = parseFloat(splittedRow[3].slice(1, splittedRow[3].length-1))
                    totalMarketCap+=marketCap;
                }
                /* Sum of total LastPrice */
                let lastPrice = (splittedRow[2] === '-' ? 0 : parseFloat(splittedRow[2]))
                totalLastPrice += lastPrice;
    
                /* issuedShares, tpTotalMarketCap */
                let issuedShares = (marketCap*Math.pow(10, 9))/lastPrice;
                tpTotalMarketCap+=(parseFloat(splittedRow[10] === '-' ? 0 : splittedRow[10]) * issuedShares)
                
                /* CHART-1 */
                totalStrongSell+=parseFloat(splittedRow[20]);
                totalSell+=parseFloat(splittedRow[19]);
                totalHold+=parseFloat(splittedRow[18]);
                totalBuy+=parseFloat(splittedRow[17]);
                totalStrongBuy+=parseFloat(splittedRow[16]);
    
    
                /* CHART-4 */
                totalNTM+=(splittedRow[21]==='-' ? 0 : parseFloat(splittedRow[21]));
                totalFY1E+=(splittedRow[23]==='-' ? 0 : parseFloat(splittedRow[23]));
                totalFY2E+=(splittedRow[24]==='-' ? 0 : parseFloat(splittedRow[24]));
                totalFY3E+=(splittedRow[26]==='-' ? 0 : parseFloat(splittedRow[26]));
    
    
                scrapDataTypeArr.push(scrapData);
            }
        });
    
        
    
    
        /* Parsing Data into Objects with Iterating */
        scrapDataTypeArr.forEach((row: KoyfinScrapData, idx) => {
        
            let basicInfo = {
                ticker: row.ticker,
                name: row.name,
                lastPrice: row.lastPrice,
                marketCap: row.marketCap,
                share: (parseFloat(row.marketCap.slice(1, row.marketCap.length-1))/100).toFixed(2).toString(),
                peNTM: row.peNTM,
                peLTM: row.peLTM,
                evSalesNTM: row.evSalesNTM,
                evSalesLTM: row.evSalesLTM,
                divYield: row.divYield,
            }
    
            let ibTargetInfo = {
                numbers: row.priceTargetNumbers,
                strongBuy: row.strongBuy,
                buy: row.buy,
                hold: row.hold,
                sell: row.sell,
                strongSell: row.strongSell,
                priceTarget: row.priceTarget,
                potential: ((parseFloat(row.priceTarget)-parseFloat(row.lastPrice))/parseFloat(row.lastPrice)).toFixed(4).toString(),
                curShare: ((parseFloat(row.priceTarget)-parseFloat(row.lastPrice))/(parseFloat(row.lastPrice) * parseFloat(basicInfo.share))).toFixed(2).toString(),
                w1Wave: (parseFloat(row.priceTarget)-parseFloat(row.w1PriceTarget)).toFixed(2).toString(),
                w1Before: row.w1PriceTarget,
                w1Share: ((parseFloat(row.w1PriceTarget)-parseFloat(row.lastPrice))/(parseFloat(row.lastPrice) * parseFloat(basicInfo.share))).toFixed(2).toString(),
                m1Before: row.m1PriceTarget,
                m1Share: ((parseFloat(row.m1PriceTarget)-parseFloat(row.lastPrice))/(parseFloat(row.lastPrice) * parseFloat(basicInfo.share))).toFixed(2).toString(),
                m3Before: row.m3PriceTarget,
                m3Share: ((parseFloat(row.m3PriceTarget)-parseFloat(row.lastPrice))/(parseFloat(row.lastPrice) * parseFloat(basicInfo.share))).toFixed(2).toString(),
                m6Before: row.m6PriceTarget,
                m6Share: ((parseFloat(row.m6PriceTarget)-parseFloat(row.lastPrice))/(parseFloat(row.lastPrice) * parseFloat(basicInfo.share))).toFixed(2).toString(),
                y1Before: row.y1PriceTarget,
                y1Share: ((parseFloat(row.y1PriceTarget)-parseFloat(row.lastPrice))/(parseFloat(row.lastPrice) * parseFloat(basicInfo.share))).toFixed(2).toString(),
            };
        
            let EPSInfo = {
            nextEarnings: row.nextEarnings,
            epsNTM: row.epsNTM,
            epsLTM: row.epsLTM,
            epsFY1E: row.epsFY1E,
            epsFY2E: row.epsFY2E,
            epsFY3E: row.epsFY3E
            };
    
            // CHART-2
            totaly1PT+=parseFloat(ibTargetInfo.y1Share);
            totalm6PT+=parseFloat(ibTargetInfo.m6Share);
            totalm3PT+=parseFloat(ibTargetInfo.m3Share);
            totalm1PT+=parseFloat(ibTargetInfo.m1Share);
            totalw1PT+=parseFloat(ibTargetInfo.w1Share);
            totalcurPT+=parseFloat(ibTargetInfo.curShare);
    
    
            outputArr.push({
            basicInfo,
            ibTargetInfo,
            EPSInfo
            })
        });
    
        outputObj.result = outputArr;
    
    
        outputObj.stat = {
            ratingChart: {
                totalStrongSell,
                totalSell,
                totalHold,
                totalBuy,
                totalStrongBuy
            },
            epsChangeChart: {
                totalNTM,
                totalFY1E,
                totalFY2E,
                totalFY3E
            }
        }
    
        outputObj.ndx100Data = {
            ndx100Idx: parseFloat(ndx100Idx).toFixed(0),
            ndx100TargetPrice: ((tpTotalMarketCap * parseFloat(ndx100Idx))/(totalMarketCap*Math.pow(10, 9))).toFixed(0)
        }
    
        return outputObj
    };
}
