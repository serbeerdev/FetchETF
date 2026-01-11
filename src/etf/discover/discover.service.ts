import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class DiscoverService {
    constructor(@Inject('YAHOO_FINANCE_INSTANCE') private readonly yahooFinance: any) { }

    private readonly featuredSymbols = ['ESGV', 'QQQM', 'FTEC', 'SOXQ', 'VGK', 'IAUM', 'KOMP', 'EPP'];

    async getFeaturedEtfs() {
        try {
            return await this.yahooFinance.quote(this.featuredSymbols);
        } catch (error) {
            console.error('Error fetching featured ETFs:', error);
            throw error;
        }
    }
}
