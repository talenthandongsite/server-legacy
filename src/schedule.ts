import { CronJob } from 'cron';
import { NdxBookCrawlService, DataCacheService } from './services';

export class Cron {
    static EverySecond: string = '* * * * * *';
    static Every10Second: string = '*/10 * * * * *';
    static EveryMinute: string = '0 * * * * *';
    static EveryHour: string = '0 0 * * * *';
    static Every6pm: string = '0 0 18 * * *';
}

export class Timezone {
    static AmericalLosAngeles: string = 'America/Los_Angeles';
    static AsiaSeoul: string = 'Asia/Seoul';
}

const DEFAULT_TIMEZONE: string = Timezone.AsiaSeoul;

export class Schedule {

    ndxCrawlJob: CronJob;

    constructor (private dataCacheService: DataCacheService, private ndxBookCrawlService: NdxBookCrawlService) {

        this.ndxCrawlJob = new CronJob(Cron.EveryHour, async () => {
            try {
                const data = await this.ndxBookCrawlService.crawlData();
                this.dataCacheService.setNdxBookData(data);
                console.log("Job Completed: ndxBookData");
            } catch (err) {
                console.log("Job Failed: ndxBookData: ", err);
            }
        }, null, false, DEFAULT_TIMEZONE);
    }

    start() {
        this.ndxCrawlJob.start();
    }
}