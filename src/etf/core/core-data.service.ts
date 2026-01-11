import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as cacheManager from 'cache-manager';

@Injectable()
export class CoreDataService {
    constructor(
        @Inject('YAHOO_FINANCE_INSTANCE') private readonly yahooFinance: any,
        @Inject(CACHE_MANAGER) private cacheManager: any,
    ) { }

    async getEtfInfo(symbol: string) {
        const cacheKey = `etf_info_${symbol}`;
        const cachedData = await this.cacheManager.get(cacheKey);
        if (cachedData) return cachedData;

        try {
            const data = await this.yahooFinance.quoteSummary(symbol, { modules: ['price', 'summaryProfile', 'fundProfile'] });
            await this.cacheManager.set(cacheKey, data, 24 * 60 * 60 * 1000); // 24 hours
            return data;
        } catch (error) {
            console.error(`Error fetching info for ${symbol}:`, error);
            throw error;
        }
    }

    async getEtfPrice(symbol: string) {
        const cacheKey = `etf_price_${symbol}`;
        const cachedData = await this.cacheManager.get(cacheKey);
        if (cachedData) return cachedData;

        try {
            const data = await this.yahooFinance.quote(symbol);
            await this.cacheManager.set(cacheKey, data, 60 * 1000); // 60 seconds
            return data;
        } catch (error) {
            console.error(`Error fetching price for ${symbol}:`, error);
            throw error;
        }
    }
}
