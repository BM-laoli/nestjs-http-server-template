import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import { join } from 'path';
import { AppModule } from './app.module';
import App_configuration from './config/configuration';
import { AllExceptionsFilter } from './filter/any-exception.filter';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { logger } from './middleware/logger.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  //日志相关
  app.use(logger); // 所有请求都打印日志
  app.useGlobalInterceptors(new TransformInterceptor()); // 使用全局拦截器 收集日志

  // 错误异常捕获 和 过滤处理
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new HttpExceptionFilter()); // 全局统一异常返回体

  // 配置文件访问  文件夹为静态目录，以达到可直接访问下面文件的目的
  const rootDir = join(__dirname, '..');
  app.use('/static', express.static(join(rootDir, '/upload')));
  // app.use('/static', express.static(join(rootDir, '/upload'))); // 允许配置多个

  // 构建swagger文档
  const options = new DocumentBuilder()
    .setTitle('Base-Http-example')
    .addBearerAuth()
    .setDescription('一个完善的HttpNodejs服务')
    .setVersion('1.0')
    .addTag('Http')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // 启动程序
  await app.listen(App_configuration().port);
}
bootstrap();
