import {
  CacheInterceptor,
  CacheTTL,
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  UseInterceptors,
} from '@nestjs/common';
import { Cache } from 'cache-manager';

@Controller('cache')
@UseInterceptors(CacheInterceptor)
export class CacheController {
  constructor(@Inject(CACHE_MANAGER) private cacheManger: Cache) {}

  @Get('t1')
  @CacheTTL(10)
  async test1() {
    // 简单的使用就是这样用的，默认缓存过期是 5s
    const cacheValue = await this.cacheManger.get('key1');

    if (cacheValue) {
      console.log('cacheValue', cacheValue);

      return cacheValue;
    }

    const value = Math.floor(Math.random() * 10);
    await this.cacheManger.set('key1', value);
    // 可以设置过期时间 若=0 永不过期

    return value;
  }
}
