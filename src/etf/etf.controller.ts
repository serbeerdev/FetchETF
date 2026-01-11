import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { EtfService } from './etf.service';
import { DailyHistoryQueryDto } from './dto/daily-history-query.dto';
import { IntradayHistoryQueryDto } from './dto/intraday-history-query.dto';

@ApiTags('etf')
@Controller('etf')
export class EtfController {
    constructor(private readonly etfService: EtfService) { }

    @Get('search/:query')
    @ApiOperation({ summary: 'Search for ETFs' })
    @ApiParam({ name: 'query', description: 'Search term for ETF' })
    @ApiResponse({ status: 200, description: 'List of matching ETFs' })
    async searchEtf(@Param('query') query: string) {
        return this.etfService.searchEtf(query);
    }

    @Get(':symbol')
    @ApiOperation({ summary: 'Get ETF Information' })
    @ApiParam({ name: 'symbol', description: 'ETF Symbol (e.g. SPY)' })
    @ApiResponse({ status: 200, description: 'Detailed ETF information including price and summary profile' })
    async getEtfInfo(@Param('symbol') symbol: string) {
        return this.etfService.getEtfInfo(symbol);
    }

    @Get(':symbol/price')
    @ApiOperation({ summary: 'Get ETF Price' })
    @ApiParam({ name: 'symbol', description: 'ETF Symbol' })
    @ApiResponse({ status: 200, description: 'Current price of the ETF' })
    async getEtfPrice(@Param('symbol') symbol: string) {
        return this.etfService.getEtfPrice(symbol);
    }

    @Get(':symbol/history/daily')
    @ApiOperation({ summary: 'Get ETF Daily History', description: 'Fetch historical data with intervals of 1d or greater' })
    @ApiParam({ name: 'symbol', description: 'ETF Symbol' })
    @ApiResponse({ status: 200, description: 'Historical price data' })
    async getDailyHistory(@Param('symbol') symbol: string, @Query() query: DailyHistoryQueryDto) {
        return this.etfService.getEtfHistory(symbol, query);
    }

    @Get(':symbol/history/intraday')
    @ApiOperation({ summary: 'Get ETF Intraday History', description: 'Fetch historical data with intraday intervals (e.g. 1m, 1h)' })
    @ApiParam({ name: 'symbol', description: 'ETF Symbol' })
    @ApiResponse({ status: 200, description: 'Intraday price data' })
    async getIntradayHistory(@Param('symbol') symbol: string, @Query() query: IntradayHistoryQueryDto) {
        return this.etfService.getEtfHistory(symbol, query);
    }

    @Get(':symbol/news')
    @ApiOperation({ summary: 'Get ETF News', description: 'Fetch latest news related to the ETF' })
    @ApiParam({ name: 'symbol', description: 'ETF Symbol' })
    @ApiResponse({ status: 200, description: 'List of news articles' })
    async getEtfNews(@Param('symbol') symbol: string) {
        return this.etfService.getEtfNews(symbol);
    }

    @Get(':symbol/recommendations')
    @ApiOperation({ summary: 'Get ETF Recommendations', description: 'Fetch symbol recommendations and insights' })
    @ApiParam({ name: 'symbol', description: 'ETF Symbol' })
    @ApiResponse({ status: 200, description: 'List of recommended symbols' })
    async getEtfRecommendations(@Param('symbol') symbol: string) {
        return this.etfService.getEtfRecommendations(symbol);
    }

    @Get(':symbol/dividends')
    @ApiOperation({ summary: 'Get ETF Dividends', description: 'Fetch historical dividend payments for the ETF' })
    @ApiParam({ name: 'symbol', description: 'ETF Symbol' })
    @ApiResponse({ status: 200, description: 'List of historical dividend payments' })
    async getEtfDividends(@Param('symbol') symbol: string) {
        return this.etfService.getEtfDividends(symbol);
    }

    @Get(':symbol/insights')
    @ApiOperation({ summary: 'Get ETF Technical Insights', description: 'Fetch automated technical analysis and market insights' })
    @ApiParam({ name: 'symbol', description: 'ETF Symbol' })
    @ApiResponse({ status: 200, description: 'Technical analysis insights' })
    async getEtfInsights(@Param('symbol') symbol: string) {
        return this.etfService.getEtfInsights(symbol);
    }

    @Get(':symbol/holdings')
    @ApiOperation({ summary: 'Get ETF Holdings and Composition', description: 'Fetch top holdings, performance, and asset profile' })
    @ApiParam({ name: 'symbol', description: 'ETF Symbol' })
    @ApiResponse({ status: 200, description: 'Holdings and fund composition data' })
    async getEtfHoldings(@Param('symbol') symbol: string) {
        return this.etfService.getEtfHoldings(symbol);
    }

    @Get(':symbol/report')
    @ApiOperation({ summary: 'Get Full ETF Report', description: 'Consolidate info, price, news, holdings, insights, and recommendations in a single report' })
    @ApiParam({ name: 'symbol', description: 'ETF Symbol' })
    @ApiResponse({ status: 200, description: 'Comprehensive ETF data report' })
    async getEtfFullReport(@Param('symbol') symbol: string) {
        return this.etfService.getEtfFullReport(symbol);
    }
}
