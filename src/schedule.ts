import { scheduleJob } from 'node-schedule';
import { NdxBookCrawlService, DataCacheService } from './services';


const job = scheduleJob('42 * * * *', function(){
    console.log('The answer to life, the universe, and everything!');
});

type Task = {

}

class Schedule {


    constructor (dataCacheService: DataCacheService, ndxBookCrawlService: NdxBookCrawlService) {

    }



    shutdown() {

    }
}