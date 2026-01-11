import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class SearchService {
    constructor(@Inject('YAHOO_FINANCE_INSTANCE') private readonly yahooFinance: any) { }

    async searchEtf(query: string) {
        try {
            return await this.yahooFinance.search(query);
        } catch (error) {
            console.error(`Error searching for ${query}:`, error);
            throw error;
        }
    }
}
