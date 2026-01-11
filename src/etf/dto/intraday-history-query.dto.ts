import { IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum IntradayInterval {
    OneMinute = '1m',
    TwoMinutes = '2m',
    FiveMinutes = '5m',
    FifteenMinutes = '15m',
    ThirtyMinutes = '30m',
    SixtyMinutes = '60m',
    NinetyMinutes = '90m',
    OneHour = '1h',
}

export class IntradayHistoryQueryDto {
    @ApiPropertyOptional({ description: 'Start date (YYYY-MM-DD)', example: '2023-01-01' })
    @IsOptional()
    @IsDateString()
    from?: string;

    @ApiPropertyOptional({ description: 'End date (YYYY-MM-DD)', example: '2023-12-31' })
    @IsOptional()
    @IsDateString()
    to?: string;

    @ApiPropertyOptional({ enum: IntradayInterval, description: 'Intraday interval', default: IntradayInterval.OneMinute })
    @IsOptional()
    @IsEnum(IntradayInterval)
    interval?: IntradayInterval;
}
