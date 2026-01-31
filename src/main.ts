import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.enableCors({
    origin: [
      'http://hoggwks8s0oc8ss0s8kwkw8k.136.248.241.227.salip.io',
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    credentials: true,
  });

  // Para desarrollo
  // app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('FetchETF API')
    .setDescription(
      'A high-performance, modular API for fetching real-time and historical ETF data. ' +
      'Features include advanced caching with expiration tracking, consolidated master reports, ' +
      'technical insights, discovery of featured instruments, and sparkline data for charts, ' +
      'all powered by Yahoo Finance.',
    )
    .setVersion('1.0')
    .addTag('Search')
    .addTag('Core Data')
    .addTag('History')
    .addTag('Insights')
    .addTag('Reports & News')
    .addTag('Discover')
    .addTag('Sparkline')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 8080);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
