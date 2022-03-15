import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import { AppModule } from './app.module';
import App_configuration from './config/configuration';
import { AllExceptionsFilter } from './filter/any-exception.filter';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { logger } from './middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(logger); // 所有请求都打印日志

  app.useGlobalInterceptors(new TransformInterceptor()); // 使用全局拦截器

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new HttpExceptionFilter()); // 全局统一返回体

  await app.listen(App_configuration().port);
}
bootstrap();
