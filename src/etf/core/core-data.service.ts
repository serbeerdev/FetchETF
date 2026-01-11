import { Injectable } from '@nestjs/common';
import yahooFinance from 'yahoo-finance2';

@Injectable()
export class CoreDataService {
    async getEtfInfo(symbol: string) {
        try {
            return await yahooFinance.quoteSummary(symbol, { modules: ['price', 'summaryProfile', 'fundProfile'] });
        } catch (error) {
            console.error(`Error fetching info for ${symbol}:`, error);
            throw error;
        }
    }

    async getEtfPrice(symbol: string) {
        try {
            return await yahooFinance.quote(symbol);
        } catch (error) {
            console.error(`Error fetching price for ${symbol}:`, error);
            throw error;
        }
    }
}
