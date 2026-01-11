import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class DiscoverService {
    constructor(
        @Inject('YAHOO_FINANCE_INSTANCE') private readonly yahooFinance: any,
        @Inject(CACHE_MANAGER) private cacheManager: any,
    ) { }

    private readonly featuredSymbols = ['ESGV', 'QQQM', 'FTEC', 'SOXQ', 'VGK', 'IAUM', 'KOMP', 'EPP'];

    async getFeaturedEtfs() {
        const cacheKey = 'etf_featured_list';
        const cachedData = await this.cacheManager.get(cacheKey);
        if (cachedData) return cachedData;

        try {
            const data = await this.yahooFinance.quote(this.featuredSymbols);
            await this.cacheManager.set(cacheKey, data, 60 * 60 * 1000); // 1 hour
            return data;
        } catch (error) {
            console.error('Error fetching featured ETFs:', error);
            throw error;
        }
    }
}
