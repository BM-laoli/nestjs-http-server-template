import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { ArticleModule } from './modules/article/article.module';
import { TagModule } from './modules/tag/tag.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import App_globalConfig from './config/configuration';
import DatabaseConfig from './config/database';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [App_globalConfig, DatabaseConfig],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DatabaseConfig().host,
      port: Number(DatabaseConfig().port),
      username: DatabaseConfig().username,
      password: DatabaseConfig().password,
      database: DatabaseConfig().database,
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // 扫描本项目中.entity.ts或者.entity.js的文件
      synchronize: true,
    }),
    UserModule,
    TagModule,
    ArticleModule,
  ],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    console.log('value===>runtime', DatabaseConfig());
  }
}
