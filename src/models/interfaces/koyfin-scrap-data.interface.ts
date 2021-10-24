/*
Scrap Parsing Data Type
*/
export interface KoyfinScrapData {
    ticker: string;
    name: string;
    lastPrice: string;
    marketCap: string;
    peNTM: string;
    peLTM: string;
    evSalesNTM: string;
    evSalesLTM: string;
    divYield: string;
    priceTargetNumbers: string;
    priceTarget: string;
    w1PriceTarget: string;
    m1PriceTarget: string;
    m3PriceTarget: string;
    m6PriceTarget: string;
    y1PriceTarget: string;
    strongBuy: string;
    buy:string;
    hold: string;
    sell: string;
    strongSell: string;
    epsNTM: string;
    epsLTM: string;
    epsFY1E: string;
    epsFY2E: string;
    nextEarnings: string;
    epsFY3E: string;
    w52High: string;
    w52Low: string;
}



/*
API Response Data Type
*/

export interface BasicInfo {
    ticker: string;
    name: string;
    lastPrice: string;
    marketCap: string;
    share: string; // total marketcap / its marketcap
    peNTM: string;
    peLTM: string;
    evSalesNTM: string;
    evSalesLTM: string;
    divYield: string; // Dividend Yield
}

export interface IBTargetAverageInfo {
    priceTargetNumbers: string; // ScrapDataType.priceTargetNumbers
    strongBuy: string; // .strongBuy
    buy: string; // .buy
    hold: string; // .hold
    sell: string; // .sell
    strongSell: string; // .strongSell
    priceTarget: string; // ScrapDataType.priceTarget
    potential: string; // (priceTarget - ScrapDataType.lastPrice) / ScrapDataType.lastPrice
    curShare: string; // potential * BasicInfo.share 
    w1Wave: string; // priceTarget - w1Before
    w1Before: string; // ScrapDataType.w1PriceTarget
    w1Share: string; // (w1Before - ScrapDataType.lastPrice) / ScrapDataType.lastPrice * BasicInfo.share
    m1Before: string; // ScrapDataType.m1PriceTarget
    m1Share: string; // (m1Before - ScrapDataType.lastPrice) / ScrapDataType.lastPrice * BasicInfo.share
    m3Before: string; // ScrapDataType.m3PriceTarget
    m3Share: string; // (m3Before - ScrapDataType.lastPrice) / ScrapDataType.lastPrice * BasicInfo.share
    m6Before: string; // ScrapDataType.m6PriceTarget
    m6Share: string; // (m6Before - ScrapDataType.lastPrice) / ScrapDataType.lastPrice * BasicInfo.share
    y1Before: string; // ScrapDataType.y1PriceTarget
    y1Share: string; // (y1Before - ScrapDataType.lastPrice) / ScrapDataType.lastPrice * BasicInfo.share
}


export interface EPSInfo {
    nextEarnings: string; // ScrapDataType.$  (all same)
    epsNTM: string;
    epsLTM: string;
    epsFY1E: string;
    epsFY2E: string;
    epsFY3E: string;
}