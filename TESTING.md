# 🧪 Testing Guide

We use **Jest** as our primary testing framework. Testing is crucial to ensure that our data fetching and caching logic remains stable as we add more features.

## 🏃 Running Tests

### 1. Unit Tests
Run all unit tests in the `src/` directory:
```bash
npm run test
```

### 2. E2E (End-to-End) Tests
Run integration tests in the `test/` directory:
```bash
npm run test:e2e
```

### 3. Coverage
Check the testing coverage of the project:
```bash
npm run test:cov
```

## 🛠 Writing Tests

### Unit Tests
When testing services that use Yahoo Finance, you should **never** make real API calls. Always mock the `YAHOO_FINANCE_INSTANCE`.

**Example Mock:**
```typescript
const mockYahooFinance = {
  quote: jest.fn().mockResolvedValue({ regularMarketPrice: 150 }),
};

// In your test module initialization:
{
  provide: 'YAHOO_FINANCE_INSTANCE',
  useValue: mockYahooFinance,
}
```

### Testing Caching
To verify that the cache is working, your tests should:
1.  Call the service for the first time.
2.  Assert that the provider (Yahoo Finance) was called.
3.  Call the service a second time.
4.  Assert that the provider was **not** called again.
5.  Check that the returned data is identical and contains the `value` property.

- **Naming**: Test files must end in `.spec.ts`.

## 🚀 Integration Guide for New Developers

If you are adding a new service, follow these steps to integrate your tests:

### 1. Create the `.spec.ts` File
Create a file named `your-service.service.spec.ts` in the same directory as your service.

### 2. Use the Service Testing Template
Copy this boilerplate to get started:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { YourService } from './your-service.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CACHE_TTLS } from '../../common/constants/cache.constants';

describe('YourService', () => {
    let service: YourService;
    let cacheManager: any;
    let yahooFinance: any;

    beforeEach(async () => {
        // Mock Cache
        cacheManager = { get: jest.fn(), set: jest.fn() };
        // Mock Yahoo Finance
        yahooFinance = { someMethod: jest.fn() };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                YourService,
                { provide: CACHE_MANAGER, useValue: cacheManager },
                { provide: 'YAHOO_FINANCE_INSTANCE', useValue: yahooFinance },
            ],
        }).compile();

        service = module.get<YourService>(YourService);
    });

    it('should handle cache miss and fetch data', async () => {
        const mockData = { id: 1 };
        cacheManager.get.mockResolvedValue(null);
        yahooFinance.someMethod.mockResolvedValue(mockData);

        const result = await service.getYourData('abc');

        expect(result).toEqual(mockData);
        expect(cacheManager.set).toHaveBeenCalled();
    });
});
```

### 3. Verify Coverage
After writing your tests, ensure they are effective by running:
```bash
npm run test:cov -- src/etf/your-domain
```

## ✅ Testing Checklist for Contributions
- [ ] Does the test file live alongside the service?
- [ ] Are all external APIs (Yahoo Finance) mocked?
- [ ] Does it test both Cache HIT and Cache MISS scenarios?
- [ ] Does it handle error cases (API failure)?
- [ ] Does the coverage report show 80%+ for the new service?
