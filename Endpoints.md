# 📡 API Reference - Endpoints

This document provides a detailed list of all available endpoints in the FetchETF service.

## 🔍 Discovery & Search
| Method | Endpoint | Description | Cache TTL |
| :--- | :--- | :--- | :--- |
| `GET` | `/etf/search/:query` | Search for ETFs by symbol or name. | 5m |
| `GET` | `/etf/discover/featured` | Get a curated list of featured and popular ETFs. | 1h |

## 📈 Market Data & Quotes
| Method | Endpoint | Description | Cache TTL |
| :--- | :--- | :--- | :--- |
| `GET` | `/etf/:symbol` | Detailed ETF profile (Summary, Fund, and Price modules). | 24h |
| `GET` | `/etf/:symbol/price` | Real-time quote data (price, change, volume, etc.). | 60s |

## 🗓️ Historical Data & Dividends
| Method | Endpoint | Description | Cache TTL |
| :--- | :--- | :--- | :--- |
| `GET` | `/etf/:symbol/history/daily` | Historical charts for intervals of 1 day or more. | 1h |
| `GET` | `/etf/:symbol/history/intraday` | Intraday charts (1m to 60m intervals). | 1h |
| `GET` | `/etf/:symbol/dividends` | Historical dividend payments and dates. | 24h |

## 🧠 Insights & Composition
| Method | Endpoint | Description | Cache TTL |
| :--- | :--- | :--- | :--- |
| `GET` | `/etf/:symbol/recommendations` | List of similar ETFs and suggested symbols. | 24h |
| `GET` | `/etf/:symbol/insights` | Automated technical analysis and signals. | 24h |
| `GET` | `/etf/:symbol/holdings` | Top 10 holdings, industry sectors, and performance. | 24h |

## 📰 Reports
| Method | Endpoint | Description | Cache TTL |
| :--- | :--- | :--- | :--- |
| `GET` | `/etf/:symbol/news` | Latest financial news related to the ETF. | 15m |
| `GET` | `/etf/:symbol/report` | **Unified Master Report**: Combines all modules in one call. | 30s |

---

## 🛠 Usage Notes

### Swagger Output
You can explore and test these endpoints interactively via Swagger UI:
👉 [http://localhost:3000/api](http://localhost:3000/api)

### Cache Metadata
All successful requests return cached data if available. The application terminal will log:
`Cache HIT [Context]: symbol (Expires at: HH:MM:SS)`

### Error Responses
Errors from the data provider (Yahoo Finance) are caught and returned with a standard JSON structure:
```json
{
  "statusCode": 404,
  "message": "Symbol not found",
  "timestamp": "..."
}
```
