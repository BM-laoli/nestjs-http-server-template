import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { cookieSecret } from './modules/cookieSessionTest/cookieSession.controller';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // string 则直接用去加密 Array 的话 尝试使用每个依次进行 secret 加密
  // 若提供了值 那么会价在 req.signedCookies 上
  // 若没有 提供(不加密) 就在 req.cookies 上
  // app.use(cookieParser());
  app.use(cookieParser(cookieSecret));

  await app.listen(3000);
}
bootstrap();
