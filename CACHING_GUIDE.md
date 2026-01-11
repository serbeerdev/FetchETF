# 💾 Caching Developer Guide

This document serves as a guide for developers to understand, maintain, and expand the caching system in the FetchETF project.

## 🏗 Architecture

The system uses a **Level 1 (L1) In-Memory Cache** provided by `@nestjs/cache-manager`. It is designed to be easily upgradable to **Level 2 (L2) Redis Cache** by simply changing the configuration in `AppModule`.

## ⚙ Centralized Configuration

All cache durations (TTL) and descriptive labels are centralized in a single file to maintain consistency between logic and documentation:

📁 `src/common/constants/cache.constants.ts`

```typescript
export const CACHE_TTLS = {
    SEARCH: 5 * 60 * 1000,          // 5 minutes
    PRICE: 60 * 1000,               // 60 seconds
    INFO: 24 * 60 * 60 * 1000,      // 24 hours
    // ... other constants
};

export const CACHE_LABELS = {
    SEARCH: '5m',
    PRICE: '60s',
    // ... labels used in Swagger
};
```

## 🛠 Working with the Cache in Services

### 1. Standard Pattern
Every service method follows this pattern:
1. Generate unique `cacheKey`.
2. Check `cacheManager.get(cacheKey)`.
3. If **HIT**: Log the hit with expiration time and return the `value`.
4. If **MISS**: Fetch data from source, calculate expiration, and `set` the cache wrapping the data in a metadata object.

### 2. The Cache Wrapper
To allow expiration time logging, we wrap all cached data as follows:

```typescript
// WRONG: await this.cacheManager.set(key, data, ttl);
// CORRECT:
const expiresAt = Date.now() + CACHE_TTLS.KEY;
await this.cacheManager.set(cacheKey, { value: data, expiresAt }, CACHE_TTLS.KEY);
```

### 3. Example Implementation

```typescript
async getExample(id: string) {
    const cacheKey = `example_${id}`;
    const cached: any = await this.cacheManager.get(cacheKey);

    if (cached) {
        const expiry = new Date(cached.expiresAt).toLocaleTimeString();
        this.logger.log(`Cache HIT [Example]: ${id} (Expires at: ${expiry})`);
        return cached.value;
    }

    this.logger.log(`Cache MISS [Example]: ${id} - Fetching from source`);
    const data = await fetchSource(id);
    const expiresAt = Date.now() + CACHE_TTLS.EXAMPLE;
    await this.cacheManager.set(cacheKey, { value: data, expiresAt }, CACHE_TTLS.EXAMPLE);
    return data;
}
```

## 📝 Swagger Integration

When adding a new endpoint, use the `CACHE_LABELS` in the `@ApiOperation` decorator:

```typescript
@Get(':id')
@ApiOperation({ 
    summary: `Get Item (Cache: ${CACHE_LABELS.EXAMPLE})`,
    description: 'Detailed description here...' 
})
```

## 🚀 Future Upgrades: Redis (Level 2)

To move to Redis:
1. Install `cache-manager-redis-store`.
2. Update `src/app.module.ts`:
```typescript
CacheModule.register({
  store: redisStore,
  host: 'localhost',
  port: 6379,
  // ...
})
```
No changes are required in the services, as they use the standard `Cache` interface.
