import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CACHE_TTLS } from '../../common/constants/cache.constants';

@Injectable()
export class SearchService {
    private readonly logger = new Logger(SearchService.name);

    constructor(
        @Inject('YAHOO_FINANCE_INSTANCE') private readonly yahooFinance: any,
        @Inject(CACHE_MANAGER) private cacheManager: any,
    ) { }

    async searchEtf(query: string) {
        const cacheKey = `etf_search_${query}`;
        const cachedData = await this.cacheManager.get(cacheKey);

        if (cachedData) {
            this.logger.log(`Cache HIT [Search]: ${query}`);
            return cachedData;
        }

        this.logger.log(`Cache MISS [Search]: ${query} - Fetching from Yahoo Finance`);
        try {
            const data = await this.yahooFinance.search(query);
            await this.cacheManager.set(cacheKey, data, CACHE_TTLS.SEARCH);
            return data;
        } catch (error) {
            this.logger.error(`Error searching for ${query}:`, error);
            throw error;
        }
    }
}
