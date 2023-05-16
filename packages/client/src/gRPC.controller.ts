import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, GrpcMethod, GrpcStreamCall } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Observable, of, ReplaySubject, toArray } from 'rxjs';

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

@Controller('hero')
export class GRPCController implements OnModuleInit {
  private readonly items: Hero[] = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Doe' },
  ];
  private heroService: HeroService;
  constructor(@Inject('HERO_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.heroService = this.client.getService<HeroService>('HeroService');
  }

  @Get()
  getHero(): Observable<any> {
    // 对应的就是 HeroesService 里的FindOne 方法
    // 注意 gRPC 客户端不会发送名称中包含下划线的字段 （要发请设置
    //options.loader.keepcase = true
    return this.heroService.findOne({ id: 1 });
  }

  @Get('stream')
  getMany() {
    const ids$ = new ReplaySubject<HeroById>();
    ids$.next({ id: 1 });
    ids$.next({ id: 2 });
    ids$.complete();

    const stream = this.heroService.findMany(ids$.asObservable());
    return stream.pipe(toArray());
  }
}
