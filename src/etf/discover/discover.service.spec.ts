import { Test, TestingModule } from '@nestjs/testing';
import { DiscoverService } from './discover.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CACHE_TTLS } from '../../common/constants/cache.constants';

describe('DiscoverService', () => {
    let service: DiscoverService;
    let cacheManager: any;
    let yahooFinance: any;

    const mockData = [{ symbol: 'ESGV' }, { symbol: 'QQQM' }];

    beforeEach(async () => {
        cacheManager = {
            get: jest.fn(),
            set: jest.fn(),
        };

        yahooFinance = {
            quote: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DiscoverService,
                { provide: CACHE_MANAGER, useValue: cacheManager },
                { provide: 'YAHOO_FINANCE_INSTANCE', useValue: yahooFinance },
            ],
        }).compile();

        service = module.get<DiscoverService>(DiscoverService);
    });

    describe('getFeaturedEtfs', () => {
        it('should return cached list if available', async () => {
            cacheManager.get.mockResolvedValue({ value: mockData, expiresAt: Date.now() + 1000 });
            const result = await service.getFeaturedEtfs();
            expect(result).toEqual(mockData);
        });

        it('should fetch from Yahoo and cache if not available', async () => {
            cacheManager.get.mockResolvedValue(null);
            yahooFinance.quote.mockResolvedValue(mockData);

            const result = await service.getFeaturedEtfs();

            expect(result).toEqual(mockData);
            expect(yahooFinance.quote).toHaveBeenCalled();
            expect(cacheManager.set).toHaveBeenCalledWith(
                'etf_featured_list',
                expect.objectContaining({ value: mockData }),
                CACHE_TTLS.FEATURED_LIST
            );
        });
    });
});
