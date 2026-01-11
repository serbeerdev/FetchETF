import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CoreDataService } from '../core/core-data.service';
import { InsightsService } from '../insights/insights.service';

@Injectable()
export class ReportsService {
    constructor(
        @Inject('YAHOO_FINANCE_INSTANCE') private readonly yahooFinance: any,
        @Inject(CACHE_MANAGER) private cacheManager: any,
        private readonly coreDataService: CoreDataService,
        private readonly insightsService: InsightsService,
    ) { }

    async getEtfNews(symbol: string) {
        const cacheKey = `etf_news_${symbol}`;
        const cachedData = await this.cacheManager.get(cacheKey);
        if (cachedData) return cachedData;

        try {
            const result = await this.yahooFinance.search(symbol, { newsCount: 10 }) as any;
            const data = result.news;
            await this.cacheManager.set(cacheKey, data, 15 * 60 * 1000); // 15 minutes
            return data;
        } catch (error) {
            console.error(`Error fetching news for ${symbol}:`, error);
            throw error;
        }
    }

    async getEtfFullReport(symbol: string) {
        const cacheKey = `etf_full_report_${symbol}`;
        const cachedData = await this.cacheManager.get(cacheKey);
        if (cachedData) return cachedData;

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

        await this.cacheManager.set(cacheKey, report, 30 * 1000); // 30 seconds
        return report;
    }
}
