import { IsOptional, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum SparklinePeriod {
  ONE_MONTH = '1m',
  THREE_MONTHS = '3m',
  SIX_MONTHS = '6m',
  ONE_YEAR = '1y',
}

export class SparklineQueryDto {
  @ApiPropertyOptional({
    description: 'Time period for sparkline data',
    enum: SparklinePeriod,
    default: SparklinePeriod.ONE_MONTH,
  })
  @IsOptional()
  @IsEnum(SparklinePeriod)
  period?: SparklinePeriod;

  @ApiPropertyOptional({
    description:
      'Maximum number of data points to return (resampled if needed)',
    minimum: 30,
    maximum: 100,
    default: 60,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(30)
  @Max(100)
  points?: number;
}
