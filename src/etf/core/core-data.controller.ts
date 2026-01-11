import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CoreDataService } from './core-data.service';

@ApiTags('Core Data')
@Controller('etf')
export class CoreDataController {
    constructor(private readonly coreDataService: CoreDataService) { }

    @Get(':symbol')
    @ApiOperation({ summary: 'Get ETF Information' })
    @ApiParam({ name: 'symbol', description: 'ETF Symbol (e.g. SPY)' })
    @ApiResponse({ status: 200, description: 'Detailed ETF information including price and summary profile' })
    async getEtfInfo(@Param('symbol') symbol: string) {
        return this.coreDataService.getEtfInfo(symbol);
    }

    @Get(':symbol/price')
    @ApiOperation({ summary: 'Get ETF Price' })
    @ApiParam({ name: 'symbol', description: 'ETF Symbol' })
    @ApiResponse({ status: 200, description: 'Current price of the ETF' })
    async getEtfPrice(@Param('symbol') symbol: string) {
        return this.coreDataService.getEtfPrice(symbol);
    }
}
