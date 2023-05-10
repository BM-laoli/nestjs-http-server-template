import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

// https://socket.io/zh-CN/docs/v4/redis-adapter/ 看文档 目前 socket 发生了迁移
const pubClient = createClient({ url: 'redis://localhost:6379' });
const redisAdapter = createAdapter(pubClient, pubClient.duplicate());

export class RedisIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, options);

    server.adapter(redisAdapter);
    return server;
  }
}
