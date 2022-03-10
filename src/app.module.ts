import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { TagModule } from './tagModule/Tag.module';
import { ConfigModule } from './tagModule/Tag.module';
// import { TagService } from './tagModule/tag.service';

//模块是具有 @Module() 装饰器的类。 @Module() 装饰器提供了元数据，Nest 用它来组织应用程序结构。每个Nest都应该有一个根module，由此开枝散叶，
// AppModules就是根，

@Module({
  // imports: [ TagModule ], // 基础用法 导入模块的列表，这些模块导出了此模块中所需提供者
  imports: [ ConfigModule.register({ folder:"config1" }) ], // 高级用户，动态参数指定和动态注入
  controllers: [AppController], // 必须创建的一组控制器
  providers: [AppService], //由 Nest 注入器实例化的提供者，并且可以至少在整个模块中共享. 需要注意 如果你需要到入别入模块的provider那么别人的地方
  // 就必须要要exports导出
})
export class AppModule {}
