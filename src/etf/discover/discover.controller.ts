import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DiscoverService } from './discover.service';

@ApiTags('Discover')
@Controller('etf/discover')
export class DiscoverController {
    constructor(private readonly discoverService: DiscoverService) { }

    @Get('featured')
    @ApiOperation({ summary: 'Get Featured ETFs', description: 'Fetch a list of popular and high-performing ETFs' })
    @ApiResponse({ status: 200, description: 'List of featured ETFs with basic quote data' })
    async getFeaturedEtfs() {
        return this.discoverService.getFeaturedEtfs();
    }
}
