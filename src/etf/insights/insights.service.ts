import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class InsightsService {
    constructor(@Inject('YAHOO_FINANCE_INSTANCE') private readonly yahooFinance: any) { }

    async getEtfRecommendations(symbol: string) {
        try {
            return await this.yahooFinance.recommendationsBySymbol(symbol);
        } catch (error) {
            console.error(`Error fetching recommendations for ${symbol}:`, error);
            throw error;
        }
    }

    async getEtfInsights(symbol: string) {
        try {
            return await this.yahooFinance.insights(symbol);
        } catch (error) {
            console.error(`Error fetching insights for ${symbol}:`, error);
            throw error;
        }
    }

    async getEtfHoldings(symbol: string) {
        try {
            return await this.yahooFinance.quoteSummary(symbol, {
                modules: ['topHoldings', 'fundPerformance', 'assetProfile'],
            });
        } catch (error) {
            console.error(`Error fetching holdings for ${symbol}:`, error);
            throw error;
        }
    }
}
