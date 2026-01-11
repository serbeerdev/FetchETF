import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CACHE_LABELS } from '../../common/constants/cache.constants';
import { InsightsService } from './insights.service';

@ApiTags('Insights')
@Controller('etf')
export class InsightsController {
    constructor(private readonly insightsService: InsightsService) { }

    @Get(':symbol/recommendations')
    @ApiOperation({
        summary: `Get ETF Recommendations (Cache: ${CACHE_LABELS.RECOMMENDATIONS})`,
        description: 'Analyzes the ETF and returns a list of similar or related financial instruments based on market correlation.'
    })
    @ApiParam({ name: 'symbol', description: 'ETF Symbol' })
    @ApiResponse({ status: 200, description: 'List of recommended symbols' })
    async getEtfRecommendations(@Param('symbol') symbol: string) {
        return this.insightsService.getEtfRecommendations(symbol);
    }

    @Get(':symbol/insights')
    @ApiOperation({
        summary: `Get ETF Technical Insights (Cache: ${CACHE_LABELS.INSIGHTS})`,
        description: 'Provides automated technical analysis, including support/resistance levels and market trend indicators.'
    })
    @ApiParam({ name: 'symbol', description: 'ETF Symbol' })
    @ApiResponse({ status: 200, description: 'Technical analysis insights' })
    async getEtfInsights(@Param('symbol') symbol: string) {
        return this.insightsService.getEtfInsights(symbol);
    }

    @Get(':symbol/holdings')
    @ApiOperation({
        summary: `Get ETF Holdings and Composition (Cache: ${CACHE_LABELS.HOLDINGS})`,
        description: 'Returns the top 10 holdings of the ETF along with asset allocation and fund performance metrics.'
    })
    @ApiParam({ name: 'symbol', description: 'ETF Symbol' })
    @ApiResponse({ status: 200, description: 'Holdings and fund composition data' })
    async getEtfHoldings(@Param('symbol') symbol: string) {
        return this.insightsService.getEtfHoldings(symbol);
    }
}
