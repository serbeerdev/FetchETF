import { Injectable } from '@nestjs/common';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

@Injectable()
export class EtfService {
    async getEtfPrice(symbol: string) {
        try {
            return await yahooFinance.quote(symbol);
        } catch (error) {
            console.error(`Error fetching price for ${symbol}:`, error);
            throw error;
        }
    }

    async getEtfInfo(symbol: string) {
        try {
            // quoteSummary provides rich data modules. 'price' and 'summaryProfile' are common useful ones.
            return await yahooFinance.quoteSummary(symbol, { modules: ['price', 'summaryProfile', 'fundProfile'] });
        } catch (error) {
            console.error(`Error fetching info for ${symbol}:`, error);
            throw error;
        }
    }

    async searchEtf(query: string) {
        try {
            return await yahooFinance.search(query);
        } catch (error) {
            console.error(`Error searching for ${query}:`, error);
            throw error;
        }
    }
}
