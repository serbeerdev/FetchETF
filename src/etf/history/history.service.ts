import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class HistoryService {
    constructor(
        @Inject('YAHOO_FINANCE_INSTANCE') private readonly yahooFinance: any,
        @Inject(CACHE_MANAGER) private cacheManager: any,
    ) { }

    async getEtfHistory(symbol: string, query: { interval?: string; from?: string; to?: string; range?: string }) {
        const cacheKey = `etf_history_${symbol}_${JSON.stringify(query)}`;
        const cachedData = await this.cacheManager.get(cacheKey);
        if (cachedData) return cachedData;

        try {
            const queryOptions: any = {
                interval: query.interval,
            };

            if (query.from || query.to) {
                if (query.from) queryOptions.period1 = query.from;
                if (query.to) {
                    queryOptions.period2 = query.to;
                    if (query.from === query.to) {
                        const date = new Date(query.to);
                        date.setDate(date.getDate() + 1);
                        queryOptions.period2 = date.toISOString().split('T')[0];
                    }
                }
            } else if (query.range) {
                queryOptions.range = query.range;
            }

            const data = await this.yahooFinance.chart(symbol, queryOptions);
            await this.cacheManager.set(cacheKey, data, 60 * 60 * 1000); // 1 hour
            return data;
        } catch (error) {
            console.error(`Error fetching history for ${symbol}:`, error);
            throw error;
        }
    }

    async getEtfDividends(symbol: string) {
        const cacheKey = `etf_dividends_${symbol}`;
        const cachedData = await this.cacheManager.get(cacheKey);
        if (cachedData) return cachedData;

        try {
            const data = await this.yahooFinance.historical(symbol, {
                period1: '1970-01-01',
                period2: new Date().toISOString().split('T')[0],
                events: 'dividends',
            });
            await this.cacheManager.set(cacheKey, data, 60 * 60 * 1000); // 1 hour
            return data;
        } catch (error) {
            console.error(`Error fetching dividends for ${symbol}:`, error);
            throw error;
        }
    }
}
