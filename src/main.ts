import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { RolesGuard2 } from './core/guard/roles2.guard';
import { loggerAll } from './core/middleware/m4-fnAll.middleware';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(loggerAll);
  app.useGlobalGuards(new RolesGuard2());
  await app.listen(3000);
}
bootstrap();
