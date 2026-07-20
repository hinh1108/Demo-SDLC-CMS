import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ProblemFilter } from './common/problem.filter';
import { config } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false, bufferLogs: false });
  app.setGlobalPrefix('v1');
  app.enableCors({ origin: config.corsOrigin, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  app.useGlobalFilters(new ProblemFilter());

  if (config.jwtSecret === 'dev-secret-change-me') {
    Logger.warn('JWT_SECRET đang là giá trị dev mặc định — ĐẶT biến môi trường ở production!', 'Bootstrap');
  }
  await app.listen(config.port);
  Logger.log(`API listening on http://localhost:${config.port}/v1`, 'Bootstrap');
}
bootstrap();
