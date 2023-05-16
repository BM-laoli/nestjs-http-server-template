import {
  Controller,
  Get,
  Inject,
  Logger,
  RequestTimeoutException,
  Scope,
} from '@nestjs/common';
import {
  CONTEXT,
  Ctx,
  EventPattern,
  MessagePattern,
  MqttContext,
  NatsContext,
  Payload,
  RedisContext,
  RequestContext,
  RmqContext,
} from '@nestjs/microservices';
import { from, fromEvent, Observable } from 'rxjs';
import { AppService } from './app.service';
import * as util from 'util';
import { KafkaMessage } from 'kafkajs';
interface Dragon {
  id: number;
  name: string;
}

type KillDragonMessage = Omit<KafkaMessage, 'value'> & {
  value: Pick<Dragon, 'id'>;
};

@Controller({
  scope: Scope.REQUEST,
})
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(CONTEXT) private ctx: RequestContext, // scope 的时候
  ) {}

  private readonly logger = new Logger(AppController.name);
  private readonly dragons = [
    { id: 1, name: 'Smaug' },
    { id: 2, name: 'Ancalagon The Black' },
    { id: 3, name: 'Glaurung' },
  ];

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

  // MQTT
  // @MessagePattern('sensors/+/temperature/+') 支持通配符
  @MessagePattern('notificationsMQTT')
  getNotificationsMQTT(@Payload() data: number[], @Ctx() context: MqttContext) {
    console.log(`Topic: ${context.getTopic()}`); // notifications
    console.log(222);

    // 如果你需要访问 原始的mqtt数据包 请使用
    console.log(context.getPacket());
  }

  // MQTT2
  @MessagePattern('replace-emoji')
  replaceEmoji(@Payload() data: string, @Ctx() context: MqttContext): string {
    const {
      properties: { userProperties },
    } = context.getPacket();

    console.log('2');

    return userProperties['x-version'] === '1.0.0' ? '🐱' : '🐈';
  }

  // NTAS
  @MessagePattern('notificationsNATS')
  notificationsNATS(@Payload() data: number[], @Ctx() context: NatsContext) {
    console.log(`Subject: ${context.getSubject()}`);
  }

  // NATS 可以设置 标头
  @MessagePattern('replace-emoji-NATS')
  replaceEmojiNATS(
    @Payload() data: string,
    @Ctx() context: NatsContext,
  ): string {
    const headers = context.getHeaders();
    // 这个返回时一个是get 不要相信官方给写的 headers['x-version']
    return headers.get('x-version') === '1.0.0' ? '🐱' : '🐈';
  }

  // RMQ
  @MessagePattern('notificationsRMQ')
  getNotificationsRMQ(@Payload() data: number[], @Ctx() context: RmqContext) {
    console.log(`Pattern: ${context.getPattern()}`);
    console.log(`Pattern: ${context.getMessage()}`); // 获取原始数据
    // 要检索对 RabbitMQ 通道的引用 请参考
    console.log(context.getChannelRef());
    console.log(data);

    // 如果 我们设置了 noAck: false,需要 手动的check一下
    context.getChannelRef().ack(context.getMessage());
    return '666';
  }

  // RMQ 同样的也支持 设置头信息等操作
  @MessagePattern('replace-emoji-RMQ')
  replaceEmojiRMQ(@Payload() data: string, @Ctx() context: RmqContext): string {
    const {
      properties: { headers },
    } = context.getMessage();
    return headers['x-version'] === '1.0.0' ? '🐱' : '🐈';
  }

  @MessagePattern('hero.kill.dragon')
  onKillDragon(@Payload() message: KillDragonMessage) {
    this.logger.log(`[hero.kill.dragon] message = ${util.inspect(message)}`);

    const dragonId = message?.value?.id ?? null;
    if (!dragonId) {
      this.logger.error('Failed to determine Dragon ID');
      return;
    }

    const dragon = this.dragons.find(({ id }) => id === dragonId);
    if (!dragon) {
      this.logger.error('Failed to fetch dragon from the database!');
      return;
    }

    this.logger.log(`Hero killed ${dragon.name}!`);

    return dragon;
  }
}
