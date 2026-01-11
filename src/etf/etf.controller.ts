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
}
