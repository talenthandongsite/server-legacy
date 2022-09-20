import { NdxBookCrawlService } from './ndx-book-crawl.service';
import { ConfigService } from './config.service';


test('Crawling Concurrency Test', async () => {
    const configService = new ConfigService();
    const ndxBookCrawlService = new NdxBookCrawlService(configService);

    let result1, result2, result3;
    const p1 = ndxBookCrawlService.crawlData().then(res => {
        result1 = res.jobId;
        return ndxBookCrawlService.crawlData();
    }).then(result => {
        result2 = result.jobId;
    });
    const p2 = ndxBookCrawlService.crawlData().then(result => {
        result3 = result.jobId;
    });

    await Promise.all([p1, p2]);

    expect(result1).toBe(0);
    expect(result2).toBe(1);
    expect(result3).toBe(0);
}, 1000000);
