import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EtfModule } from './etf/etf.module';

@Module({
  imports: [EtfModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
