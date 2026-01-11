import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { EtfService } from './etf.service';

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
}
