import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('etf/search')
export class SearchController {
    constructor(private readonly searchService: SearchService) { }

    @Get(':query')
    @ApiOperation({ summary: 'Search for ETFs' })
    @ApiParam({ name: 'query', description: 'Search term for ETF' })
    @ApiResponse({ status: 200, description: 'List of matching ETFs' })
    async searchEtf(@Param('query') query: string) {
        return this.searchService.searchEtf(query);
    }
}
