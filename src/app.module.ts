import { Module } from '@nestjs/common';
import { ArticleModule } from './modules/article/article.module';
import { TagModule } from './modules/tag/tag.module';
import { UserModule } from './modules/user/user.module';
import { CoreModule } from './core/core.module';
import { APP_GUARD } from '@nestjs/core';
import { MyAuthGuard } from './core/auth/MyAuthGuard.guard';

@Module({
  imports: [
    CoreModule,
    //下面的应该仅包含业务模块 不包含 通用模块，通用模块聚合 在core中
    UserModule,
    TagModule,
    ArticleModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: MyAuthGuard,
    },
  ],
})
export class AppModule {}
