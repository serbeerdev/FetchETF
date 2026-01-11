import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class SearchService {
    constructor(
        @Inject('YAHOO_FINANCE_INSTANCE') private readonly yahooFinance: any,
        @Inject(CACHE_MANAGER) private cacheManager: any,
    ) { }

    async searchEtf(query: string) {
        const cacheKey = `etf_search_${query}`;
        const cachedData = await this.cacheManager.get(cacheKey);
        if (cachedData) return cachedData;

        try {
            const data = await this.yahooFinance.search(query);
            await this.cacheManager.set(cacheKey, data, 5 * 60 * 1000); // 5 minutes
            return data;
        } catch (error) {
            console.error(`Error searching for ${query}:`, error);
            throw error;
        }
    }
}
