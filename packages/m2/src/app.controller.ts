import {
  Controller,
  Get,
  Inject,
  RequestTimeoutException,
  Scope,
} from '@nestjs/common';
import {
  CONTEXT,
  Ctx,
  EventPattern,
  MessagePattern,
  NatsContext,
  Payload,
  RedisContext,
  RequestContext,
} from '@nestjs/microservices';
import { from, fromEvent, Observable } from 'rxjs';
import { AppService } from './app.service';

@Controller({
  scope: Scope.REQUEST,
})
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(CONTEXT) private ctx: RequestContext, // scope 的时候
  ) {}

  // 在Nest中有两种 微服务的模式来识别消息和事件

  // 下面就是 一个 (请求-响应)
  // 注意哈 这个decorator 只在 controller 中用
  @MessagePattern({ cmd: 'sum' })
  accumulate(data: number[]): number {
    return (data || []).reduce((a, b) => a + b);
  }

  // 异步/Observable  也是支持的
  @MessagePattern({ cmd: 'sumSync' })
  accumulateSync(data: number[]): Promise<number> {
    return Promise.resolve((data || []).reduce((a, b) => a + b));
  }

  @MessagePattern({ cmd: 'sumObservable' })
  accumulateObservable(data: number[]): Observable<number> {
    return from([1, 2, 3, 4]);
  }

  // 以上是基于 请求+响应 的 下面咱们 来观察一下 基于 事件的
  @EventPattern('user_created')
  async cuser(data: any) {
    console.log(this.ctx.pattern);
    return 1;
  }
  // 我们可以为一个 事件注册多个处理程序 他们会依次触发
  @EventPattern('user_created')
  async cuser2(data: any) {
    return 2;
  }
  // 如果你需要一些 请求的详细信息 可以传递一个context
  @MessagePattern('time.use.*') // 通配符
  getDate(@Payload() data: number[], @Ctx() context: NatsContext) {
    return new Date().toLocaleDateString();
  }

  // redis
  @MessagePattern('notifications')
  getNotifications(@Payload() data: number[], @Ctx() context: RedisContext) {
    console.log(`Channel: ${context.getChannel()}`); // notifications
    console.log(222);
  }
}
