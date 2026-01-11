import { Test, TestingModule } from '@nestjs/testing';
import { HistoryService } from './history.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CACHE_TTLS } from '../../common/constants/cache.constants';

describe('HistoryService', () => {
    let service: HistoryService;
    let cacheManager: any;
    let yahooFinance: any;

    const mockSymbol = 'SPY';

    beforeEach(async () => {
        cacheManager = {
            get: jest.fn(),
            set: jest.fn(),
        };

        yahooFinance = {
            chart: jest.fn(),
            historical: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HistoryService,
                { provide: CACHE_MANAGER, useValue: cacheManager },
                { provide: 'YAHOO_FINANCE_INSTANCE', useValue: yahooFinance },
            ],
        }).compile();

        service = module.get<HistoryService>(HistoryService);
    });

    describe('getEtfHistory', () => {
        const mockQuery = { interval: '1d', range: '1mo' };
        const mockChartData = { quotes: [] };

        it('should return cached chart data if available', async () => {
            const expiresAt = Date.now() + 10000;
            cacheManager.get.mockResolvedValue({ value: mockChartData, expiresAt });

            const result = await service.getEtfHistory(mockSymbol, mockQuery);

            expect(result).toEqual(mockChartData);
            expect(yahooFinance.chart).not.toHaveBeenCalled();
        });

        it('should call yahooFinance.chart with transformed query (range)', async () => {
            cacheManager.get.mockResolvedValue(null);
            yahooFinance.chart.mockResolvedValue(mockChartData);

            await service.getEtfHistory(mockSymbol, mockQuery);

            expect(yahooFinance.chart).toHaveBeenCalledWith(mockSymbol, {
                interval: '1d',
                range: '1mo',
            });
            expect(cacheManager.set).toHaveBeenCalledWith(
                expect.stringContaining(mockSymbol),
                expect.objectContaining({ value: mockChartData }),
                CACHE_TTLS.HISTORY
            );
        });

        it('should call yahooFinance.chart with transformed query (from/to)', async () => {
            cacheManager.get.mockResolvedValue(null);
            yahooFinance.chart.mockResolvedValue(mockChartData);
            const dateQuery = { from: '2024-01-01', to: '2024-01-10' };

            await service.getEtfHistory(mockSymbol, dateQuery);

            expect(yahooFinance.chart).toHaveBeenCalledWith(mockSymbol, {
                interval: undefined,
                period1: '2024-01-01',
                period2: '2024-01-10',
            });
        });

        it('should adjust period2 if from equals to', async () => {
            cacheManager.get.mockResolvedValue(null);
            yahooFinance.chart.mockResolvedValue(mockChartData);
            const sameDateQuery = { from: '2024-01-01', to: '2024-01-01' };

            await service.getEtfHistory(mockSymbol, sameDateQuery);

            expect(yahooFinance.chart).toHaveBeenCalledWith(mockSymbol, {
                interval: undefined,
                period1: '2024-01-01',
                period2: '2024-01-02', // Adjusted
            });
        });
    });

    describe('getEtfDividends', () => {
        const mockDividends = [{ date: new Date(), amount: 1.5 }];

        it('should return cached dividends if available', async () => {
            const expiresAt = Date.now() + 10000;
            cacheManager.get.mockResolvedValue({ value: mockDividends, expiresAt });

            const result = await service.getEtfDividends(mockSymbol);

            expect(result).toEqual(mockDividends);
            expect(yahooFinance.historical).not.toHaveBeenCalled();
        });

        it('should fetch dividends from Yahoo Finance if not in cache', async () => {
            cacheManager.get.mockResolvedValue(null);
            yahooFinance.historical.mockResolvedValue(mockDividends);

            const result = await service.getEtfDividends(mockSymbol);

            expect(result).toEqual(mockDividends);
            expect(yahooFinance.historical).toHaveBeenCalledWith(mockSymbol, expect.objectContaining({
                events: 'dividends'
            }));
            expect(cacheManager.set).toHaveBeenCalledWith(
                `etf_dividends_${mockSymbol}`,
                expect.objectContaining({ value: mockDividends }),
                CACHE_TTLS.DIVIDENDS
            );
        });

        it('should throw error if Yahoo Finance fails', async () => {
            cacheManager.get.mockResolvedValue(null);
            yahooFinance.historical.mockRejectedValue(new Error('API Error'));
            await expect(service.getEtfDividends(mockSymbol)).rejects.toThrow('API Error');
        });
    });
});
