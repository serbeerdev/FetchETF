import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CACHE_LABELS } from '../../common/constants/cache.constants';
import { DiscoverService } from './discover.service';

@ApiTags('Discover')
@Controller('etf/discover')
export class DiscoverController {
    constructor(private readonly discoverService: DiscoverService) { }

    @Get('featured')
    @ApiOperation({
        summary: `Get Featured ETFs (Cache: ${CACHE_LABELS.FEATURED_LIST})`,
        description: 'Returns a curated list of high-visibility and top-performing ETFs including QQQM, ESGV, FTEC, and others.'
    })
    @ApiResponse({ status: 200, description: 'List of featured ETFs with basic quote data' })
    async getFeaturedEtfs() {
        return this.discoverService.getFeaturedEtfs();
    }
}
