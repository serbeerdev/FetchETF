import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CACHE_LABELS } from '../../common/constants/cache.constants';
import { HistoryService } from './history.service';
import { DailyHistoryQueryDto } from '../dto/daily-history-query.dto';
import { IntradayHistoryQueryDto } from '../dto/intraday-history-query.dto';

@ApiTags('History')
@Controller('etf')
export class HistoryController {
    constructor(private readonly historyService: HistoryService) { }

    @Get(':symbol/history/daily')
    @ApiOperation({
        summary: `Get ETF Daily History (Cache: ${CACHE_LABELS.HISTORY})`,
        description: 'Fetch historical daily price data. Supports large timeframes through the range parameter or specific date periods.'
    })
    @ApiParam({ name: 'symbol', description: 'ETF Symbol' })
    @ApiResponse({ status: 200, description: 'Historical price data' })
    async getDailyHistory(@Param('symbol') symbol: string, @Query() query: DailyHistoryQueryDto) {
        return this.historyService.getEtfHistory(symbol, query);
    }

    @Get(':symbol/history/intraday')
    @ApiOperation({
        summary: `Get ETF Intraday History (Cache: ${CACHE_LABELS.HISTORY})`,
        description: 'Fetch granular intraday price data (e.g., 1-minute, 5-minute intervals) for technical analysis over short periods.'
    })
    @ApiParam({ name: 'symbol', description: 'ETF Symbol' })
    @ApiResponse({ status: 200, description: 'Intraday price data' })
    async getIntradayHistory(@Param('symbol') symbol: string, @Query() query: IntradayHistoryQueryDto) {
        return this.historyService.getEtfHistory(symbol, query);
    }

    @Get(':symbol/dividends')
    @ApiOperation({
        summary: `Get ETF Dividends (Cache: ${CACHE_LABELS.DIVIDENDS})`,
        description: 'Retrieves the complete historical dividend payment list for the specified ETF, including amounts and ex-dividend dates.'
    })
    @ApiParam({ name: 'symbol', description: 'ETF Symbol' })
    @ApiResponse({ status: 200, description: 'List of historical dividend payments' })
    async getEtfDividends(@Param('symbol') symbol: string) {
        return this.historyService.getEtfDividends(symbol);
    }
}
