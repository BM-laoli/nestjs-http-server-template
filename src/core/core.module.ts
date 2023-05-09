import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://admin:123456@127.0.0.1:27017/testDB', {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      authSource: 'admin',
      connectionName: 'testDB',
    }),
    MongooseModule.forRoot('mongodb://admin:123456@127.0.0.1:27017/testDB2', {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      authSource: 'admin',
      connectionName: 'testDB2',
    }),
  ],
  controllers: [], // 这个就是哈 把 controller放在这个里面就好了 通过@Module 装饰器将元数据附加到模块类中 Nest 可以轻松反射（reflect）出哪些控制器（controller）必须被安装
  providers: [], // 这个我们暂且不管
})
export class CoreModule {}
