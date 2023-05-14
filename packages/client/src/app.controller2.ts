import { Controller, Get, Inject, Scope } from '@nestjs/common';
import { ClientProxy, CONTEXT, RequestContext } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AppService } from './app.service';

@Controller({
  path: 'm2',
  scope: Scope.REQUEST,
})
export class AppController2 {
  constructor(
    @Inject('M1_SERVICE') private M1_client: ClientProxy,
    @Inject(CONTEXT) private ctx: RequestContext, // scope 的时候
  ) {}

  @Get()
  t1() {
    // this.M1_client.
  }
  // 请求响应模式
  accumulate() {
    const pattern = { cmd: 'sum' };
    const payload = [1, 2, 3];
    // 注意这个默认都是返回一个 "冷Observable"
    this.ctx.pattern;
    return this.M1_client.send<number[]>(pattern, payload);
  }
}
