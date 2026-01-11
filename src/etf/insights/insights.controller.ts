import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { InsightsService } from './insights.service';

@ApiTags('Insights')
@Controller('etf')
export class InsightsController {
    constructor(private readonly insightsService: InsightsService) { }

    @Get(':symbol/recommendations')
    @ApiOperation({ summary: 'Get ETF Recommendations', description: 'Fetch symbol recommendations and insights' })
    @ApiParam({ name: 'symbol', description: 'ETF Symbol' })
    @ApiResponse({ status: 200, description: 'List of recommended symbols' })
    async getEtfRecommendations(@Param('symbol') symbol: string) {
        return this.insightsService.getEtfRecommendations(symbol);
    }

    @Get(':symbol/insights')
    @ApiOperation({ summary: 'Get ETF Technical Insights', description: 'Fetch automated technical analysis and market insights' })
    @ApiParam({ name: 'symbol', description: 'ETF Symbol' })
    @ApiResponse({ status: 200, description: 'Technical analysis insights' })
    async getEtfInsights(@Param('symbol') symbol: string) {
        return this.insightsService.getEtfInsights(symbol);
    }

    @Get(':symbol/holdings')
    @ApiOperation({ summary: 'Get ETF Holdings and Composition', description: 'Fetch top holdings, performance, and asset profile' })
    @ApiParam({ name: 'symbol', description: 'ETF Symbol' })
    @ApiResponse({ status: 200, description: 'Holdings and fund composition data' })
    async getEtfHoldings(@Param('symbol') symbol: string) {
        return this.insightsService.getEtfHoldings(symbol);
    }
}
