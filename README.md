# FetchETF Integration Service

This project is a NestJS-based backend service designed to fetch and provide data about Exchange Traded Funds (ETFs). It leverages the `yahoo-finance2` library to obtain real-time (delayed) market data and financial profiles.

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- `npm`

### Installation

1. Clone the repository.
   ```bash
   git clone <repository-url>
   cd fetchETF
   ```
2. Install dependencies.
   ```bash
   npm install
   ```

### Running the Application

To run the application in development mode:

```bash
npm run start:dev
```

The server will start (usually on port 3000).

## 📡 API Endpoints

The service primarily exposes the following endpoints under the `/etf` route:

### 1. Search for an ETF
Search for ETFs by symbol or name.

- **URL:** `/etf/search/:query`
- **Method:** `GET`
- **Example:** `/etf/search/SPY`
- **Response:** List of matching symbols and names.

### 2. Get ETF Details
Retrieve detailed information about a specific ETF, including summary profile and fund profile.

- **URL:** `/etf/:symbol`
- **Method:** `GET`
- **Example:** `/etf/SPY`
- **Response:** JSON object containing comprehensive ETF data.

### 3. Get ETF Price
Retrieve the current price quote for a specific ETF.

- **URL:** `/etf/:symbol/price`
- **Method:** `GET`
- **Example:** `/etf/SPY/price`
- **Response:** JSON object with price and quote information.

### 4. Get Daily History
Retrieve historical data with intervals of 1 day or greater. Supports predefined ranges or custom dates.

- **URL:** `/etf/:symbol/history/daily`
- **Method:** `GET`
- **Parameters:**
    - `interval` (optional): `1d`, `5d`, `1wk`, `1mo`, `3mo`. Default: `1d`.
    - `range` (optional): `1d`, `5d`, `1mo`, `3mo`, `6mo`, `1y`, `2y`, `5y`, `10y`, `ytd`, `max`.
    - `from` (optional): Start date (YYYY-MM-DD).
    - `to` (optional): End date (YYYY-MM-DD).
- **Note:** `range` and `from`/`to` are mutually exclusive.
- **Example:** `/etf/SPY/history/daily?range=1y&interval=1wk`

### 5. Get Intraday History
Retrieve historical data with intraday intervals (minutes/hours). Restricted to the last 730 days.

- **URL:** `/etf/:symbol/history/intraday`
- **Method:** `GET`
- **Parameters:**
    - `interval` (optional): `1m`, `2m`, `5m`, `15m`, `30m`, `60m`, `90m`, `1h`. Default: `1m`.
    - `from` (optional): Start date (YYYY-MM-DD).
    - `to` (optional): End date (YYYY-MM-DD).
- **Example:** `/etf/QQQ/history/intraday?interval=1h&from=2024-01-01&to=2024-01-02`

## 📖 Swagger Documentation

Interactive API documentation is available when the server is running:

- **URL:** `http://localhost:3000/api`

### 6. Get ETF News
Retrieve the latest news headlines and links for a specific ETF.

- **URL:** `/etf/:symbol/news`
- **Method:** `GET`
- **Example:** `/etf/SPY/news`
- **Response:** JSON array of news articles.

## 🛠 Project Structure

- `src/etf`: Contains the main logic for ETF data fetching.
  - `etf.controller.ts`: Handles incoming HTTP requests.
  - `etf.service.ts`: Interacts with `yahoo-finance2` API.
  - `etf.module.ts`: Module definition.

## 📚 Dependencies

- **NestJS**: Framework.
- **yahoo-finance2**: Wrapper for Yahoo Finance API.

---

*Generated for easy developer onboarding.*
