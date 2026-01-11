import { Test, TestingModule } from '@nestjs/testing';
import { CoreDataService } from './core-data.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CACHE_TTLS } from '../../common/constants/cache.constants';

describe('CoreDataService', () => {
    let service: CoreDataService;
    let cacheManager: any;
    let yahooFinance: any;

    const mockSymbol = 'SPY';
    const mockData = { some: 'data' };

    beforeEach(async () => {
        cacheManager = {
            get: jest.fn(),
            set: jest.fn(),
        };

        yahooFinance = {
            quoteSummary: jest.fn(),
            quote: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CoreDataService,
                { provide: CACHE_MANAGER, useValue: cacheManager },
                { provide: 'YAHOO_FINANCE_INSTANCE', useValue: yahooFinance },
            ],
        }).compile();

        service = module.get<CoreDataService>(CoreDataService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getEtfInfo', () => {
        it('should return data from cache if available (HIT)', async () => {
            const expiresAt = Date.now() + 10000;
            cacheManager.get.mockResolvedValue({ value: mockData, expiresAt });

            const result = await service.getEtfInfo(mockSymbol);

            expect(result).toEqual(mockData);
            expect(cacheManager.get).toHaveBeenCalledWith(`etf_info_${mockSymbol}`);
            expect(yahooFinance.quoteSummary).not.toHaveBeenCalled();
        });

        it('should fetch from Yahoo Finance if not in cache (MISS)', async () => {
            cacheManager.get.mockResolvedValue(null);
            yahooFinance.quoteSummary.mockResolvedValue(mockData);

            const result = await service.getEtfInfo(mockSymbol);

            expect(result).toEqual(mockData);
            expect(yahooFinance.quoteSummary).toHaveBeenCalled();
            expect(cacheManager.set).toHaveBeenCalledWith(
                `etf_info_${mockSymbol}`,
                expect.objectContaining({ value: mockData }),
                CACHE_TTLS.INFO
            );
        });

        it('should throw error if Yahoo Finance fails', async () => {
            cacheManager.get.mockResolvedValue(null);
            yahooFinance.quoteSummary.mockRejectedValue(new Error('API Error'));

            await expect(service.getEtfInfo(mockSymbol)).rejects.toThrow('API Error');
        });
    });

    describe('getEtfPrice', () => {
        it('should return price from cache if available (HIT)', async () => {
            const expiresAt = Date.now() + 10000;
            cacheManager.get.mockResolvedValue({ value: mockData, expiresAt });

            const result = await service.getEtfPrice(mockSymbol);

            expect(result).toEqual(mockData);
            expect(yahooFinance.quote).not.toHaveBeenCalled();
        });

        it('should fetch price from Yahoo Finance if not in cache (MISS)', async () => {
            cacheManager.get.mockResolvedValue(null);
            yahooFinance.quote.mockResolvedValue(mockData);

            const result = await service.getEtfPrice(mockSymbol);

            expect(result).toEqual(mockData);
            expect(yahooFinance.quote).toHaveBeenCalledWith(mockSymbol);
            expect(cacheManager.set).toHaveBeenCalledWith(
                `etf_price_${mockSymbol}`,
                expect.objectContaining({ value: mockData }),
                CACHE_TTLS.PRICE
            );
        });
    });
});
