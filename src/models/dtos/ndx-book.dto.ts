import { Expose } from "class-transformer";

export class NdxStock {
    @Expose()
    ticker: string;

    @Expose()
    name: string;

    @Expose()
    lastPrice: number;

    @Expose()
    marketCap: number;

    @Expose()
    share: number;

    @Expose()
    peLTM: number;

    @Expose()
    peNTM: number;

    @Expose()
    evSalesLTM: number;

    @Expose()
    evSalesNTM: number;

    @Expose()
    divYield: number;

    @Expose()
    numbers: number;

    @Expose()
    buy: number;

    @Expose()
    hold: number;

    @Expose()
    sell: number;

    @Expose()
    strongBuy: number;

    @Expose()
    strongSell: number;

    @Expose()
    potential: number;

    @Expose()
    priceTarget: number;

    @Expose()
    w1Before: number;

    @Expose()
    w1Wave: number;

    @Expose()
    m1Before: number;

    @Expose()
    m3Before: number;

    @Expose()
    m6Before: number;

    @Expose()
    y1Before: number;

    @Expose()
    nextEarnings: number;

    @Expose()
    epsFY1E: number;

    @Expose()
    epsFY2E: number;

    @Expose()
    epsFY3E: number;

    @Expose()
    epsLTM: number;

    @Expose()
    epsNTM: number;
}

export class NdxBookData {
    @Expose()
    data: NdxStock[];

    @Expose()
    summary: NdxStock;
}