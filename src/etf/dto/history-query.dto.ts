import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum Interval {
    Daily = '1d',
    Weekly = '1wk',
    Monthly = '1mo',
}

export class HistoryQueryDto {
    @ApiPropertyOptional({ description: 'Start date (YYYY-MM-DD)', example: '2023-01-01' })
    @IsOptional()
    @IsDateString()
    from?: string;

    @ApiPropertyOptional({ description: 'End date (YYYY-MM-DD)', example: '2023-12-31' })
    @IsOptional()
    @IsDateString()
    to?: string;

    @ApiPropertyOptional({ enum: Interval, description: 'Data interval', default: Interval.Daily })
    @IsOptional()
    @IsEnum(Interval)
    interval?: Interval;
}
