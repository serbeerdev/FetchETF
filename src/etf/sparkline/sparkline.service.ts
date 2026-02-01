import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CACHE_TTLS, CACHE_LABELS } from '../../common/constants/cache.constants';
import { SparklineQueryDto, SparklinePeriod } from '../dto/sparkline-query.dto';

export interface SparklineDataPoint {
  t: number; // timestamp in seconds
  p: number; // price
}

export interface SparklineResponse {
  symbol: string;
  period: string;
  data: SparklineDataPoint[];
}

@Injectable()
export class SparklineService {
  private readonly logger = new Logger(SparklineService.name);

  constructor(
    @Inject('YAHOO_FINANCE_INSTANCE') private readonly yahooFinance: any,
    @Inject(CACHE_MANAGER) private cacheManager: any,
  ) {}

  async getSparkline(
    symbol: string,
    query: SparklineQueryDto,
  ): Promise<SparklineResponse> {
    const period = query.period || SparklinePeriod.ONE_MONTH;
    const points = query.points || 60;

    const cacheKey = `etf_sparkline_${symbol}_${period}_${points}`;
    const cached: any = await this.cacheManager.get(cacheKey);

    if (cached) {
      const expiry = new Date(cached.expiresAt).toLocaleString();
      this.logger.log(
        `Cache HIT [Sparkline]: ${symbol} (Cache: ${CACHE_LABELS.SPARKLINE}, Expires at: ${expiry})`,
      );
      return cached.value;
    }

    this.logger.log(
      `Cache MISS [Sparkline]: ${symbol} - Fetching and resampling data`,
    );

    try {
      const queryOptions = this.getQueryOptionsForPeriod(period);
      const historyData = await this.yahooFinance.chart(symbol, queryOptions);

      if (
        !historyData ||
        !historyData.quotes ||
        historyData.quotes.length === 0
      ) {
        throw new NotFoundException(`No data found for symbol: ${symbol}`);
      }

      const rawData = historyData.quotes.filter(
        (quote: any) => quote.close !== null,
      );
      const resampledData = this.resampleData(rawData, period, points);

      const response: SparklineResponse = {
        symbol,
        period,
        data: resampledData,
      };

      const ttl = CACHE_TTLS.SPARKLINE;
      const expiresAt = Date.now() + ttl;
      await this.cacheManager.set(
        cacheKey,
        { value: response, expiresAt },
        ttl,
      );

      return response;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching sparkline data for ${symbol}:`, error);
      throw error;
    }
  }

  private getQueryOptionsForPeriod(period: SparklinePeriod): any {
    const now = new Date();
    const period1 = new Date();

    switch (period) {
      case SparklinePeriod.ONE_MONTH:
        period1.setMonth(now.getMonth() - 1);
        break;
      case SparklinePeriod.THREE_MONTHS:
        period1.setMonth(now.getMonth() - 3);
        break;
      case SparklinePeriod.SIX_MONTHS:
        period1.setMonth(now.getMonth() - 6);
        break;
      case SparklinePeriod.ONE_YEAR:
        period1.setFullYear(now.getFullYear() - 1);
        break;
      default:
        period1.setMonth(now.getMonth() - 1);
    }

    return {
      period1: period1.toISOString().split('T')[0], // YYYY-MM-DD format
      period2: now.toISOString().split('T')[0],
      interval: '1d',
    };
  }

  private resampleData(
    rawData: any[],
    period: SparklinePeriod,
    maxPoints: number,
  ): SparklineDataPoint[] {
    // If data is already within the max points limit, return as-is
    if (rawData.length <= maxPoints) {
      return rawData
        .map((quote: any) => ({
          t: Math.floor(new Date(quote.date).getTime() / 1000),
          p: quote.close,
        }))
        .sort((a, b) => a.t - b.t);
    }

    // For short periods (1m, 3m): return one point per day (most recent first, then reverse)
    if (
      period === SparklinePeriod.ONE_MONTH ||
      period === SparklinePeriod.THREE_MONTHS
    ) {
      return rawData
        .slice(-maxPoints)
        .map((quote: any) => ({
          t: Math.floor(new Date(quote.date).getTime() / 1000),
          p: quote.close,
        }))
        .sort((a, b) => a.t - b.t);
    }

    // For long periods (6m, 1y): group by week
    const weeklyData = this.groupByWeek(rawData);
    return weeklyData
      .map((weekData: any[]) => {
        const lastQuote = weekData[weekData.length - 1];
        return {
          t: Math.floor(new Date(lastQuote.date).getTime() / 1000),
          p: lastQuote.close,
        };
      })
      .sort((a, b) => a.t - b.t);
  }

  private groupByWeek(data: any[]): any[][] {
    const weeksMap = new Map<number, any[]>();

    data.forEach((quote: any) => {
      const date = new Date(quote.date);
      const weekKey = this.getWeekKey(date);

      if (!weeksMap.has(weekKey)) {
        weeksMap.set(weekKey, []);
      }
      weeksMap.get(weekKey)!.push(quote);
    });

    return Array.from(weeksMap.values());
  }

  private getWeekKey(date: Date): number {
    // Get ISO week number and year to create a unique week identifier
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return (
      d.getUTCFullYear() * 100 +
      Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
    );
  }
}
