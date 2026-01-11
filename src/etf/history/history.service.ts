import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CACHE_TTLS } from '../../common/constants/cache.constants';

@Injectable()
export class HistoryService {
    private readonly logger = new Logger(HistoryService.name);

    constructor(
        @Inject('YAHOO_FINANCE_INSTANCE') private readonly yahooFinance: any,
        @Inject(CACHE_MANAGER) private cacheManager: any,
    ) { }

    async getEtfHistory(symbol: string, query: { interval?: string; from?: string; to?: string; range?: string }) {
        const cacheKey = `etf_history_${symbol}_${JSON.stringify(query)}`;
        const cached: any = await this.cacheManager.get(cacheKey);

        if (cached) {
            const expiry = new Date(cached.expiresAt).toLocaleTimeString();
            this.logger.log(`Cache HIT [History]: ${symbol} (Expires at: ${expiry})`);
            return cached.value;
        }

        this.logger.log(`Cache MISS [History]: ${symbol} - Fetching from Yahoo Finance`);
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
            const expiresAt = Date.now() + CACHE_TTLS.HISTORY;
            await this.cacheManager.set(cacheKey, { value: data, expiresAt }, CACHE_TTLS.HISTORY);
            return data;
        } catch (error) {
            this.logger.error(`Error fetching history for ${symbol}:`, error);
            throw error;
        }
    }

    async getEtfDividends(symbol: string) {
        const cacheKey = `etf_dividends_${symbol}`;
        const cached: any = await this.cacheManager.get(cacheKey);

        if (cached) {
            const expiry = new Date(cached.expiresAt).toLocaleTimeString();
            this.logger.log(`Cache HIT [Dividends]: ${symbol} (Expires at: ${expiry})`);
            return cached.value;
        }

        this.logger.log(`Cache MISS [Dividends]: ${symbol} - Fetching from Yahoo Finance`);
        try {
            const data = await this.yahooFinance.historical(symbol, {
                period1: '1970-01-01',
                period2: new Date().toISOString().split('T')[0],
                events: 'dividends',
            });
            const expiresAt = Date.now() + CACHE_TTLS.DIVIDENDS;
            await this.cacheManager.set(cacheKey, { value: data, expiresAt }, CACHE_TTLS.DIVIDENDS);
            return data;
        } catch (error) {
            this.logger.error(`Error fetching dividends for ${symbol}:`, error);
            throw error;
        }
    }
}
