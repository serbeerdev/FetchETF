import { Injectable } from '@nestjs/common';
import YahooFinance from 'yahoo-finance2';
import { HistoryQueryDto } from './dto/history-query.dto';

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
    async getEtfHistory(symbol: string, query: { interval?: string; from?: string; to?: string; range?: string }) {
        try {
            const queryOptions: any = {
                interval: query.interval,
            };

            // Cannot use both range and period1/period2. 
            // If specific dates are provided, use them. Otherwise, check for range.
            if (query.from || query.to) {
                if (query.from) queryOptions.period1 = query.from;
                if (query.to) {
                    queryOptions.period2 = query.to;
                    // If from === to, yahoo-finance2 errors. Assume user wants the full day.
                    // We need to ensure period2 is after period1.
                    if (query.from === query.to) {
                        const date = new Date(query.to);
                        date.setDate(date.getDate() + 1);
                        queryOptions.period2 = date.toISOString().split('T')[0]; // Keep YYYY-MM-DD format if possible, or ISO
                    }
                }
            } else if (query.range) {
                queryOptions.range = query.range;
            }

            // yahoo-finance2 'historical' is deprecated and strict about intervals (only 1d, 1wk, 1mo).
            // 'chart' supports intraday intervals (1m, 5m, 1h, etc.) and is the recommended replacement.
            return await yahooFinance.chart(symbol, queryOptions);
        } catch (error) {
            console.error(`Error fetching history for ${symbol}:`, error);
            throw error;
        }
    }

    async getEtfNews(symbol: string) {
        try {
            const result = await yahooFinance.search(symbol, { newsCount: 10 });
            return result.news;
        } catch (error) {
            console.error(`Error fetching news for ${symbol}:`, error);
            throw error;
        }
    }

    async getEtfRecommendations(symbol: string) {
        try {
            return await yahooFinance.recommendationsBySymbol(symbol);
        } catch (error) {
            console.error(`Error fetching recommendations for ${symbol}:`, error);
            throw error;
        }
    }

    async getEtfDividends(symbol: string) {
        try {
            // Fetch all historical dividends since the beginning
            return await yahooFinance.historical(symbol, {
                period1: '1970-01-01',
                period2: new Date().toISOString().split('T')[0],
                events: 'dividends',
            });
        } catch (error) {
            console.error(`Error fetching dividends for ${symbol}:`, error);
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
