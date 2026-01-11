import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CoreDataService {
    private readonly logger = new Logger(CoreDataService.name);

    constructor(
        @Inject('YAHOO_FINANCE_INSTANCE') private readonly yahooFinance: any,
        @Inject(CACHE_MANAGER) private cacheManager: any,
    ) { }

    async getEtfInfo(symbol: string) {
        const cacheKey = `etf_info_${symbol}`;
        const cachedData = await this.cacheManager.get(cacheKey);

        if (cachedData) {
            this.logger.log(`Cache HIT [Info]: ${symbol}`);
            return cachedData;
        }

        this.logger.log(`Cache MISS [Info]: ${symbol} - Fetching from Yahoo Finance`);
        try {
            const data = await this.yahooFinance.quoteSummary(symbol, { modules: ['price', 'summaryProfile', 'fundProfile'] });
            await this.cacheManager.set(cacheKey, data, 24 * 60 * 60 * 1000); // 24 hours
            return data;
        } catch (error) {
            this.logger.error(`Error fetching info for ${symbol}:`, error);
            throw error;
        }
    }

    async getEtfPrice(symbol: string) {
        const cacheKey = `etf_price_${symbol}`;
        const cachedData = await this.cacheManager.get(cacheKey);

        if (cachedData) {
            this.logger.log(`Cache HIT [Price]: ${symbol}`);
            return cachedData;
        }

        this.logger.log(`Cache MISS [Price]: ${symbol} - Fetching from Yahoo Finance`);
        try {
            const data = await this.yahooFinance.quote(symbol);
            await this.cacheManager.set(cacheKey, data, 60 * 1000); // 60 seconds
            return data;
        } catch (error) {
            this.logger.error(`Error fetching price for ${symbol}:`, error);
            throw error;
        }
    }
}
