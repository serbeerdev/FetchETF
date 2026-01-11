import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CACHE_TTLS } from '../../common/constants/cache.constants';

@Injectable()
export class CoreDataService {
    private readonly logger = new Logger(CoreDataService.name);

    constructor(
        @Inject('YAHOO_FINANCE_INSTANCE') private readonly yahooFinance: any,
        @Inject(CACHE_MANAGER) private cacheManager: any,
    ) { }

    async getEtfInfo(symbol: string) {
        const cacheKey = `etf_info_${symbol}`;
        const cached: any = await this.cacheManager.get(cacheKey);

        if (cached) {
            const expiry = new Date(cached.expiresAt).toLocaleString();
            this.logger.log(`Cache HIT [Info]: ${symbol} (Expires at: ${expiry})`);
            return cached.value;
        }

        this.logger.log(`Cache MISS [Info]: ${symbol} - Fetching from Yahoo Finance`);
        try {
            const data = await this.yahooFinance.quoteSummary(symbol, { modules: ['price', 'summaryProfile', 'fundProfile'] });
            const expiresAt = Date.now() + CACHE_TTLS.INFO;
            await this.cacheManager.set(cacheKey, { value: data, expiresAt }, CACHE_TTLS.INFO);
            return data;
        } catch (error) {
            this.logger.error(`Error fetching info for ${symbol}:`, error);
            throw error;
        }
    }

    async getEtfPrice(symbol: string) {
        const cacheKey = `etf_price_${symbol}`;
        const cached: any = await this.cacheManager.get(cacheKey);

        if (cached) {
            const expiry = new Date(cached.expiresAt).toLocaleString();
            this.logger.log(`Cache HIT [Price]: ${symbol} (Expires at: ${expiry})`);
            return cached.value;
        }

        this.logger.log(`Cache MISS [Price]: ${symbol} - Fetching from Yahoo Finance`);
        try {
            const data = await this.yahooFinance.quote(symbol);
            const expiresAt = Date.now() + CACHE_TTLS.PRICE;
            await this.cacheManager.set(cacheKey, { value: data, expiresAt }, CACHE_TTLS.PRICE);
            return data;
        } catch (error) {
            this.logger.error(`Error fetching price for ${symbol}:`, error);
            throw error;
        }
    }
}
