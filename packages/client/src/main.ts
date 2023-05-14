import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {} from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // 对于消息的发送方 可以把消息 / 事件发布到 Nest微服务中去
  // 请看module中的注入指南
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await app.listen(3003);
}
bootstrap();
