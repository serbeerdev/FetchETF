import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class CoreDataService {
    constructor(@Inject('YAHOO_FINANCE_INSTANCE') private readonly yahooFinance: any) { }

    async getEtfInfo(symbol: string) {
        try {
            return await this.yahooFinance.quoteSummary(symbol, { modules: ['price', 'summaryProfile', 'fundProfile'] });
        } catch (error) {
            console.error(`Error fetching info for ${symbol}:`, error);
            throw error;
        }
    }

    async getEtfPrice(symbol: string) {
        try {
            return await this.yahooFinance.quote(symbol);
        } catch (error) {
            console.error(`Error fetching price for ${symbol}:`, error);
            throw error;
        }
    }
}
