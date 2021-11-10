export interface RawNdxBook {
    ndx100Data: {
        ndx100Idx: string;
        ndx100Target: string;
    }
    result: [
        {
            EPSInfo: {
                epsFY1E: string;
                epsFY2E: string;
                epsLTM: string;
                epsNTM: string;
                nextEarnings: string;
            }
            basicInfo: {
                divYield: string;
                evSalesLTM: string;
                evSalesNTM: string;
                lastPrice: string;
                marketCap: string;
                name: string;
                peLTM: string;
                peNTM: string;
                share: string;
                ticker: string;
            }
            ibTargetInfo: {
                buy: string;
                curShare: string;
                hold: string;
                m1Before: string;
                m1Share: string;
                m3Before: string;
                m3Share: string;
                m6Before: string;
                m6Share: string;
                numbers: string;
                potential: string;
                priceTarget: string;
                sell: string;
                strongBuy: string;
                strongSell: string;
                w1Before: string;
                w1Share: string;
                w1Wave: string;
                y1Before: string;
                y1Share: string;
            }
        }
    ]
    stat: {
        epsChangeChart: {
            totalFY1E: number;
            totalFY2E: number;
            totalFY3E: number;
            totalNTM: number;
        }
        ratingChart: {
            totalBuy: any;
            totalHold: any;
            totalSell: any;
            totalStrongBuy: any;
            totalStrongSell: any;
        }
    }
}

export enum NDX_DATA_TYPE {
    STRING = 'STRING', // Apple Inc.
    NUMBER = 'NUMBER', // 12.1
    MARKET_CAP = 'MARKET_CAP', //ex. $ 12.2B
    PRICE = 'PRICE', // ex. $142.1
    TIMES = 'TIMES', // ex. 65x
    PERCENTAGE = 'PERCENTAGE', // 32%
    VARIATION = 'VARIATION', // +32% , - 21%
    DATE = 'DATE'
}

export enum NDX_CATEGORY_TYPE {
    BASIC_INFO = 'BASIC_INFO',
    EPS_INFO = 'EPS_INFO',
    IB_TARGET_INFO = 'IB_TARGET_INFO'
}


export const NdxStockColumn: NdxStockFormat[] = [
    {
        label: 'EPS(FY1E)',
        value: 'epsFY1E',
        description: '',
        type: NDX_DATA_TYPE.NUMBER,
        category: NDX_CATEGORY_TYPE.EPS_INFO,
        order: 34
    },
    {
        label: 'EPS(FY2E)',
        value: 'epsFY2E',
        description: '',
        type: NDX_DATA_TYPE.NUMBER,
        category: NDX_CATEGORY_TYPE.EPS_INFO,
        order: 35
    },
    {
        label: 'EPS(FY3E)',
        value: 'epsFY3E',
        description: '',
        type: NDX_DATA_TYPE.NUMBER,
        category: NDX_CATEGORY_TYPE.EPS_INFO,
        order: 36
    },
    {
        label: 'EPS(LTM)',
        value: 'epsLTM',
        description: '',
        type: NDX_DATA_TYPE.NUMBER,
        category: NDX_CATEGORY_TYPE.EPS_INFO,
        order: 33
    },
    {
        label: 'EPS(NTM)',
        value: 'epsNTM',
        description: '',
        type: NDX_DATA_TYPE.NUMBER,
        category: NDX_CATEGORY_TYPE.EPS_INFO,
        order: 32
    },
    {
        label: '다음실적발표일',
        value: 'nextEarnings',
        description: '',
        type: NDX_DATA_TYPE.DATE,
        category: NDX_CATEGORY_TYPE.EPS_INFO,
        order: 31
    },
    {
        label: '배당 (LTM)',
        value: 'divYield',
        description: '',
        type: NDX_DATA_TYPE.PERCENTAGE,
        category: NDX_CATEGORY_TYPE.BASIC_INFO,
        order: 10
    },
    {
        label: 'EV/Sales (LTM)',
        value: 'evSalesLTM',
        description: '',
        type: NDX_DATA_TYPE.TIMES,
        category: NDX_CATEGORY_TYPE.BASIC_INFO,
        order: 9
    },
    {
        label: 'EV/Sales (NTM)',
        value: 'evSalesNTM',
        description: '',
        type: NDX_DATA_TYPE.TIMES,
        category: NDX_CATEGORY_TYPE.BASIC_INFO,
        order: 8,
    },
    {
        label: '종가',
        value: 'lastPrice',
        description: '',
        type: NDX_DATA_TYPE.PRICE,
        category: NDX_CATEGORY_TYPE.BASIC_INFO,
        order: 3
    },
    {
        label: '시가총액',
        value: 'marketCap',
        description: '',
        type: NDX_DATA_TYPE.MARKET_CAP,
        category: NDX_CATEGORY_TYPE.BASIC_INFO,
        order: 4
    },
    {
        label: '이름',
        value: 'name',
        description: '',
        type: NDX_DATA_TYPE.STRING,
        category: NDX_CATEGORY_TYPE.BASIC_INFO,
        order: 2
    },
    {
        label: 'P/E (LTM)',
        value: 'peLTM',
        description: '',
        type: NDX_DATA_TYPE.TIMES,
        category: NDX_CATEGORY_TYPE.BASIC_INFO,
        order: 7
    },
    {
        label: 'P/E (NTM)',
        value: 'peNTM',
        description: '',
        type: NDX_DATA_TYPE.TIMES,
        category: NDX_CATEGORY_TYPE.BASIC_INFO,
        order: 6
    },
    {
        label: '비중',
        value: 'share',
        description: '',
        type: NDX_DATA_TYPE.PERCENTAGE,
        category: NDX_CATEGORY_TYPE.BASIC_INFO,
        order: 5
    },
    {
        label: '티커',
        value: 'ticker',
        description: '',
        type: NDX_DATA_TYPE.STRING,
        category: NDX_CATEGORY_TYPE.BASIC_INFO,
        order: 1
    },
    {
        label: '매수',
        value: 'buy',
        description: '',
        type: NDX_DATA_TYPE.NUMBER,
        category: NDX_CATEGORY_TYPE.IB_TARGET_INFO,
        order: 13
    },
    {
        label: '현재비중',
        value: 'curShare',
        description: '',
        type: NDX_DATA_TYPE.PERCENTAGE,
        category: NDX_CATEGORY_TYPE.IB_TARGET_INFO,
        order: 19
    },
    {
        label: '보유',
        value: 'hold',
        description: '',
        type: NDX_DATA_TYPE.NUMBER,
        category: NDX_CATEGORY_TYPE.IB_TARGET_INFO,
        order: 14
    },
    {
        label: '1M전',
        value: 'm1Before',
        description: '',
        type: NDX_DATA_TYPE.PRICE,
        category: NDX_CATEGORY_TYPE.IB_TARGET_INFO,
        order: 23
    },
    {
        label: '1M 비중 변화',
        value: 'm1Variation',
        description: '',
        type: NDX_DATA_TYPE.VARIATION,
        category: NDX_CATEGORY_TYPE.IB_TARGET_INFO,
        order: 24
    },
    {
        label: '3M전',
        value: 'm3Before',
        description: '',
        type: NDX_DATA_TYPE.PRICE,
        category: NDX_CATEGORY_TYPE.IB_TARGET_INFO,
        order: 25
    },
    {
        label: '3M 비중 변화',
        value: 'm3Variation',
        description: '',
        type: NDX_DATA_TYPE.VARIATION,
        category: NDX_CATEGORY_TYPE.IB_TARGET_INFO,
        order: 26
    },
    {
        label: '6M전',
        value: 'm6Before',
        description: '',
        type: NDX_DATA_TYPE.PRICE,
        category: NDX_CATEGORY_TYPE.IB_TARGET_INFO,
        order: 27
    },
    {
        label: '6M 비중 변화',
        value: 'm6Variation',
        description: '',
        type: NDX_DATA_TYPE.VARIATION,
        category: NDX_CATEGORY_TYPE.IB_TARGET_INFO,
        order: 28
    },
    {
        label: '건 수',
        value: 'numbers',
        description: '',
        type: NDX_DATA_TYPE.NUMBER,
        category: NDX_CATEGORY_TYPE.IB_TARGET_INFO,
        order: 11
    },
    {
        label: '상승여력',
        value: 'potential',
        description: '',
        type: NDX_DATA_TYPE.VARIATION,
        category: NDX_CATEGORY_TYPE.IB_TARGET_INFO,
        order: 18
    },
    {
        label: '현재',
        value: 'priceTarget',
        description: '',
        type: NDX_DATA_TYPE.PRICE,
        category: NDX_CATEGORY_TYPE.IB_TARGET_INFO,
        order: 17
    },
    {
        label: '매도',
        value: 'sell',
        description: '',
        type: NDX_DATA_TYPE.NUMBER,
        category: NDX_CATEGORY_TYPE.IB_TARGET_INFO,
        order: 15
    },
    {
        label: '강력매수',
        value: 'strongBuy',
        description: '',
        type: NDX_DATA_TYPE.NUMBER,
        category: NDX_CATEGORY_TYPE.IB_TARGET_INFO,
        order: 12
    },
    {
        label: '강력매도',
        value: 'strongSell',
        description: '',
        type: NDX_DATA_TYPE.NUMBER,
        category: NDX_CATEGORY_TYPE.IB_TARGET_INFO,
        order: 16
    },
    {
        label: '1W전',
        value: 'w1Before',
        description: '',
        type: NDX_DATA_TYPE.PRICE,
        category: NDX_CATEGORY_TYPE.IB_TARGET_INFO,
        order: 21
    },
    {
        label: '1W 비중 변화',
        value: 'w1Variation',
        description: '',
        type: NDX_DATA_TYPE.VARIATION,
        category: NDX_CATEGORY_TYPE.IB_TARGET_INFO,
        order: 22
    },
    {
        label: '1W 가격 변동',
        value: 'w1Wave',
        description: '',
        type: NDX_DATA_TYPE.PRICE,
        category: NDX_CATEGORY_TYPE.IB_TARGET_INFO,
        order: 20
    },
    {
        label: '1Y전',
        value: 'y1Before',
        description: '',
        type: NDX_DATA_TYPE.PRICE,
        category: NDX_CATEGORY_TYPE.IB_TARGET_INFO,
        order: 29
    },
    {
        label: '1Y 비중 변화',
        value: 'y1Variation',
        description: '',
        type: NDX_DATA_TYPE.VARIATION,
        category: NDX_CATEGORY_TYPE.IB_TARGET_INFO,
        order: 30
    },
]

export interface NdxStock {
    epsFY1E: number;
    epsFY2E: number;
    epsLTM: number;
    epsNTM: number;
    nextEarnings: number;
    divYield: number;
    evSalesLTM: number;
    evSalesNTM: number;
    lastPrice: number;
    marketCap: number;
    name: string;
    peLTM: number;
    peNTM: number;
    share: number;
    ticker: string;
    buy: number;
    curShare: number;
    hold: number;
    m1Before: number;
    m1Variation: number;
    m3Before: number;
    m3Variation: number;
    m6Before: number;
    m6Variation: number;
    numbers: number;
    potential: number;
    priceTarget: number;
    sell: number;
    strongBuy: number;
    strongSell: number;
    w1Before: number;
    w1Variation: number;
    w1Wave: number;
    y1Before: number;
    y1Variation: number;
}

export interface NdxStockFormat {
    label: string;
    value: string;
    description?: string;
    type: NDX_DATA_TYPE;
    category: NDX_CATEGORY_TYPE;
    order: number;
}

export interface NdxEPSPrediction {
    totalFY1E: number;
    totalFY2E: number;
    totalFY3E: number;
    totalNTM: number;
}

export interface NdxStockRating {
    totalBuy: number;
    totalHold: number;
    totalSell: number;
    totalStrongBuy: number;
    totalStrongSell: number;
}

export interface NdxPrediction {
    ndxCurrent: number;
    ndxTarget: number;
}

export interface NdxBookData {
    ndxPrediction: NdxPrediction;
    epsPrediction: NdxEPSPrediction;
    stockRating: NdxStockRating;
    stockHeader: NdxStockFormat[];
    stockInfo: NdxStock[];
}