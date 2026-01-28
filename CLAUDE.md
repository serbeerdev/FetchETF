# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FetchETF is a NestJS-based API for fetching real-time and historical ETF data from Yahoo Finance. The API provides modular endpoints for search, core data, history, insights, reports, and discovery features with built-in caching.

## Development Commands

### Build & Run
- `npm run build` - Build the project (outputs to `dist/`)
- `npm run start` - Run production build
- `npm run start:dev` - Run in watch mode (development)
- `npm run start:debug` - Run with debug mode

### Testing
- `npm test` - Run unit tests ( Jest with ts-jest )
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage report
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:debug` - Run tests with Node debugger

### Code Quality
- `npm run lint` - Run ESLint and auto-fix issues
- `npm run format` - Format code with Prettier

### API Documentation
Swagger UI is available at `/api` when the server is running (default port: 8080)

## Architecture

### Module Structure
The application follows NestJS's modular architecture:

- **AppModule** (`src/app.module.ts`) - Root module that imports EtfModule and configures global caching
- **EtfModule** (`src/etf/etf.module.ts`) - Feature module containing all ETF-related controllers and services

### Domain Organization
Each domain feature has its own directory under `src/etf/`:
- `search/` - ETF symbol search
- `core/` - Basic info and current price data
- `history/` - Historical price data and dividends (daily/intraday intervals)
- `insights/` - Holdings, technical insights, analyst recommendations
- `reports/` - News and consolidated full reports
- `discover/` - Featured ETF lists

Each feature directory contains:
- `{feature}.controller.ts` - HTTP request handlers with Swagger decorators
- `{feature}.service.ts` - Business logic and Yahoo Finance integration
- `{feature}.service.spec.ts` - Unit tests

### Data Transfer Objects (DTOs)
DTOs in `src/etf/dto/` define request validation:
- Uses `class-validator` decorators for validation
- Uses `@nestjs/swagger` decorators for API documentation
- Base DTO: `HistoryQueryDto` (common query parameters)
- Specialized DTOs: `DailyHistoryQueryDto`, `IntradayHistoryQueryDto`

### External Dependencies
- **yahoo-finance2** - Library for fetching Yahoo Finance data (injected as `YAHOO_FINANCE_INSTANCE`)
- **@nestjs/cache-manager** - In-memory caching with TTL-based expiration

## Caching Strategy

### Cache Implementation
Services use a consistent caching pattern:

```typescript
const cacheKey = `etf_{feature}_{symbol}_{params}`;
const cached = await this.cacheManager.get(cacheKey);

if (cached) {
    this.logger.log(`Cache HIT [Feature]: ${symbol} (Expires at: ${expiry})`);
    return cached.value;
}

this.logger.log(`Cache MISS [Feature]: ${symbol} - Fetching from Yahoo Finance`);
// Fetch data...
await this.cacheManager.set(cacheKey, { value: data, expiresAt }, CACHE_TTLS.FEATURE);
```

### TTL Configuration
All cache TTLs are centralized in `src/common/constants/cache.constants.ts`:
- `SEARCH` - 5 minutes
- `PRICE` - 60 seconds
- `INFO` - 24 hours
- `HISTORY` - 1 hour
- `DIVIDENDS` - 1 hour
- `INSIGHTS` - 24 hours
- `HOLDINGS` - 24 hours
- `NEWS` - 15 minutes
- `FULL_REPORT` - 30 seconds
- `FEATURED_LIST` - 1 hour

When adding new cached endpoints, update both `CACHE_TTLS` (milliseconds) and `CACHE_LABELS` (human-readable) in the constants file.

## Adding New Features

### 1. Create a new feature service
```typescript
@Injectable()
export class NewFeatureService {
    private readonly logger = new Logger(NewFeatureService.name);

    constructor(
        @Inject('YAHOO_FINANCE_INSTANCE') private readonly yahooFinance: any,
        @Inject(CACHE_MANAGER) private cacheManager: any,
    ) {}

    async getFeatureData(symbol: string) {
        // Implement caching pattern
        // Call yahooFinance methods
        // Handle errors
    }
}
```

### 2. Create controller with Swagger documentation
```typescript
@ApiTags('Feature Name')
@Controller('etf')
export class NewFeatureController {
    constructor(private readonly newFeatureService: NewFeatureService) {}

    @Get(':symbol/feature')
    @ApiOperation({
        summary: `Get ETF Feature (Cache: ${CACHE_LABELS.FEATURE})`,
        description: 'Detailed description...'
    })
    @ApiResponse({ status: 200, description: 'Success' })
    async getFeature(@Param('symbol') symbol: string) {
        return this.newFeatureService.getFeatureData(symbol);
    }
}
```

### 3. Register in EtfModule
Add the controller and service to `src/etf/etf.module.ts`

### 4. Update Swagger tags
Add the new tag to the Swagger config in `src/main.ts`

### 5. Write unit tests
Create `{feature}.service.spec.ts` following the existing test patterns:
- Mock `CACHE_MANAGER` and `YAHOO_FINANCE_INSTANCE`
- Test cache hit/miss scenarios
- Test error handling
- Verify cache.set is called with correct TTL

## Key Patterns

### Error Handling
- Services wrap Yahoo Finance calls in try-catch blocks
- Errors are logged with context and re-thrown
- Global `HttpExceptionFilter` handles HTTP exception responses

### Consolidated Reports
The `ReportsService.getEtfFullReport()` demonstrates how to orchestrate multiple service calls:
- Uses `Promise.allSettled()` for parallel requests
- Continues even if individual endpoints fail
- Returns a consolidated response with error placeholders for failed fetches

### History Date Handling
The `HistoryService` has special logic for date queries:
- When `from` equals `to`, it automatically increments `to` by one day to ensure data is returned
- Supports both explicit date ranges and pre-defined ranges (e.g., "1mo", "1y")

## Testing Patterns

### Unit Tests
- Located alongside source files as `*.spec.ts`
- Use NestJS `Test.createTestingModule()`
- Mock external dependencies (cache, Yahoo Finance)
- Test both happy path and error cases

### E2E Tests
- Located in `test/` directory
- Use `supertest` for HTTP assertions
- Test full request/response cycle

## Environment Configuration
- Default port: `8080` (configurable via `PORT` environment variable)
- Swagger docs available at `/api` route
