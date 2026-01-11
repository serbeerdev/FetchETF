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

## 🎯 Best Practices
- **Isolation**: Each test should be independent. Clear the cache and reset mocks between tests.
- **Mock Metadata**: When mocking cached data, remember that currently our services expect a wrapper object `{ value: any, expiresAt: number }`.
- **Naming**: Test files must end in `.spec.ts`.
