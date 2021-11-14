import { 
    KoyfinScrapData, NdxBookData, NdxEPSPrediction, NdxPrediction, NdxStock, 
    NdxStockColumn, 
    NdxStockFormat, NdxStockRating, NDX_DATA_TYPE, RawNdxBook 
} from "../models/interfaces";

export class NdxBookParseService {

    constructor() {}

    /* 
    현재 나스닥100 종목의 총 시가총액 = SUM(현재 나스닥100 구성종목의 시가총액)
    현재 나스닥100 지수 = kofin에서 scraping으로 가져온 나스닥100 지수 값
    발행주식수 = (종목의 현재시가총액/현재가)
    나스닥100종목의 TP에서의 시가총액 = SUM(각 종목의 TP * 발행주식수)
    "나스닥100 지수의 TP" = (나스닥100종목의 TP에서의 시가총액 * 현재 나스닥100 지수) / 현재 나스닥100 종목의 총 시가총액
    */

    parse(rawString: string): NdxBookData {
        console.log(rawString);
        const stringParsed = this.parseRawString(rawString);
        return this.parseForFront(stringParsed);
    };

    private parseForFront(data: RawNdxBook): NdxBookData {
        const { result, ndx100Data: { ndx100Idx } } = data;

        const keyTypeMap: { [key: string]: NdxStockFormat } = {}; 
        NdxStockColumn.forEach(element => {
            const { value } = element;
            keyTypeMap[value] = element;
        });

        const stockInfo: NdxStock[] = result.map(({ EPSInfo, basicInfo, ibTargetInfo }) => {
            const merged = { ...EPSInfo, ...basicInfo, ...ibTargetInfo };
            const parsed: NdxStock = { 
                epsFY1E: null, epsFY2E: null, epsLTM: null, epsNTM: null, nextEarnings: null, 
                divYield: null, evSalesLTM: null, evSalesNTM: null, lastPrice: null, marketCap: null, 
                name: null, peLTM: null, peNTM: null, share: null, ticker: null, buy: null, 
                curShare: null, hold: null, m1Before: null, m1Variation: null, m3Before: null, 
                m3Variation: null, m6Before: null, m6Variation: null, numbers: null, potential: null, 
                priceTarget: null, sell: null, strongBuy: null, strongSell: null, w1Before: null, 
                w1Variation: null, w1Wave: null, y1Before: null, y1Variation: null, epsFY3E: null
            };

            Object.keys(merged).map(key => {
                const element: string = merged[key];

                if (!(key in keyTypeMap)) {
                    return;
                } 

                if (!element) {
                    return;
                }

                const { type } = keyTypeMap[key];

                if (type == NDX_DATA_TYPE.NUMBER) {
                    parsed[key] = parseFloat(element);
                } else if (type == NDX_DATA_TYPE.PERCENTAGE || type == NDX_DATA_TYPE.VARIATION) {
                    parsed[key] = parseFloat(element) / 100;
                } else if (type == NDX_DATA_TYPE.TIMES) {
                    parsed[key] = parseFloat(element);
                } else if (type == NDX_DATA_TYPE.MARKET_CAP) {
                    parsed[key] = parseMarketCap(element);
                } else if (type == NDX_DATA_TYPE.PRICE) {
                    parsed[key] = parseFloat(element);
                } else if (type == NDX_DATA_TYPE.DATE) {
                    const [ _, month, day, year ] = element.split(' ');
                    parsed[key] = new Date(year + month + parseInt(day));
                } else {
                    parsed[key] = element;
                }
            });
            return parsed;
        });

        const summary: NdxStock = { 
            epsFY1E: null, epsFY2E: null, epsLTM: null, epsNTM: null, nextEarnings: null, 
            divYield: 0, evSalesLTM: null, evSalesNTM: null, lastPrice: null, marketCap: null, 
            name: null, peLTM: null, peNTM: null, share: null, ticker: null, buy: null, 
            curShare: null, hold: null, m1Before: null, m1Variation: null, m3Before: null, 
            m3Variation: null, m6Before: null, m6Variation: null, numbers: null, potential: null, 
            priceTarget: null, sell: null, strongBuy: null, strongSell: null, w1Before: null, 
            w1Variation: null, w1Wave: null, y1Before: null, y1Variation: null, epsFY3E: null
        };
        stockInfo.forEach(element => {
            const { 
                marketCap, share, peNTM, peLTM, evSalesNTM, evSalesLTM, numbers,
                strongBuy, buy, hold, sell, strongSell, potential, w1Variation, m1Variation,
                m3Variation, m6Variation, y1Variation, epsNTM, epsLTM, epsFY1E, epsFY2E, epsFY3E
            } = element;

            summary.marketCap += marketCap ? marketCap: 0;
            summary.share += share ? share : 0;
            summary.peNTM += peNTM ? peNTM * share : 0;
            summary.peLTM += peLTM ? peLTM * share : 0;
            summary.evSalesNTM += evSalesNTM && share ? evSalesNTM * share : 0;
            summary.evSalesLTM += evSalesLTM && share ? evSalesLTM * share : 0;
            summary.numbers += numbers ? numbers : 0;
            summary.strongBuy += strongBuy ? strongBuy : 0;
            summary.buy += buy ? buy : 0;
            summary.hold += hold ? hold : 0;
            summary.sell += sell ? sell : 0;
            summary.strongSell += strongSell ? strongSell : 0;
            summary.potential += potential && share ? potential * share: 0;
            summary.w1Variation += w1Variation ? w1Variation : 0;
            summary.m1Variation += m1Variation ? m1Variation : 0;
            summary.m3Variation += m3Variation ? m3Variation : 0;
            summary.m6Variation += m6Variation ? m6Variation : 0;
            summary.y1Variation += y1Variation ? y1Variation : 0;
            summary.epsNTM += epsNTM ? epsNTM : 0;
            summary.epsLTM += epsLTM ? epsLTM : 0;
            summary.epsFY1E += epsFY1E ? epsFY1E : 0;
            summary.epsFY2E += epsFY2E ? epsFY2E : 0;
            summary.epsFY3E += epsFY3E ? epsFY3E : 0;
        });
        summary.priceTarget = ndx100Idx * (1 + summary.potential);
        summary.w1Before = ndx100Idx * (1 + summary.w1Variation);
        summary.m1Before = ndx100Idx * (1 + summary.m1Variation);
        summary.m3Before = ndx100Idx * (1 + summary.m3Variation);
        summary.m6Before = ndx100Idx * (1 + summary.m6Variation);
        summary.y1Before = ndx100Idx * (1 + summary.y1Variation);

        // console.log(summary)

        // return parsedData
        return { header: NdxStockColumn, data: stockInfo, currentNdx: ndx100Idx, summary };
    }

    private parseRawString(rawString: string): RawNdxBook {

        let scrapDataTypeArr: KoyfinScrapData[] = [];
    
        /* Data Arrays for API */
        let outputObj:any = {};
        let outputArr=[ ];
    
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
    
                console.log(splittedRow[25], splittedRow[26], splittedRow[27])
                /* Accumulate Total MarketCap */
                let marketCap = 0;
                if (typeof(splittedRow[3]) === 'string'){
                    marketCap = parseMarketCap(splittedRow[3]);
                    totalMarketCap += marketCap;
                }

                /* Sum of total LastPrice */
                let lastPrice = (splittedRow[2] === '-' ? 0 : parseFloat(splittedRow[2]))
                totalLastPrice += lastPrice;
    
                /* issuedShares, tpTotalMarketCap */
                let issuedShares = (marketCap*Math.pow(10, 9))/lastPrice;
                tpTotalMarketCap+=(parseFloat(splittedRow[10] === '-' ? 0 : splittedRow[10]) * issuedShares)
                
                /* CHART-1 */
                totalStrongSell += parseFloat(splittedRow[20]);
                totalSell += parseFloat(splittedRow[19]);
                totalHold += parseFloat(splittedRow[18]);
                totalBuy += parseFloat(splittedRow[17]);
                totalStrongBuy += parseFloat(splittedRow[16]);
    
    
                /* CHART-4 */
                totalNTM += (splittedRow[21]=== '-' ? 0 : parseFloat(splittedRow[21]));
                totalFY1E += (splittedRow[23]=== '-' ? 0 : parseFloat(splittedRow[23]));
                totalFY2E += (splittedRow[24]=== '-' ? 0 : parseFloat(splittedRow[24]));
                totalFY3E += (splittedRow[26]=== '-' ? 0 : parseFloat(splittedRow[26]));
    
    
                scrapDataTypeArr.push(scrapData);
            }
        });
    
        
        
    
        /* Parsing Data into Objects with Iterating */
        scrapDataTypeArr.forEach(row => {

            const share = "" + parseMarketCap(row.marketCap) / totalMarketCap * 100 + "%";
            // console.log(share);

            let basicInfo = {
                ticker: row.ticker,
                name: row.name,
                lastPrice: row.lastPrice,
                marketCap: row.marketCap,
                share,
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
                potential: ((parseFloat(row.priceTarget)-parseFloat(row.lastPrice))/parseFloat(row.lastPrice) * 100).toString(),
                curShare: ((parseFloat(row.priceTarget)-parseFloat(row.lastPrice))/(parseFloat(row.lastPrice) * parseFloat(basicInfo.share)) * 100).toString(),
                w1Wave: (parseFloat(row.priceTarget)-parseFloat(row.w1PriceTarget)).toString(),
                w1Before: row.w1PriceTarget,
                w1Variation: ((parseFloat(row.w1PriceTarget)-parseFloat(row.lastPrice))/(parseFloat(row.lastPrice) * parseFloat(basicInfo.share)) * 100).toString(),
                m1Before: row.m1PriceTarget,
                m1Variation: ((parseFloat(row.m1PriceTarget)-parseFloat(row.lastPrice))/(parseFloat(row.lastPrice) * parseFloat(basicInfo.share)) * 100).toString(),
                m3Before: row.m3PriceTarget,
                m3Variation: ((parseFloat(row.m3PriceTarget)-parseFloat(row.lastPrice))/(parseFloat(row.lastPrice) * parseFloat(basicInfo.share)) * 100).toString(),
                m6Before: row.m6PriceTarget,
                m6Variation: ((parseFloat(row.m6PriceTarget)-parseFloat(row.lastPrice))/(parseFloat(row.lastPrice) * parseFloat(basicInfo.share)) * 100).toString(),
                y1Before: row.y1PriceTarget,
                y1Variation: ((parseFloat(row.y1PriceTarget)-parseFloat(row.lastPrice))/(parseFloat(row.lastPrice) * parseFloat(basicInfo.share)) * 100).toString(),
            };
        
            let EPSInfo = {
                nextEarnings: row.nextEarnings,
                epsNTM: row.epsNTM,
                epsLTM: row.epsLTM,
                epsFY1E: row.epsFY1E,
                epsFY2E: row.epsFY2E,
                epsFY3E: row.epsFY3E
            };

            outputArr.push({
                basicInfo,
                ibTargetInfo,
                EPSInfo
            });
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
            ndx100Idx: parseFloat(ndx100Idx),
            ndx100TargetPrice: ((tpTotalMarketCap * parseFloat(ndx100Idx))/(totalMarketCap*Math.pow(10, 9)))
        }
    
        return outputObj
    }

}

function parseMarketCap(marketCap: string): number {
    const multiple = marketCap.search(/[bB]/) > -1 ? 1000000000 : marketCap.search(/[mM]/) > -1 ? 1000000 : 1;
    return parseFloat(marketCap.replace(/\$/g, '')) * multiple;
}