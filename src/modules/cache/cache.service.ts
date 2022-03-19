import { Injectable } from '@nestjs/common';
import RedisC, { Redis } from 'ioredis';

@Injectable()
// 目前的版本比较的简单 只是一个设置值清除值，在启动微服务之后，这个地方就不是这样写了
export class CacheService {
  redisClient: Redis;

  // 先做一个最简易的版本，只生产一个 链接实例
  constructor() {
    this.redisClient = new RedisC({
      port: 6379, // Redis port
      host: '192.168.101.10', // Redis host
      family: 4, // 4 (IPv4) or 6 (IPv6)
      password: '',
      db: 0,
    });
  }

  // 编写几个设置redis的便捷方法

  /**
   * @Description: 封装设置redis缓存的方法
   * @param key {String} key值
   * @param value {String} key的值
   * @param seconds {Number} 过期时间
   * @return: Promise<any>
   */
  public async set(key: string, value: any, seconds?: number): Promise<any> {
    value = JSON.stringify(value);
    if (!seconds) {
      await this.redisClient.set(key, value);
    } else {
      await this.redisClient.set(key, value, 'EX', seconds);
    }
  }

  /**
   * @Description: 设置获取redis缓存中的值
   * @param key {String}
   */
  public async get(key: string): Promise<any> {
    const data = await this.redisClient.get(key);
    if (data) return data;
    return null;
  }

  /**
   * @Description: 根据key删除redis缓存数据
   * @param key {String}
   * @return:
   */
  public async del(key: string): Promise<any> {
    return await this.redisClient.del(key);
  }

  /**
   * @Description: 清空redis的缓存
   * @param {type}
   * @return:
   */
  public async flushall(): Promise<any> {
    return await this.redisClient.flushall();
  }
}
