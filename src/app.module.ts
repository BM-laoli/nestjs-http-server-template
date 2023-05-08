import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PipModule } from './modules/pipTest/pip.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CoreModule } from './core/core.module';
import { CatModule } from './modules/cat/cat.module';
import { PipController } from './modules/pipTest/pip.controller';
import { CacheModule } from './modules/cacheTest/cache.module';

@Module({
  imports: [
    CoreModule,
    // CatModule
    PipModule,
    CacheModule,
  ],
  controllers: [AppController], // 这个就是哈 把 controller放在这个里面就好了 通过@Module 装饰器将元数据附加到模块类中 Nest 可以轻松反射（reflect）出哪些控制器（controller）必须被安装
  providers: [AppService], // 这个我们暂且不管
})
export class AppModule {}
