import { Module } from '@nestjs/common';
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

@Module({
    controllers: [
        SearchController,
        CoreDataController,
        HistoryController,
        InsightsController,
        ReportsController,
    ],
    providers: [
        SearchService,
        CoreDataService,
        HistoryService,
        InsightsService,
        ReportsService,
    ],
})
export class EtfModule { }
