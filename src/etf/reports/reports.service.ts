import { Injectable } from '@nestjs/common';
import yahooFinance from 'yahoo-finance2';
import { CoreDataService } from '../core/core-data.service';
import { InsightsService } from '../insights/insights.service';

@Injectable()
export class ReportsService {
    constructor(
        private readonly coreDataService: CoreDataService,
        private readonly insightsService: InsightsService,
    ) { }

    async getEtfNews(symbol: string) {
        try {
            const result = await yahooFinance.search(symbol, { newsCount: 10 }) as any;
            return result.news;
        } catch (error) {
            console.error(`Error fetching news for ${symbol}:`, error);
            throw error;
        }
    }

    async getEtfFullReport(symbol: string) {
        const results = await Promise.allSettled([
            this.coreDataService.getEtfInfo(symbol),
            this.coreDataService.getEtfPrice(symbol),
            this.getEtfNews(symbol),
            this.insightsService.getEtfHoldings(symbol),
            this.insightsService.getEtfInsights(symbol),
            this.insightsService.getEtfRecommendations(symbol),
        ]);

        const [details, price, news, holdings, insights, recommendations] = results;

        return {
            symbol,
            generatedAt: new Date().toISOString(),
            details: details.status === 'fulfilled' ? details.value : { error: 'Failed to fetch details' },
            price: price.status === 'fulfilled' ? price.value : { error: 'Failed to fetch price' },
            news: news.status === 'fulfilled' ? news.value : [],
            holdings: holdings.status === 'fulfilled' ? holdings.value : { error: 'Failed to fetch holdings' },
            insights: insights.status === 'fulfilled' ? insights.value : { error: 'Failed to fetch insights' },
            recommendations: recommendations.status === 'fulfilled' ? recommendations.value : [],
        };
    }
}
