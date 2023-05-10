import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import {
  cookieSecret,
  seesionSecret,
} from './modules/cookieSessionTest/cookieSession.controller';
import * as session from 'express-session';
import helmet from 'helmet';
import { join } from 'path';
import { RedisIoAdapter } from './modules/webSocket/adapter/redistIO.adapter';
import { WsAdapter } from '@nestjs/platform-ws';
async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });
  // app.use(
  //   helmet({
  //     contentSecurityPolicy: {
  //       directives: {
  //         defaultSrc: [`'self'`, 'unsafe-eval'],
  //         styleSrc: [
  //           `'self'`,
  //           `'unsafe-inline'`,
  //           'cdn.jsdelivr.net',
  //           'fonts.googleapis.com',
  //           'maxcdn.bootstrapcdn.com',
  //         ],
  //         fontSrc: [`'self'`, 'fonts.gstatic.com'],
  //         imgSrc: [`'self'`, 'data:', 'cdn.jsdelivr.net'],
  //         scriptSrc: [
  //           `'self'`,
  //           `'unsafe-eval'`,
  //           // `https: 'unsafe-inline'`,
  //           // `cdn.jsdelivr.net`,
  //           // 'cdn.socket.io',
  //           'cdn.socket.io',
  //           'cdnjs.cloudflare.com',
  //           'cdn.jsdelivr.net',
  //         ],
  //       },
  //     },
  //   }),
  // );
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

  // 挂载 session中间件
  app.use(
    session({
      secret: seesionSecret,
      saveUninitialized: false,
    }),
  );

  // 设置模板渲染 和前端需要static 目录
  // 一般的我们在生产环境上会重命名 静态路径, 而且会另外上次到 CDN 上去
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/static',
  });
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  // ws adapter redis
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);
  // app.useWebSocketAdapter(new WsAdapter(app)); // 听说这个性能比 默认的 socket 好

  await app.listen(3000);
}

bootstrap();

// async function bootStrap2() {
//   const app = await NestFactory.create<NestFastifyApplication>(
//     AppModule,
//     new FastifyAdapter(),
//   );
//   await app.listen(3000);
//   // 需要注意的是 一旦你换 FastifyAdapter 那么就 express 相关的就需要去掉 换成 Fastify 配套的
// }
// bootStrap2();
