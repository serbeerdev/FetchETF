import { Injectable } from '@nestjs/common';
import yahooFinance from 'yahoo-finance2';

@Injectable()
export class SearchService {
    async searchEtf(query: string) {
        try {
            return await yahooFinance.search(query);
        } catch (error) {
            console.error(`Error searching for ${query}:`, error);
            throw error;
        }
    }
}
