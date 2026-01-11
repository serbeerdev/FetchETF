import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class InsightsService {
    constructor(
        @Inject('YAHOO_FINANCE_INSTANCE') private readonly yahooFinance: any,
        @Inject(CACHE_MANAGER) private cacheManager: any,
    ) { }

    async getEtfRecommendations(symbol: string) {
        const cacheKey = `etf_recommendations_${symbol}`;
        const cachedData = await this.cacheManager.get(cacheKey);
        if (cachedData) return cachedData;

        try {
            const data = await this.yahooFinance.recommendationsBySymbol(symbol);
            await this.cacheManager.set(cacheKey, data, 60 * 60 * 1000); // 1 hour
            return data;
        } catch (error) {
            console.error(`Error fetching recommendations for ${symbol}:`, error);
            throw error;
        }
    }

    async getEtfInsights(symbol: string) {
        const cacheKey = `etf_insights_${symbol}`;
        const cachedData = await this.cacheManager.get(cacheKey);
        if (cachedData) return cachedData;

        try {
            const data = await this.yahooFinance.insights(symbol);
            await this.cacheManager.set(cacheKey, data, 24 * 60 * 60 * 1000); // 24 hours
            return data;
        } catch (error) {
            console.error(`Error fetching insights for ${symbol}:`, error);
            throw error;
        }
    }

    async getEtfHoldings(symbol: string) {
        const cacheKey = `etf_holdings_${symbol}`;
        const cachedData = await this.cacheManager.get(cacheKey);
        if (cachedData) return cachedData;

        try {
            const data = await this.yahooFinance.quoteSummary(symbol, {
                modules: ['topHoldings', 'fundPerformance', 'assetProfile'],
            });
            await this.cacheManager.set(cacheKey, data, 24 * 60 * 60 * 1000); // 24 hours
            return data;
        } catch (error) {
            console.error(`Error fetching holdings for ${symbol}:`, error);
            throw error;
        }
    }
}
