import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SparklineService } from './sparkline.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { SparklinePeriod } from '../dto/sparkline-query.dto';

describe('SparklineService', () => {
  let service: SparklineService;
  let cacheManager: any;
  let yahooFinance: any;

  const mockSymbol = 'SPY';
  const mockQuotes = [
    { date: '2024-01-01', close: 470.5 },
    { date: '2024-01-02', close: 471.2 },
    { date: '2024-01-03', close: 471.8 },
    { date: '2024-01-04', close: 472.1 },
    { date: '2024-01-05', close: 472.5 },
  ];

  beforeEach(async () => {
    cacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    };

    yahooFinance = {
      chart: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SparklineService,
        { provide: CACHE_MANAGER, useValue: cacheManager },
        { provide: 'YAHOO_FINANCE_INSTANCE', useValue: yahooFinance },
      ],
    }).compile();

    service = module.get<SparklineService>(SparklineService);
  });

  describe('getSparkline', () => {
    it('should return cached results if available', async () => {
      const expiresAt = Date.now() + 1000;
      const cachedResponse = {
        symbol: mockSymbol,
        period: SparklinePeriod.ONE_MONTH,
        data: [{ t: 1704067200, p: 470.5 }],
      };
      cacheManager.get.mockResolvedValue({ value: cachedResponse, expiresAt });

      const result = await service.getSparkline(mockSymbol, {
        period: SparklinePeriod.ONE_MONTH,
        points: 60,
      });

      expect(result).toEqual(cachedResponse);
      expect(yahooFinance.chart).not.toHaveBeenCalled();
      expect(cacheManager.set).not.toHaveBeenCalled();
    });

    it('should fetch and cache data on cache miss', async () => {
      cacheManager.get.mockResolvedValue(null);
      yahooFinance.chart.mockResolvedValue({
        quotes: mockQuotes,
      });

      const result = await service.getSparkline(mockSymbol, {
        period: SparklinePeriod.ONE_MONTH,
        points: 60,
      });

      expect(result.symbol).toBe(mockSymbol);
      expect(result.period).toBe(SparklinePeriod.ONE_MONTH);
      expect(result.data).toHaveLength(5);
      expect(result.data[0]).toHaveProperty('t');
      expect(result.data[0]).toHaveProperty('p');
      expect(cacheManager.set).toHaveBeenCalled();
    });

    it('should throw NotFoundException when symbol has no data', async () => {
      cacheManager.get.mockResolvedValue(null);
      yahooFinance.chart.mockResolvedValue({
        quotes: [],
      });

      await expect(
        service.getSparkline('INVALID', {
          period: SparklinePeriod.ONE_MONTH,
          points: 60,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw error when Yahoo Finance API fails', async () => {
      cacheManager.get.mockResolvedValue(null);
      yahooFinance.chart.mockRejectedValue(new Error('API Error'));

      await expect(
        service.getSparkline(mockSymbol, {
          period: SparklinePeriod.ONE_MONTH,
          points: 60,
        }),
      ).rejects.toThrow('API Error');
    });

    it('should filter out null close prices', async () => {
      cacheManager.get.mockResolvedValue(null);
      yahooFinance.chart.mockResolvedValue({
        quotes: [
          ...mockQuotes,
          { date: '2024-01-06', close: null },
          { date: '2024-01-07', close: 473.0 },
        ],
      });

      const result = await service.getSparkline(mockSymbol, {
        period: SparklinePeriod.ONE_MONTH,
        points: 60,
      });

      expect(result.data).toHaveLength(6);
    });

    it('should use default period and points when not provided', async () => {
      cacheManager.get.mockResolvedValue(null);
      yahooFinance.chart.mockResolvedValue({
        quotes: mockQuotes,
      });

      await service.getSparkline(mockSymbol, {});

      expect(yahooFinance.chart).toHaveBeenCalledWith(
        mockSymbol,
        expect.objectContaining({
          interval: '1d',
        }),
      );
      expect(yahooFinance.chart).toHaveBeenCalledWith(
        mockSymbol,
        expect.objectContaining({
          period1: expect.any(String),
          period2: expect.any(String),
        }),
      );
    });

    it('should use correct date range for each period', async () => {
      cacheManager.get.mockResolvedValue(null);
      yahooFinance.chart.mockResolvedValue({
        quotes: mockQuotes,
      });

      const periods = [
        SparklinePeriod.ONE_MONTH,
        SparklinePeriod.THREE_MONTHS,
        SparklinePeriod.SIX_MONTHS,
        SparklinePeriod.ONE_YEAR,
      ];

      for (const period of periods) {
        await service.getSparkline(mockSymbol, {
          period: period as SparklinePeriod,
          points: 60,
        });

        expect(yahooFinance.chart).toHaveBeenCalledWith(
          mockSymbol,
          expect.objectContaining({
            interval: '1d',
            period1: expect.any(String),
            period2: expect.any(String),
          }),
        );
      }
    });
  });

  describe('resampleData', () => {
    it('should return all data when within max points limit', async () => {
      cacheManager.get.mockResolvedValue(null);
      yahooFinance.chart.mockResolvedValue({
        quotes: mockQuotes,
      });

      const result = await service.getSparkline(mockSymbol, {
        period: SparklinePeriod.ONE_MONTH,
        points: 10,
      });

      expect(result.data).toHaveLength(5);
      expect(result.data[0].t).toBeLessThan(result.data[4].t);
    });

    it('should resample to max points for short periods', async () => {
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        date: `2024-01-${String(i + 1).padStart(2, '0')}`,
        close: 470 + i * 0.1,
      }));

      cacheManager.get.mockResolvedValue(null);
      yahooFinance.chart.mockResolvedValue({
        quotes: largeDataset,
      });

      const result = await service.getSparkline(mockSymbol, {
        period: SparklinePeriod.ONE_MONTH,
        points: 30,
      });

      expect(result.data).toHaveLength(30);
    });

    it('should return data in chronological order', async () => {
      cacheManager.get.mockResolvedValue(null);
      yahooFinance.chart.mockResolvedValue({
        quotes: mockQuotes,
      });

      const result = await service.getSparkline(mockSymbol, {
        period: SparklinePeriod.ONE_MONTH,
        points: 60,
      });

      for (let i = 1; i < result.data.length; i++) {
        expect(result.data[i].t).toBeGreaterThan(result.data[i - 1].t);
      }
    });

    it('should convert timestamps to seconds', async () => {
      cacheManager.get.mockResolvedValue(null);
      yahooFinance.chart.mockResolvedValue({
        quotes: mockQuotes,
      });

      const result = await service.getSparkline(mockSymbol, {
        period: SparklinePeriod.ONE_MONTH,
        points: 60,
      });

      const expectedTimestamp = Math.floor(
        new Date('2024-01-01').getTime() / 1000,
      );
      expect(result.data[0].t).toBe(expectedTimestamp);
      expect(result.data[0].t).toBeLessThan(10000000000); // Ensure it's seconds, not milliseconds
    });
  });

  describe('caching', () => {
    it('should use correct cache TTL for each period', async () => {
      cacheManager.get.mockResolvedValue(null);
      yahooFinance.chart.mockResolvedValue({
        quotes: mockQuotes,
      });

      const ttlTests = [
        { period: SparklinePeriod.ONE_MONTH, expectedTTL: 5 * 60 * 1000 },
        { period: SparklinePeriod.THREE_MONTHS, expectedTTL: 5 * 60 * 1000 },
        { period: SparklinePeriod.SIX_MONTHS, expectedTTL: 60 * 60 * 1000 },
        { period: SparklinePeriod.ONE_YEAR, expectedTTL: 60 * 60 * 1000 },
      ];

      for (const { period, expectedTTL } of ttlTests) {
        await service.getSparkline(mockSymbol, { period, points: 60 });

        const cacheCall = cacheManager.set.mock.calls.find((call) =>
          call[0].includes(`sparkline_${mockSymbol}_${period}`),
        );
        expect(cacheCall?.[2]).toBe(expectedTTL);
      }
    });

    it('should include points in cache key', async () => {
      cacheManager.get.mockResolvedValue(null);
      yahooFinance.chart.mockResolvedValue({
        quotes: mockQuotes,
      });

      await service.getSparkline(mockSymbol, {
        period: SparklinePeriod.ONE_MONTH,
        points: 30,
      });

      expect(cacheManager.get).toHaveBeenCalledWith('etf_sparkline_SPY_1m_30');
    });
  });
});
