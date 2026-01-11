import { IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum DailyInterval {
    Daily = '1d',
    FiveDays = '5d',
    Weekly = '1wk',
    Monthly = '1mo',
    ThreeMonths = '3mo',
}

export enum Range {
    OneDay = '1d',
    FiveDays = '5d',
    OneMonth = '1mo',
    ThreeMonths = '3mo',
    SixMonths = '6mo',
    OneYear = '1y',
    TwoYears = '2y',
    FiveYears = '5y',
    TenYears = '10y',
    Ytd = 'ytd',
    Max = 'max',
}

export class DailyHistoryQueryDto {
    @ApiPropertyOptional({ description: 'Start date (YYYY-MM-DD)', example: '2023-01-01' })
    @IsOptional()
    @IsDateString()
    from?: string;

    @ApiPropertyOptional({ description: 'End date (YYYY-MM-DD)', example: '2023-12-31' })
    @IsOptional()
    @IsDateString()
    to?: string;

    @ApiPropertyOptional({ enum: DailyInterval, description: 'Daily interval', default: DailyInterval.Daily })
    @IsOptional()
    @IsEnum(DailyInterval)
    interval?: DailyInterval;

    @ApiPropertyOptional({ enum: Range, description: 'Data range', default: Range.OneMonth })
    @IsOptional()
    @IsEnum(Range)
    range?: Range;
}
