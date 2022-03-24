import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import App_globalConfig from './config/configuration';
import DatabaseConfig from './config/database';
import { AppService } from './app.service';
import { ArticleModule } from './modules/article/article.module';
import { TagModule } from './modules/tag/tag.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { FilesModule } from './modules/files/files.module';
import { JobModule } from './modules/job/job.module';
import { CacheModule } from './modules/cache/cache.module';
import { ClientsModule, Transport } from '@nestjs/microservices'; // 注册一个用于对微服务进行数据传输的客户端

@Module({
  imports: [
    // ClientsModule.register([
    //   {
    //     name: 'NEST_MICRO',
    //     transport: Transport.TCP,
    //     options: {
    //       host: '192.168.101.2',
    //       port: 3001,
    //     },
    //   },
    // ]),

    ScheduleModule.forRoot(),
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
    AuthModule,
    FilesModule,
    JobModule,
    CacheModule,
  ],
  providers: [AppService],
})
export class AppModule {}
