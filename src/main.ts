import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('FetchETF API')
    .setDescription(
      'A high-performance, modular API for fetching real-time and historical ETF data. ' +
      'Features include advanced caching with expiration tracking, consolidated master reports, ' +
      'technical insights, and discovery of featured instruments, all powered by Yahoo Finance.',
    )
    .setVersion('1.0')
    .addTag('Search')
    .addTag('Core Data')
    .addTag('History')
    .addTag('Insights')
    .addTag('Reports & News')
    .addTag('Discover')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
