import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EtfModule } from './etf/etf.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    EtfModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
