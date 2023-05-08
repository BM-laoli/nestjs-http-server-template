import { Module, CacheModule as CacheModuleNest } from '@nestjs/common';
import { CacheController } from './cache.controller';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModuleNest.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
  ],
  controllers: [CacheController],
  providers: [],
})
export class CacheModule {}
