import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CACHE_TTLS } from '../../common/constants/cache.constants';
import { CoreDataService } from '../core/core-data.service';
import { InsightsService } from '../insights/insights.service';

@Injectable()
export class ReportsService {
    private readonly logger = new Logger(ReportsService.name);

    constructor(
        @Inject('YAHOO_FINANCE_INSTANCE') private readonly yahooFinance: any,
        @Inject(CACHE_MANAGER) private cacheManager: any,
        private readonly coreDataService: CoreDataService,
        private readonly insightsService: InsightsService,
    ) { }

    async getEtfNews(symbol: string) {
        const cacheKey = `etf_news_${symbol}`;
        const cachedData = await this.cacheManager.get(cacheKey);

        if (cachedData) {
            this.logger.log(`Cache HIT [News]: ${symbol}`);
            return cachedData;
        }

        this.logger.log(`Cache MISS [News]: ${symbol} - Fetching from Yahoo Finance`);
        try {
            const result = await this.yahooFinance.search(symbol, { newsCount: 10 }) as any;
            const data = result.news;
            await this.cacheManager.set(cacheKey, data, CACHE_TTLS.NEWS);
            return data;
        } catch (error) {
            this.logger.error(`Error fetching news for ${symbol}:`, error);
            throw error;
        }
    }

    async getEtfFullReport(symbol: string) {
        const cacheKey = `etf_full_report_${symbol}`;
        const cachedData = await this.cacheManager.get(cacheKey);

        if (cachedData) {
            this.logger.log(`Cache HIT [Full Report]: ${symbol}`);
            return cachedData;
        }

        this.logger.log(`Cache MISS [Full Report]: ${symbol} - Consolidating data`);
        const results = await Promise.allSettled([
            this.coreDataService.getEtfInfo(symbol),
            this.coreDataService.getEtfPrice(symbol),
            this.getEtfNews(symbol),
            this.insightsService.getEtfHoldings(symbol),
            this.insightsService.getEtfInsights(symbol),
            this.insightsService.getEtfRecommendations(symbol),
        ]);

        const [details, price, news, holdings, insights, recommendations] = results;

        const report = {
            symbol,
            generatedAt: new Date().toISOString(),
            details: details.status === 'fulfilled' ? details.value : { error: 'Failed to fetch details' },
            price: price.status === 'fulfilled' ? price.value : { error: 'Failed to fetch price' },
            news: news.status === 'fulfilled' ? news.value : [],
            holdings: holdings.status === 'fulfilled' ? holdings.value : { error: 'Failed to fetch holdings' },
            insights: insights.status === 'fulfilled' ? insights.value : { error: 'Failed to fetch insights' },
            recommendations: recommendations.status === 'fulfilled' ? recommendations.value : [],
        };

        await this.cacheManager.set(cacheKey, report, CACHE_TTLS.FULL_REPORT);
        return report;
    }
}
