import { plainToClass } from "class-transformer";
import { NdxBookData, NdxStock } from "../models/dtos";

const CENTI = 100;

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
        return this.parseRawString(rawString);
    };

    private parseRawString(rawString: string): NdxBookData {
    
        const rawRow = rawString.split("\r\n");
    
        /* GET Nasdaq INDEX */
        let ndxRow = rawRow[rawRow.length - 3].split(',');
        let [_1, _2, _ndx100Index] = ndxRow;
        const ndx100Index = safeParseInt(_ndx100Index);
    

        /* Data Parsing */
        const basicRow = rawRow.map((element: any, index: number) => {
            if (index == 0 || index > rawRow.length - 4) {
                return null;
            }

            const column = element.split(",");
            const [ 
                ticker, name, _lastPrice, _marketCap, _peNTM, _peLTM, _evSalesNTM, _evSalesLTM,
                _divYield, _numbers, _priceTarget, _w1Before, _m1Before,
                _m3Before, _m6Before, _y1Before, _strongBuy, _buy, _hold, _sell, 
                _strongSell, _epsNTM, _epsLTM, _epsFY1E, _epsFY2E, _nextEarnings, _epsFY3E
            ] = column;

            const lastPrice = safeParseFloat(_lastPrice);
            const marketCap = parseMarketCap(_marketCap);
            const peNTM = safeParseFloat(_peNTM)
            const peLTM = safeParseFloat(_peLTM);
            const evSalesNTM = safeParseFloat(_evSalesNTM);
            const evSalesLTM = safeParseFloat(_evSalesLTM);
            const divYield = safePercentage(_divYield);
            const numbers = safeParseInt(_numbers);
            const priceTarget = safeParseFloat(_priceTarget);
            const w1Before = safeParseFloat(_w1Before);
            const m1Before = safeParseFloat(_m1Before);
            const m3Before = safeParseFloat(_m3Before);
            const m6Before = safeParseFloat(_m6Before);
            const y1Before = safeParseFloat(_y1Before);
            const strongBuy = safeParseInt(_strongBuy);
            const buy = safeParseInt(_buy);
            const hold = safeParseInt(_hold);
            const sell = safeParseInt(_sell);
            const strongSell = safeParseInt(_strongSell);
            const epsNTM = safeParseFloat(_epsNTM);
            const epsLTM = safeParseFloat(_epsLTM);
            const epsFY1E = safeParseFloat(_epsFY1E);
            const epsFY2E = safeParseFloat(_epsFY2E);
            const epsFY3E = safeParseFloat(_epsFY3E);
            const [ _, month, day, year ] = _nextEarnings.split(' ');
            const nextEarnings = new Date(year + month + parseInt(day));

            return { 
                ticker, name, lastPrice, marketCap, peNTM, peLTM, evSalesNTM, evSalesLTM, divYield,
                numbers, priceTarget, w1Before, m1Before, m3Before, m6Before,
                y1Before, strongBuy, buy, hold, sell, strongSell, epsNTM, epsLTM, epsFY1E,
                epsFY2E, epsFY3E, nextEarnings
            };
        }).filter(element => element);
    
        const totalMarketCap = basicRow.reduce((prev, current) => {
            return prev + current.marketCap;
        }, 0);

        const calculatedValueAppendRow = basicRow.map(element => {
            const { 
                marketCap, peNTM, peLTM, evSalesNTM, evSalesLTM, priceTarget, lastPrice, w1Before,
                m1Before, m3Before, m6Before, y1Before
            } = element;

            const share = marketCap / totalMarketCap;
            const evSalesNTMShare = share * evSalesNTM;
            const evSalesLTMShare = share * evSalesLTM;
            const potential = (priceTarget - lastPrice) / lastPrice;
            const potentialShare = share * potential;
            const w1Wave = priceTarget - w1Before;
            const w1Variation = ( (w1Before - lastPrice) / lastPrice ) * share;
            const m1Variation = ( (m1Before - lastPrice) / lastPrice ) * share;
            const m3Variation = ( (m3Before - lastPrice) / lastPrice ) * share;
            const m6Variation = ( (m6Before - lastPrice) / lastPrice ) * share;
            const y1Variation = ( (y1Before - lastPrice) / lastPrice ) * share;

            return { 
                ...element, 
                share, evSalesNTMShare, evSalesLTMShare, potential, 
                potentialShare, w1Wave, w1Variation, m1Variation, m3Variation, m6Variation,
                y1Variation
            };
        });
        
        const _summary = { 
            epsFY1E: null, epsFY2E: null, epsLTM: null, epsNTM: null, nextEarnings: null, 
            divYield: 0, evSalesLTM: null, evSalesNTM: null, lastPrice: null, marketCap: null, 
            name: null, peLTM: null, peNTM: null, share: null, ticker: null, buy: null, 
            curShare: null, hold: null, m1Before: null, m1Variation: null, m3Before: null, 
            m3Variation: null, m6Before: null, m6Variation: null, numbers: null, potential: null, 
            priceTarget: null, sell: null, strongBuy: null, strongSell: null, w1Before: null, 
            w1Variation: null, w1Wave: null, y1Before: null, y1Variation: null, epsFY3E: null
        };
        calculatedValueAppendRow.forEach(element => {
            const {
                marketCap, share, evSalesNTMShare, evSalesLTMShare, numbers,
                strongBuy, buy, hold, sell, strongSell, potential, w1Variation, m1Variation,
                m3Variation, m6Variation, y1Variation, epsNTM, epsLTM, epsFY1E, epsFY2E, epsFY3E
            } = element;

            _summary.marketCap += marketCap ? marketCap: 0;
            _summary.share += share ? share : 0;
            _summary.evSalesNTM += evSalesNTMShare;
            _summary.evSalesLTM += evSalesLTMShare;
            _summary.numbers += numbers ? numbers : 0;
            _summary.strongBuy += strongBuy ? strongBuy : 0;
            _summary.buy += buy ? buy : 0;
            _summary.hold += hold ? hold : 0;
            _summary.sell += sell ? sell : 0;
            _summary.strongSell += strongSell ? strongSell : 0;
            _summary.potential += potential && share ? potential * share: 0;
            _summary.w1Variation += w1Variation ? w1Variation : 0;
            _summary.m1Variation += m1Variation ? m1Variation : 0;
            _summary.m3Variation += m3Variation ? m3Variation : 0;
            _summary.m6Variation += m6Variation ? m6Variation : 0;
            _summary.y1Variation += y1Variation ? y1Variation : 0;
            _summary.epsNTM += epsNTM ? epsNTM : 0;
            _summary.epsLTM += epsLTM ? epsLTM : 0;
            _summary.epsFY1E += epsFY1E ? epsFY1E : 0;
            _summary.epsFY2E += epsFY2E ? epsFY2E : 0;
            _summary.epsFY3E += epsFY3E ? epsFY3E : 0;
        });

        _summary.priceTarget = ndx100Index * (1 + _summary.potential);
        _summary.w1Before = ndx100Index * (1 + _summary.w1Variation);
        _summary.m1Before = ndx100Index * (1 + _summary.m1Variation);
        _summary.m3Before = ndx100Index * (1 + _summary.m3Variation);
        _summary.m6Before = ndx100Index * (1 + _summary.m6Variation);
        _summary.y1Before = ndx100Index * (1 + _summary.y1Variation);
        _summary.w1Wave = _summary.priceTarget - _summary.w1Before;
        _summary.lastPrice = ndx100Index;
        _summary.peNTM = ndx100Index / _summary.epsNTM;
        _summary.peLTM = ndx100Index / _summary.epsLTM;

        const data = calculatedValueAppendRow.map(element => plainToClass(NdxStock, element, { excludeExtraneousValues: true }));
        const summary = plainToClass(NdxStock, _summary, { excludeExtraneousValues: true });
        
        return { data, summary };
    }

}

function parseMarketCap(marketCap: string): number {
    const multiple = marketCap.search(/[bB]/) > -1 ? 1000000000 : marketCap.search(/[mM]/) > -1 ? 1000000 : 1;
    return parseFloat(marketCap.replace(/\$/g, '')) * multiple;
}

function safeParseFloat(numbers: string): number {
    return isNaN(parseFloat(numbers)) ? null : parseFloat(numbers);
}

function safeParseInt(numbers: string): number {
    return isNaN(parseInt(numbers)) ? null : parseInt(numbers);
}

function safePercentage(numbers: string): number {
    return isNaN(parseFloat(numbers)) ? null : parseFloat(numbers) / CENTI;
}