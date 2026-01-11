import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ReportsService } from './reports.service';

@ApiTags('Reports & News')
@Controller('etf')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Get(':symbol/news')
    @ApiOperation({ summary: 'Get ETF News', description: 'Fetch latest news related to the ETF' })
    @ApiParam({ name: 'symbol', description: 'ETF Symbol' })
    @ApiResponse({ status: 200, description: 'List of news articles' })
    async getEtfNews(@Param('symbol') symbol: string) {
        return this.reportsService.getEtfNews(symbol);
    }

    @Get(':symbol/report')
    @ApiOperation({ summary: 'Get Full ETF Report', description: 'Consolidate info, price, news, holdings, insights, and recommendations in a single report' })
    @ApiParam({ name: 'symbol', description: 'ETF Symbol' })
    @ApiResponse({ status: 200, description: 'Comprehensive ETF data report' })
    async getEtfFullReport(@Param('symbol') symbol: string) {
        return this.reportsService.getEtfFullReport(symbol);
    }
}
