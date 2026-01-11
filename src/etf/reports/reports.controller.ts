import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CACHE_LABELS } from '../../common/constants/cache.constants';
import { ReportsService } from './reports.service';

@ApiTags('Reports & News')
@Controller('etf')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Get(':symbol/news')
    @ApiOperation({
        summary: `Get ETF News (Cache: ${CACHE_LABELS.NEWS})`,
        description: 'Fetches the 10 most recent news articles and press releases related to the specified ETF symbol.'
    })
    @ApiParam({ name: 'symbol', description: 'ETF Symbol' })
    @ApiResponse({ status: 200, description: 'List of news articles' })
    async getEtfNews(@Param('symbol') symbol: string) {
        return this.reportsService.getEtfNews(symbol);
    }

    @Get(':symbol/report')
    @ApiOperation({
        summary: `Get Full ETF Report (Cache: ${CACHE_LABELS.FULL_REPORT})`,
        description: 'Consolidates data from all specialized services (price, news, holdings, insights) into a master report for quick analysis.'
    })
    @ApiParam({ name: 'symbol', description: 'ETF Symbol' })
    @ApiResponse({ status: 200, description: 'Comprehensive ETF data report' })
    async getEtfFullReport(@Param('symbol') symbol: string) {
        return this.reportsService.getEtfFullReport(symbol);
    }
}
