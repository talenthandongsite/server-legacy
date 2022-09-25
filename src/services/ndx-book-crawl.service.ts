import { plainToClass } from 'class-transformer';
import { launch, Browser, Page } from 'puppeteer';
import { parseAbbribiatedNumber, safeParseFloat, safeParseInt, safePercentage } from '../functions/string-parser';
import { NdxBookData, NdxStock } from '../models/dtos';
import { ConfigService, CONFIG_KEY } from './config.service';

const NAVIGATION_TIMEOUT = 50000;
const TIMEOUT = 100000;

const LOGIN_URL = "https://app.koyfin.com/login";
const WATCHLIST_URL = "https://app.koyfin.com/myd/4af3aeda-0dfc-417d-a102-3f4c030d10e9";

export class NdxBookCrawlService {

    private mutexLock: boolean = false;
    private currentJob: Promise<NdxBookData> = null;
    private jobId: number = 0;

    constructor(private config: ConfigService) { }

    /**
     * @decription crawlData method is to crawling Nasdaq data from external webpage and return the result. If crawling is running, it will not run function additionally, rather it will return the already running function result.
     * @returns {Promise<NdxBookData>} data is serialized to data, summary.
    */
    crawlData(): Promise<NdxBookData> {
        if (this.mutexLock) {
            return this.currentJob;
        }

        this.mutexLock = true;
        const jobId = this.jobId;
        this.jobId++;

        this.currentJob = this.crawlNasdaqData(this.config.getValue(CONFIG_KEY.KOYFIN_USERNAME), this.config.getValue(CONFIG_KEY.KOYFIN_PASSWORD)).then(result => {
            return this.parseString(jobId, result);
        }).finally(() => {
            this.mutexLock = false;
        });

        return this.currentJob;
    }

    /**
     * @description This function conducts crawling of Nasdaq data from external source.
     * @param email {string} email address of account. This must be provided.
     * @param password {string} password for account. This must be provided.
     * @returns {string[][]} Array of strings with data. All data are stored as string. First row of array is header, 1~n elements are body row, and last row is summary row.
    */
    private async crawlNasdaqData(email: string, password: string): Promise<string[][]> {

        if (!email || !password) throw new Error("email, password parameter must be provided");

        const browser: Browser = await launch({
            defaultViewport: {
                width: 3600,
                height: 4000,
            },
            headless: true,
            ignoreHTTPSErrors: true
        });
        const page: Page = await browser.newPage();

        page.setDefaultNavigationTimeout(NAVIGATION_TIMEOUT);
        page.setDefaultTimeout(TIMEOUT);

        await page.goto(LOGIN_URL, { waitUntil: "networkidle0" });
        await page.waitForNetworkIdle();

        const emailInput = await page.$("input[name=email]");
        const passwordInput = await page.$("input[name=password]");

        if (!emailInput || !passwordInput) throw new Error("Something went wrong while getting login form");

        await emailInput.type(email);
        await passwordInput.type(password);

        await page.click('button[type="submit"]');
        await page.waitForNetworkIdle();

        // if (page.url() == LOGIN_URL) {
        //     console.log(email, password);
        //     throw new Error("Username and Password doesn't match");
        // }

        const loginIndicatorSelector = ".fa-user-circle";
        await page.waitForSelector(loginIndicatorSelector);
        // const loginIndicator = await page.$(loginIndicatorSelector);
        // if (!loginIndicator) throw new Error("Somethings went wrong while login to website(1)");
        
        await page.goto(WATCHLIST_URL, {waitUntil: "networkidle0" });
        await page.waitForNetworkIdle();

        const userBlockedSelector = "div[class^=registered-users-only-message__root]";
        const userBlocked = await page.$(userBlockedSelector);
        if (userBlocked) throw new Error("Somethings went wrong while login to website(2)");

        const firstBodyRowSelector = "div[class^=base-table-row__root]";
        await page.waitForSelector(firstBodyRowSelector);

        const setTableWideViewSelector = "button:has(> i.fa-compress-wide";
        await page.click(setTableWideViewSelector);

        const col: string[][] = [];

        const headerRowSelector = "div[class^=sortable-header-row__sortableHeaderRow] > div > div > div[class^=header-cell-content__headerCellContent]";
        const headerRows = await page.$$eval(headerRowSelector, divs => divs.map(div => {
            if (!div.textContent) throw new Error("Something went wrong with getting header text");
            return div.textContent.replace(/[,•]/g, '')
        }));
        if (!headerRows || headerRows.length == 0) throw new Error("Something went wrong with getting header");
        col.push(headerRows);

        const bodyRowSelector = "#unclassified > div > div[class^=base-table-row__root]";
        const bodyRowCount = await page.$$eval(bodyRowSelector, divs => divs.length);
        if (!bodyRowCount || bodyRowCount == 0) throw new Error("Something went wrong with getting table body count");

        for (let i = 0; i < bodyRowCount; i++) {
            const selector = `${bodyRowSelector}:nth-child(${i + 1}) > div`;
            const rows = await page.$$eval(selector, divs => divs.map(div => {
                if (!div) return null;
                return div.textContent.replace(/[,•]/g, '')
            }));
            col.push(rows);
        }

        await browser.close();

        return col;
    }

    /**
     * 
    */
    private parseString(jobId: number, rawData: string[][]): NdxBookData {
    
        /* GET Nasdaq INDEX */
        let ndxRow = rawData[rawData.length - 1];
        let [_1, _2, _ndx100Index] = ndxRow;
        const ndx100Index = safeParseInt(_ndx100Index);
    

        /* Data Parsing */
        const basicRow = rawData.map((element: string[], index: number) => {
            if (index == 0 || index > rawData.length - 2) {
                return null;
            }

            const [ 
                ticker, name, _lastPrice, _marketCap, _peNTM, _peLTM, _evSalesNTM, _evSalesLTM,
                _divYield, _numbers, _priceTarget, _w1Before, _m1Before,
                _m3Before, _m6Before, _y1Before, _strongBuy, _buy, _hold, _sell, 
                _strongSell, _epsNTM, _epsLTM, _epsFY1E, _epsFY2E, _epsFY3E, _nextEarnings
            ] = element;

            const lastPrice = safeParseFloat(_lastPrice);
            const marketCap = parseAbbribiatedNumber(_marketCap);
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
                marketCap, evSalesNTM, evSalesLTM, priceTarget, lastPrice, w1Before,
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
