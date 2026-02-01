import {
  Controller,
  Get,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { CACHE_LABELS } from '../../common/constants/cache.constants';
import { SparklineService } from './sparkline.service';
import { SparklineQueryDto, SparklinePeriod } from '../dto/sparkline-query.dto';

@ApiTags('Sparkline')
@Controller('etf')
export class SparklineController {
  constructor(private readonly sparklineService: SparklineService) {}

  @Get(':symbol/sparkline')
  @ApiOperation({
    summary: `Get ETF Sparkline Data (Cache: ${CACHE_LABELS.SPARKLINE})`,
    description: `Returns compact historical price data optimized for sparkline charts. Data is automatically resampled based on the period and points parameters.

**Resampling Logic:**
- **Short periods (1m, 3m)**: Returns daily data (most recent days first)
- **Long periods (6m, 1y)**: Returns weekly aggregated data (last close price of each week)

**Response Format:**
- \`t\`: Unix timestamp in seconds (not milliseconds)
- \`p\`: Closing price`,
  })
  @ApiParam({
    name: 'symbol',
    description: 'ETF symbol (2-5 characters)',
    example: 'SPY',
  })
  @ApiResponse({
    status: 200,
    description: 'Sparkline data successfully retrieved',
    schema: {
      example: {
        symbol: 'SPY',
        period: '1m',
        data: [
          { t: 1704067200, p: 470.5 },
          { t: 1704153600, p: 471.2 },
          { t: 1704240000, p: 471.8 },
        ],
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'period must be one of the following values: 1m, 3m, 6m, 1y',
          'points must not be less than 30',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Symbol not found or no data available',
    schema: {
      example: {
        statusCode: 404,
        message: 'No data found for symbol: INVALID',
        error: 'Not Found',
      },
    },
  })
  async getSparkline(
    @Param('symbol') symbol: string,
    @Query() query: SparklineQueryDto,
  ) {
    // Validate symbol format (2-5 characters, alphanumeric)
    if (!/^[A-Z]{1,5}$/i.test(symbol)) {
      throw new BadRequestException(
        'Symbol must be 1-5 alphanumeric characters',
      );
    }

    return this.sparklineService.getSparkline(symbol.toUpperCase(), query);
  }
}
