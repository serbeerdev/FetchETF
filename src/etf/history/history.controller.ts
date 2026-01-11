import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { HistoryService } from './history.service';
import { DailyHistoryQueryDto } from '../dto/daily-history-query.dto';
import { IntradayHistoryQueryDto } from '../dto/intraday-history-query.dto';

@ApiTags('History')
@Controller('etf')
export class HistoryController {
    constructor(private readonly historyService: HistoryService) { }

    @Get(':symbol/history/daily')
    @ApiOperation({ summary: 'Get ETF Daily History', description: 'Fetch historical data with intervals of 1d or greater' })
    @ApiParam({ name: 'symbol', description: 'ETF Symbol' })
    @ApiResponse({ status: 200, description: 'Historical price data' })
    async getDailyHistory(@Param('symbol') symbol: string, @Query() query: DailyHistoryQueryDto) {
        return this.historyService.getEtfHistory(symbol, query);
    }

    @Get(':symbol/history/intraday')
    @ApiOperation({ summary: 'Get ETF Intraday History', description: 'Fetch historical data with intraday intervals (e.g. 1m, 1h)' })
    @ApiParam({ name: 'symbol', description: 'ETF Symbol' })
    @ApiResponse({ status: 200, description: 'Intraday price data' })
    async getIntradayHistory(@Param('symbol') symbol: string, @Query() query: IntradayHistoryQueryDto) {
        return this.historyService.getEtfHistory(symbol, query);
    }

    @Get(':symbol/dividends')
    @ApiOperation({ summary: 'Get ETF Dividends', description: 'Fetch historical dividend payments for the ETF' })
    @ApiParam({ name: 'symbol', description: 'ETF Symbol' })
    @ApiResponse({ status: 200, description: 'List of historical dividend payments' })
    async getEtfDividends(@Param('symbol') symbol: string) {
        return this.historyService.getEtfDividends(symbol);
    }
}
