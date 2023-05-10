# 如何在Nest中集成 websocket
>
> 这是一个有趣的话题，接下来我们来探讨 🧐 研究一下
>

需要先安装好 依赖 注意版本 默认适配NestCore 9.0.0 若报错请把它 缓存你的NestCore Version

```shell
yarn add @nestjs/websockets @nestjs/platform-socket.io
```

## Getwary

声明 modules

```ts
import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Module({
  providers: [EventsGateway],
})
export class EventModule {}

```

先搞定Service 端

```ts
import { UseFilters } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { log } from 'console';
import { Socket } from 'dgram';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { AllExceptionsFilterWithWs } from './filter/allExceptions.filter';

// 默认可以WebSocketGateway(80,options) 这个port 可指定若不指定就是 同样的port 监听
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  // 直接访问原生的、特定于平台的服务器实例
  @WebSocketServer()
  server: Server;

  // 如果有人发消息 就会触发 这个 handler
  @SubscribeMessage('events')
  handleEvent(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): any {
    // client.emit('events', { ...data, message: 'Servier return you ' });
    // return data  请不要用return 请看这个 issues https://github.com/nestjs/nest/issues/11439

    // 如果你是 异步 的也可以支持 狐疑 from 是连发Array Item 哈，详见RXJS 更多的也请 参考RXJS
    from([1, 2, 3, 4])
      .pipe(map((data) => data))
      .subscribe((res) => {
        client.emit('events', { data: res, message: 'Servier return you ' });
      });
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }

  // 以下是三个 WebSocketGateway生命周期hook
  afterInit() {
    log('OnGatewayInit');
  }

  handleConnection() {
    log('OnGatewayConnection');
  }

  handleDisconnect() {
    log('OnGatewayDisconnect');
  }
}

```

再把 html搞定 参考 文档 <a href="https://socket.io/zh-CN/" > Socket.IO </a>

```html
<html>
  <head>
    <script src="https://cdn.socket.io/4.3.2/socket.io.min.js" integrity="sha384-KAZ4DtjNhLChOB/hxXuKqhMLYvx3b5MlT55xPEiNmREKRzeEm+RVPlTnAn0ajQNs" crossorigin="anonymous"></script>
    <script>
      const socket = io('http://localhost:3000');
      socket.on('connect', function() {
        console.log('Connected');
        socket.emit('events', { test: 'test' });
        socket.emit('identity', 0, response =>
          console.log('Identity:', response),
        );

        socket.emit('errorTest',0)
        // socket.emit('pipData',0)
        socket.emit('pipData',{
          email:'bmlishizeng@gmail.com',
          password:"666"
        })
      });

      socket.on('events', function(data) {
        console.log('event', data);
      });    
      socket.on('pipData', function(data) {
        console.log('pipData', data);
      });    
      socket.on('exception', function(data) {
        console.log('exception', data);
      });
      socket.on('disconnect', function() {
        console.log('Disconnected');
      });
    </script>
  </head>

  <body></body>
</html>
```

## Error

>
> 有点特殊

```ts

// 若你抛error 请使用 这样在 client 收的时候 就能收到，若想优雅请使用 fillter (需要自定义)
// @SubscribeMessage('errorTest')
// errDemo(@MessageBody() data: any, @ConnectedSocket() clinet: Socket) {
//   throw new WsException('Invalid credentials.');
// }
@UseFilters(new AllExceptionsFilterWithWs())
@SubscribeMessage('errorTest')
errDemo(@MessageBody() data: any, @ConnectedSocket() clinet: Socket) {
  throw new Error('Invalid credentials.');
}

import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch()
export class AllExceptionsFilterWithWs extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // + 各种花里胡哨的逻辑
    super.catch(exception, host);
  }
}

```

## Pip
>
> 和普通的pip 没区别 注意 不要抛 HttpException, 而且我们仅 pip data

```ts
@UsePipes(new ValidationPipe())
@SubscribeMessage('events')
handleEvent(client: Client, data: TestDto): WsResponse<unknown> {
  const event = 'events';
  return { event, data };
}

```

## Guard
>
> Guards 和普通的一样(不演示了) 建议为 ws 自定义一个 Guards 让它 抛出 非HttpException
>
## Interceptors
>
> Interceptor 和普通的一样(不演示了) 建议为 ws 自定义一个 Interceptor 让它 抛出 非HttpException

## Adapter
>
> Nest 的ws 和 使用何种 第三方库 无关， 与平台无关， 我们可以使用 WebSocketAdapter/Nodejs原生实现 ，来看几个例子 WebSocketAdapter 从 @nestjs/common 来

请强制实现 WebSocketAdapter 要求的方法

|method|des|
|-------|---------|
| create | 将套接字实例连接到指定的端口 |
| bindClientConnect | 绑定客户端连接事件 |
| bindClientDisconnect | 绑定客户端断开连接事件（可选） |
| bindMessageHandlers | 将传入的消息绑定到适当的消息处理程序 |
| close | 终止服务器实例 |

### 例子 扩展socket.io 功能
>
> 我们有一个需求 要求 ws 能够跨多个 node 实例 （分布式） ，我们找来 一个plugin socket.io-redis

```shell
yarn add socket.io-redis
```

```ts
～ RedisIoAdapter.ts

```

### 例子 用 WsAdapter 反过来充当框架之间的代理

### 例子 完全自实现一个 随意自定义的
