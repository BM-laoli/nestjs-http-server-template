import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarModule } from './car/car.module';
import { LoggerMiddleware } from './core/middleware/m1.middleware';
import { LoggerMiddleware2 } from './core/middleware/m2.middleware';
import { logger } from './core/middleware/m3-fn.middleware';
import { RequestLogger } from './core/testScope/testScope';
import { TransientService } from './transient.service';

@Module({
  imports: [CarModule],
  controllers: [AppController], // 这个就是哈 把 controller放在这个里面就好了 通过@Module 装饰器将元数据附加到模块类中 Nest 可以轻松反射（reflect）出哪些控制器（controller）必须被安装
  providers: [AppService, RequestLogger, TransientService], // 这个我们暂且不管
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('cats');
    // consumer
    //   .apply(LoggerMiddleware)
    //   .forRoutes({ path: '*', method: RequestMethod.ALL });
    consumer
      .apply(LoggerMiddleware, LoggerMiddleware2, logger)
      .forRoutes(AppController);
  }
}
