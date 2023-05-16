import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import {
  ClientGrpc,
  GrpcMethod,
  GrpcStreamMethod,
} from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Observable, Subject } from 'rxjs';

export interface Hero {
  id: number;
  name: string;
}

export interface HeroById {
  id: number;
}

interface HeroService {
  findOne(data: HeroById): Observable<Hero>;
  findMany(upstream: Observable<HeroById>): Observable<Hero>;
}

@Controller()
export class GRPCController {
  private readonly items: Hero[] = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Doe' },
  ];

  // 简单的例子
  // 对应的就是 HeroService 里的FindOne 方法
  // 这两个参数 都是可选项 如果 findOne 和FindOne 一样 （findOne
  // 会自动转大驼峰 ，那么可以忽略 FindOne 参数
  // 如果 HeroService 和 Class HeroService 一一致 那么这个 HeroService
  // 参数也可以省去，但是不建议

  @GrpcMethod('HeroService', 'FindOne')
  findOne(
    data: HeroById,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Hero {
    return this.items.find(({ id }) => id === data.id);
  }

  // 我们能不能实现 流 ?
  // gRPC 本身支持长期实时连接，通常称为 .流对于聊天、观察或块数据传输等情况很有用
  // Nest 有两种 方式实现

  // RxJS + handler
  @GrpcStreamMethod('HeroService')
  findMany(data$: Observable<HeroById>): Observable<Hero> {
    const hero$ = new Subject<Hero>();

    const onNext = (heroById: HeroById) => {
      const item = this.items.find(({ id }) => id === heroById.id);
      hero$.next(item);
    };
    const onComplete = () => hero$.complete();
    data$.subscribe({
      next: onNext,
      complete: onComplete,
    });

    return hero$.asObservable();
  }
}
