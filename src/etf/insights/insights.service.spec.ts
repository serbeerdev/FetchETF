import { Test, TestingModule } from '@nestjs/testing';
import { InsightsService } from './insights.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CACHE_TTLS } from '../../common/constants/cache.constants';

describe('InsightsService', () => {
    let service: InsightsService;
    let cacheManager: any;
    let yahooFinance: any;

    const mockSymbol = 'QQQ';
    const mockData = { some: 'data' };

    beforeEach(async () => {
        cacheManager = {
            get: jest.fn(),
            set: jest.fn(),
        };

        yahooFinance = {
            recommendationsBySymbol: jest.fn(),
            insights: jest.fn(),
            quoteSummary: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InsightsService,
                { provide: CACHE_MANAGER, useValue: cacheManager },
                { provide: 'YAHOO_FINANCE_INSTANCE', useValue: yahooFinance },
            ],
        }).compile();

        service = module.get<InsightsService>(InsightsService);
    });

    describe('getEtfRecommendations', () => {
        it('should handle cache hit', async () => {
            cacheManager.get.mockResolvedValue({ value: mockData, expiresAt: Date.now() + 1000 });
            const result = await service.getEtfRecommendations(mockSymbol);
            expect(result).toEqual(mockData);
        });

        it('should handle cache miss and set cache', async () => {
            cacheManager.get.mockResolvedValue(null);
            yahooFinance.recommendationsBySymbol.mockResolvedValue(mockData);

            const result = await service.getEtfRecommendations(mockSymbol);

            expect(result).toEqual(mockData);
            expect(cacheManager.set).toHaveBeenCalledWith(
                `etf_recommendations_${mockSymbol}`,
                expect.objectContaining({ value: mockData }),
                CACHE_TTLS.RECOMMENDATIONS
            );
        });
    });

    describe('getEtfInsights', () => {
        it('should handle cache miss and set cache', async () => {
            cacheManager.get.mockResolvedValue(null);
            yahooFinance.insights.mockResolvedValue(mockData);

            const result = await service.getEtfInsights(mockSymbol);

            expect(result).toEqual(mockData);
            expect(cacheManager.set).toHaveBeenCalledWith(
                `etf_insights_${mockSymbol}`,
                expect.objectContaining({ value: mockData }),
                CACHE_TTLS.INSIGHTS
            );
        });

        it('should throw error if Yahoo fails', async () => {
            cacheManager.get.mockResolvedValue(null);
            yahooFinance.insights.mockRejectedValue(new Error('API Error'));
            await expect(service.getEtfInsights(mockSymbol)).rejects.toThrow('API Error');
        });
    });

    describe('getEtfHoldings', () => {
        it('should handle cache miss and set cache', async () => {
            cacheManager.get.mockResolvedValue(null);
            yahooFinance.quoteSummary.mockResolvedValue(mockData);

            const result = await service.getEtfHoldings(mockSymbol);

            expect(result).toEqual(mockData);
            expect(cacheManager.set).toHaveBeenCalledWith(
                `etf_holdings_${mockSymbol}`,
                expect.objectContaining({ value: mockData }),
                CACHE_TTLS.HOLDINGS
            );
        });
    });
});
