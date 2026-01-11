import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CACHE_TTLS } from '../../common/constants/cache.constants';

@Injectable()
export class InsightsService {
    private readonly logger = new Logger(InsightsService.name);

    constructor(
        @Inject('YAHOO_FINANCE_INSTANCE') private readonly yahooFinance: any,
        @Inject(CACHE_MANAGER) private cacheManager: any,
    ) { }

    async getEtfRecommendations(symbol: string) {
        const cacheKey = `etf_recommendations_${symbol}`;
        const cached: any = await this.cacheManager.get(cacheKey);

        if (cached) {
            const expiry = new Date(cached.expiresAt).toLocaleTimeString();
            this.logger.log(`Cache HIT [Recommendations]: ${symbol} (Expires at: ${expiry})`);
            return cached.value;
        }

        this.logger.log(`Cache MISS [Recommendations]: ${symbol} - Fetching from Yahoo Finance`);
        try {
            const data = await this.yahooFinance.recommendationsBySymbol(symbol);
            const expiresAt = Date.now() + CACHE_TTLS.RECOMMENDATIONS;
            await this.cacheManager.set(cacheKey, { value: data, expiresAt }, CACHE_TTLS.RECOMMENDATIONS);
            return data;
        } catch (error) {
            this.logger.error(`Error fetching recommendations for ${symbol}:`, error);
            throw error;
        }
    }

    async getEtfInsights(symbol: string) {
        const cacheKey = `etf_insights_${symbol}`;
        const cached: any = await this.cacheManager.get(cacheKey);

        if (cached) {
            const expiry = new Date(cached.expiresAt).toLocaleTimeString();
            this.logger.log(`Cache HIT [Insights]: ${symbol} (Expires at: ${expiry})`);
            return cached.value;
        }

        this.logger.log(`Cache MISS [Insights]: ${symbol} - Fetching from Yahoo Finance`);
        try {
            const data = await this.yahooFinance.insights(symbol);
            const expiresAt = Date.now() + CACHE_TTLS.INSIGHTS;
            await this.cacheManager.set(cacheKey, { value: data, expiresAt }, CACHE_TTLS.INSIGHTS);
            return data;
        } catch (error) {
            this.logger.error(`Error fetching insights for ${symbol}:`, error);
            throw error;
        }
    }

    async getEtfHoldings(symbol: string) {
        const cacheKey = `etf_holdings_${symbol}`;
        const cached: any = await this.cacheManager.get(cacheKey);

        if (cached) {
            const expiry = new Date(cached.expiresAt).toLocaleTimeString();
            this.logger.log(`Cache HIT [Holdings]: ${symbol} (Expires at: ${expiry})`);
            return cached.value;
        }

        this.logger.log(`Cache MISS [Holdings]: ${symbol} - Fetching from Yahoo Finance`);
        try {
            const data = await this.yahooFinance.quoteSummary(symbol, {
                modules: ['topHoldings', 'fundPerformance', 'assetProfile'],
            });
            const expiresAt = Date.now() + CACHE_TTLS.HOLDINGS;
            await this.cacheManager.set(cacheKey, { value: data, expiresAt }, CACHE_TTLS.HOLDINGS);
            return data;
        } catch (error) {
            this.logger.error(`Error fetching holdings for ${symbol}:`, error);
            throw error;
        }
    }
}
