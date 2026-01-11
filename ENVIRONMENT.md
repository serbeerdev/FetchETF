# ⚙ Environment & Configuration

This document outlines the environment variables and configurations used by the FetchETF service.

## 📝 `.env` File

By default, the project runs with sensible defaults for local development. However, you can create a `.env` file in the root directory to customize the behavior.

### Available Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | The port the server will listen on. | `3000` |
| `CACHE_TYPE` | Type of cache (experimental). | `memory` |
| `LOG_LEVEL` | Level of logging detail. | `log` |

## 🐳 Docker Environment

When running via **Docker Compose**, environment variables are managed in the `environment` section of the `docker-compose.yml` file.

```yaml
services:
  app:
    environment:
      - NODE_ENV=production
      - PORT=3000
```

To use a `.env` file with Docker, you can add `env_file: .env` to the service configuration in `docker-compose.yml`.

## 📦 Prerequisites

- **Node.js**: v18 or higher.
- **npm**: v9 or higher.

## 🔧 System Configuration

### Memory Limits
Since we use an in-memory cache, ensure the environment has enough RAM if you plan to cache thousands of ETF symbols with large historical datasets.

### API Rate Limits
We use `yahoo-finance2` which fetches data from Yahoo Finance. Be mindful of making too many "MISS" requests in a short period from the same IP to avoid temporary throttling from Yahoo's servers.

## 🌉 Next Steps: Redis Configuration

When upgrading to a **Redis L2 cache**, you will need to add the following variables:

```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=my-password
```
