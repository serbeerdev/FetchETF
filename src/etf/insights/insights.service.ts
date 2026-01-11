import { Injectable } from '@nestjs/common';
import yahooFinance from 'yahoo-finance2';

@Injectable()
export class InsightsService {
    async getEtfRecommendations(symbol: string) {
        try {
            return await yahooFinance.recommendationsBySymbol(symbol);
        } catch (error) {
            console.error(`Error fetching recommendations for ${symbol}:`, error);
            throw error;
        }
    }

    async getEtfInsights(symbol: string) {
        try {
            return await yahooFinance.insights(symbol);
        } catch (error) {
            console.error(`Error fetching insights for ${symbol}:`, error);
            throw error;
        }
    }

    async getEtfHoldings(symbol: string) {
        try {
            return await yahooFinance.quoteSummary(symbol, {
                modules: ['topHoldings', 'fundPerformance', 'assetProfile'],
            });
        } catch (error) {
            console.error(`Error fetching holdings for ${symbol}:`, error);
            throw error;
        }
    }
}
