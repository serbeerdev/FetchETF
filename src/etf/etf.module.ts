import { Module } from '@nestjs/common';
import YahooFinance from 'yahoo-finance2';
import { SearchService } from './search/search.service';
import { SearchController } from './search/search.controller';
import { CoreDataService } from './core/core-data.service';
import { CoreDataController } from './core/core-data.controller';
import { HistoryService } from './history/history.service';
import { HistoryController } from './history/history.controller';
import { InsightsService } from './insights/insights.service';
import { InsightsController } from './insights/insights.controller';
import { ReportsService } from './reports/reports.service';
import { ReportsController } from './reports/reports.controller';
import { DiscoverService } from './discover/discover.service';
import { DiscoverController } from './discover/discover.controller';
import { SparklineService } from './sparkline/sparkline.service';
import { SparklineController } from './sparkline/sparkline.controller';

@Module({
    controllers: [
        SearchController,
        CoreDataController,
        HistoryController,
        InsightsController,
        ReportsController,
        DiscoverController,
        SparklineController,
    ],
    providers: [
        {
            provide: 'YAHOO_FINANCE_INSTANCE',
            useFactory: () => new YahooFinance(),
        },
        SearchService,
        CoreDataService,
        HistoryService,
        InsightsService,
        ReportsService,
        DiscoverService,
        SparklineService,
    ],
})
export class EtfModule { }
