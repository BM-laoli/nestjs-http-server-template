import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'path';
import App_globalConfig from '../config/configuration';
import { EnumZkConfigPath, InterZKConfigNest } from './typings';
import { ZKModule } from './zk/zk.module';
import { ZKService } from './zk/zk.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { JobModule } from './job/job.module';
import { CacheModule } from './cache/cache.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [App_globalConfig],
    }),
    ZKModule.forRootAsync(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: async (zkService: ZKService) => {
        const { mysql } = await zkService.getDataWithJSON<InterZKConfigNest>(
          EnumZkConfigPath.nest,
        );
        return {
          type: 'mysql',
          host: mysql.host,
          port: mysql.prot,
          username: mysql.name,
          password: mysql.pwd,
          database: mysql.lib,
          entities: [resolve(__dirname, '../entities/**/*.entity{.ts,.js}')], // 扫描本项目中.entity.ts或者.entity.js的文件
          synchronize: true,
        };
      },
      inject: [ZKService],
    }),
    RedisModule.forRootAsync({
      useFactory: async (zkService: ZKService) => {
        const { redis } = await zkService.getDataWithJSON<InterZKConfigNest>(
          EnumZkConfigPath.nest,
        );
        return {
          config: {
            host: redis.host,
            port: redis.prot,
            db: redis.db,
            family: redis.family,
            password: redis.pwd,
          },
        };
      },
      inject: [ZKService],
    }),
    CacheModule,
    AuthModule,
    FilesModule,
    JobModule,
  ],
})
export class CoreModule {}
