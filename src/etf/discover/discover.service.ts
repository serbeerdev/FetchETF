import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CACHE_TTLS } from '../../common/constants/cache.constants';

@Injectable()
export class DiscoverService {
    private readonly logger = new Logger(DiscoverService.name);

    constructor(
        @Inject('YAHOO_FINANCE_INSTANCE') private readonly yahooFinance: any,
        @Inject(CACHE_MANAGER) private cacheManager: any,
    ) { }

    private readonly featuredSymbols = ['ESGV', 'QQQM', 'FTEC', 'SOXQ', 'VGK', 'IAUM', 'KOMP', 'EPP'];

    async getFeaturedEtfs() {
        const cacheKey = 'etf_featured_list';
        const cachedData = await this.cacheManager.get(cacheKey);

        if (cachedData) {
            this.logger.log('Cache HIT [Discover]: Featured ETFs list');
            return cachedData;
        }

        this.logger.log('Cache MISS [Discover]: Featured ETFs list - Fetching from Yahoo Finance');
        try {
            const data = await this.yahooFinance.quote(this.featuredSymbols);
            await this.cacheManager.set(cacheKey, data, CACHE_TTLS.FEATURED_LIST);
            return data;
        } catch (error) {
            this.logger.error('Error fetching featured ETFs:', error);
            throw error;
        }
    }
}
