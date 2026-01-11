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
