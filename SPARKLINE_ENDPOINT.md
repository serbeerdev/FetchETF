# Sparkline Endpoint Implementation

## Overview

A new optimized endpoint has been successfully implemented to provide compact historical price data for generating sparkline charts in the frontend.

## Endpoint Details

**URL:** `GET /etf/:symbol/sparkline`

**Path Parameters:**
- `symbol` (required): ETF symbol (1-5 alphanumeric characters, case-insensitive)

**Query Parameters:**
- `period` (optional): Time period
  - Values: `1m`, `3m`, `6m`, `1y`
  - Default: `1m`
- `points` (optional): Maximum number of data points to return
  - Range: 30-100
  - Default: 60

**Response Format:**
```json
{
  "symbol": "SPY",
  "period": "1m",
  "data": [
    { "t": 1704067200, "p": 470.50 },
    { "t": 1704153600, "p": 471.20 }
  ]
}
```

Where:
- `t`: Unix timestamp in **seconds** (not milliseconds) - compatible with lightweight-charts
- `p`: Closing price

## Implementation Details

### Files Created

1. **`src/etf/dto/sparkline-query.dto.ts`**
   - DTO with validation for query parameters
   - Period enum with 4 options
   - Points validation (30-100 range)

2. **`src/etf/sparkline/sparkline.service.ts`**
   - Main business logic with resampling algorithms
   - Cache management with dynamic TTL based on period
   - Weekly grouping for long periods using ISO week calculation
   - Filters out null price data

3. **`src/etf/sparkline/sparkline.controller.ts`**
   - REST endpoint with comprehensive Swagger documentation
   - Symbol format validation (1-5 alphanumeric characters)
   - Automatic uppercase conversion

4. **`src/etf/sparkline/sparkline.service.spec.ts`**
   - Comprehensive unit tests (13 test cases)
   - Tests for cache hit/miss, resampling, validation, and error handling
   - 100% passing tests

### Files Modified

1. **`src/etf/etf.module.ts`**
   - Added SparklineController to controllers array
   - Added SparklineService to providers array

2. **`src/main.ts`**
   - Added "Sparkline" tag to Swagger documentation
   - Updated API description to mention sparkline feature

## Resampling Logic

### Short Periods (1m, 3m)
- When daily data exceeds `points` limit: Returns the most recent N days
- Data is returned in chronological order (oldest first)

### Long Periods (6m, 1y)
- Groups data by week using ISO week numbering
- Returns the last closing price of each week
- Uses the timestamp of the last day in the week

### Data Within Limit
- If data points are ≤ `points`, returns all data as-is
- Sorted chronologically

## Caching Strategy

Dynamic TTL based on period:

| Period | TTL | Rationale |
|--------|-----|-----------|
| 1m, 3m | 5 minutes | Recent data, higher volatility |
| 6m, 1y | 1 hour | Historical data, lower volatility |

**Cache Key Format:** `etf_sparkline_{symbol}_{period}_{points}`

Example: `etf_sparkline_SPY_1m_60`

## Error Handling

- **400 Bad Request**: Invalid query parameters (validated by class-validator)
- **400 Bad Request**: Invalid symbol format (must be 1-5 alphanumeric characters)
- **404 Not Found**: Symbol doesn't exist or no data available
- **500 Internal Server Error**: Yahoo Finance API failures (propagated with logging)

## Usage Examples

### Request 1: 1-month sparkline with default 60 points
```bash
GET /etf/SPY/sparkline
```

### Request 2: 3-month sparkline with 30 points
```bash
GET /etf/SPY/sparkline?period=3m&points=30
```

### Request 3: 1-year sparkline (weekly aggregation)
```bash
GET /etf/AAPL/sparkline?period=1y&points=52
```

### Request 4: 6-month sparkline with maximum points
```bash
GET /etf/QQQ/sparkline?period=6m&points=100
```

## Testing

All unit tests pass successfully:
```bash
npm test -- sparkline.service.spec.ts
# Test Suites: 1 passed, 1 total
# Tests: 13 passed, 13 total
```

### Test Coverage
- Cache hit/miss scenarios
- Data resampling for different periods
- Timestamp conversion (milliseconds to seconds)
- Chronological ordering
- Null price filtering
- Error handling (404, API errors)
- Dynamic TTL calculation
- Cache key generation

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8080/api`
- Look for the "Sparkline" tag

## Next Steps (Optional Enhancements)

1. **E2E Tests**: Add integration tests in `test/` directory
2. **Metrics**: Add performance monitoring for resampling operations
3. **Custom Resampling**: Allow users to specify resampling method (average, close, high, low)
4. **Multiple Symbols**: Batch endpoint for multiple sparklines at once
5. **Compression**: Consider gzip compression for responses

## Notes

- Timestamps are in **seconds** (not milliseconds) for compatibility with lightweight-charts and similar charting libraries
- The Yahoo Finance library is called with `interval: '1d'` to get daily data, which is then resampled as needed
- Weekly grouping uses ISO week numbers for consistent week boundaries across different timezones
- The service follows the same patterns as other ETF services in the codebase (caching, logging, error handling)
