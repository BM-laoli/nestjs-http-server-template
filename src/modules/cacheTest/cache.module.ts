import { Module, CacheModule as CacheModuleNest } from '@nestjs/common';
import { CacheController } from './cache.controller';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CacheModuleNest.registerAsync({
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('MONGOOSE_HOST'),
        port: 6379,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [CacheController],
  providers: [],
})
export class CacheModule {}
