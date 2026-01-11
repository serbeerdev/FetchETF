import { Injectable } from '@nestjs/common';
import yahooFinance from 'yahoo-finance2';

@Injectable()
export class HistoryService {
    async getEtfHistory(symbol: string, query: { interval?: string; from?: string; to?: string; range?: string }) {
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

            return await yahooFinance.chart(symbol, queryOptions);
        } catch (error) {
            console.error(`Error fetching history for ${symbol}:`, error);
            throw error;
        }
    }

    async getEtfDividends(symbol: string) {
        try {
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
}
