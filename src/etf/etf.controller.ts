import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { EtfService } from './etf.service';
import { HistoryQueryDto } from './dto/history-query.dto';

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

    @Get(':symbol/history')
    @ApiOperation({ summary: 'Get ETF Historical Data' })
    @ApiParam({ name: 'symbol', description: 'ETF Symbol' })
    @ApiResponse({ status: 200, description: 'Historical price data' })
    async getEtfHistory(@Param('symbol') symbol: string, @Query() query: HistoryQueryDto) {
        return this.etfService.getEtfHistory(symbol, query);
    }
}
