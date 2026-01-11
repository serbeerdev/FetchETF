import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CACHE_TTLS } from '../../common/constants/cache.constants';
import { CoreDataService } from '../core/core-data.service';
import { InsightsService } from '../insights/insights.service';

describe('ReportsService', () => {
    let service: ReportsService;
    let cacheManager: any;
    let yahooFinance: any;
    let coreDataService: any;
    let insightsService: any;

    const mockSymbol = 'SPY';

    beforeEach(async () => {
        cacheManager = {
            get: jest.fn(),
            set: jest.fn(),
        };

        yahooFinance = {
            search: jest.fn(),
        };

        coreDataService = {
            getEtfInfo: jest.fn(),
            getEtfPrice: jest.fn(),
        };

        insightsService = {
            getEtfHoldings: jest.fn(),
            getEtfInsights: jest.fn(),
            getEtfRecommendations: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReportsService,
                { provide: CACHE_MANAGER, useValue: cacheManager },
                { provide: 'YAHOO_FINANCE_INSTANCE', useValue: yahooFinance },
                { provide: CoreDataService, useValue: coreDataService },
                { provide: InsightsService, useValue: insightsService },
            ],
        }).compile();

        service = module.get<ReportsService>(ReportsService);
    });

    describe('getEtfNews', () => {
        it('should return cached news if available', async () => {
            const mockNews = [{ title: 'News' }];
            cacheManager.get.mockResolvedValue({ value: mockNews, expiresAt: Date.now() + 1000 });
            const result = await service.getEtfNews(mockSymbol);
            expect(result).toEqual(mockNews);
        });

        it('should fetch news from Yahoo on miss', async () => {
            const mockNews = [{ title: 'News' }];
            cacheManager.get.mockResolvedValue(null);
            yahooFinance.search.mockResolvedValue({ news: mockNews });

            const result = await service.getEtfNews(mockSymbol);

            expect(result).toEqual(mockNews);
            expect(cacheManager.set).toHaveBeenCalledWith(
                `etf_news_${mockSymbol}`,
                expect.objectContaining({ value: mockNews }),
                CACHE_TTLS.NEWS
            );
        });
    });

    describe('getEtfFullReport', () => {
        it('should return cached report if available', async () => {
            const mockReport = { symbol: 'SPY' };
            cacheManager.get.mockResolvedValue({ value: mockReport, expiresAt: Date.now() + 1000 });
            const result = await service.getEtfFullReport(mockSymbol);
            expect(result).toEqual(mockReport);
        });

        it('should consolidate data from all services on miss', async () => {
            cacheManager.get.mockResolvedValue(null);

            coreDataService.getEtfInfo.mockResolvedValue({ info: 'info' });
            coreDataService.getEtfPrice.mockResolvedValue({ price: 100 });
            yahooFinance.search.mockResolvedValue({ news: [] });
            insightsService.getEtfHoldings.mockResolvedValue({ holdings: [] });
            insightsService.getEtfInsights.mockResolvedValue({ insights: {} });
            insightsService.getEtfRecommendations.mockResolvedValue([]);

            const result = await service.getEtfFullReport(mockSymbol);

            expect(result.symbol).toBe(mockSymbol);
            expect(result.details).toBeDefined();
            expect(result.price).toBeDefined();
            expect(cacheManager.set).toHaveBeenCalledWith(
                `etf_full_report_${mockSymbol}`,
                expect.objectContaining({ value: expect.any(Object) }),
                CACHE_TTLS.FULL_REPORT
            );
        });
    });
});
