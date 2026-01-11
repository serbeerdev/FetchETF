import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CACHE_TTLS } from '../../common/constants/cache.constants';

describe('SearchService', () => {
    let service: SearchService;
    let cacheManager: any;
    let yahooFinance: any;

    const mockQuery = 'vanguard';
    const mockData = { quotes: [] };

    beforeEach(async () => {
        cacheManager = {
            get: jest.fn(),
            set: jest.fn(),
        };

        yahooFinance = {
            search: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SearchService,
                { provide: CACHE_MANAGER, useValue: cacheManager },
                { provide: 'YAHOO_FINANCE_INSTANCE', useValue: yahooFinance },
            ],
        }).compile();

        service = module.get<SearchService>(SearchService);
    });

    describe('searchEtf', () => {
        it('should return cached results if available', async () => {
            const expiresAt = Date.now() + 1000;
            cacheManager.get.mockResolvedValue({ value: mockData, expiresAt });
            const result = await service.searchEtf(mockQuery);
            expect(result).toEqual(mockData);
            expect(yahooFinance.search).not.toHaveBeenCalled();
        });

        it('should fetch from Yahoo Finance and cache on miss', async () => {
            cacheManager.get.mockResolvedValue(null);
            yahooFinance.search.mockResolvedValue(mockData);

            const result = await service.searchEtf(mockQuery);

            expect(result).toEqual(mockData);
            expect(cacheManager.set).toHaveBeenCalledWith(
                `etf_search_${mockQuery}`,
                expect.objectContaining({ value: mockData }),
                CACHE_TTLS.SEARCH
            );
        });

        it('should throw error if Yahoo fails', async () => {
            cacheManager.get.mockResolvedValue(null);
            yahooFinance.search.mockRejectedValue(new Error('API Error'));
            await expect(service.searchEtf(mockQuery)).rejects.toThrow('API Error');
        });
    });
});
