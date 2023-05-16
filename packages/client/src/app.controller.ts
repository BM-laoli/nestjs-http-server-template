import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Req,
  Res,
  Scope,
} from '@nestjs/common';
import {
  ClientProxy,
  MqttRecordBuilder,
  NatsRecordBuilder,
  RmqRecordBuilder,
  ClientKafka,
} from '@nestjs/microservices';
import { Response } from 'express';
import { lastValueFrom, of } from 'rxjs';
import * as nats from 'nats';
import { KafkaService } from './kafka.service';
@Controller('m1')
export class AppController {
  constructor(
    private readonly kafkaService: KafkaService,
    @Inject('M1_SERVICE') private M1_client: ClientKafka,
  ) {}

  @Get()
  // t1(@Res() res: Response) {
  t1() {
    // this.M1_client.
    // return this.accumulate();
    // this.accumulate().subscribe((it) => {
    //   res.status(HttpStatus.OK).send(`${it}--`);
    // });
    // return this.accumulateSync();
    // return this.accumulateObservable();
    // return this.publish();
    // return this.publish2();
    // return this.publishToRedis();
    // this.publishToMQTT();
    // this.publishToMQTT().subscribe((it) => {
    //   console.log(it);
    // });
    // this.publishToNAST();
    // this.publishToRMQ();
    this.publicToKafka();
    return 0;
  }

  // 请求响应模式
  accumulate() {
    const pattern = { cmd: 'sum' };
    const payload = [1, 2, 3];
    // 注意这个默认都是返回一个 "冷Observable"
    return this.M1_client.send<number[]>(pattern, payload);
  }

  async accumulateSync() {
    const pattern = { cmd: 'sumSync' };
    const payload = [1, 2, 3, 4];

    const value = await lastValueFrom(
      this.M1_client.send<number[]>(pattern, payload),
    );

    return value;
  }

  accumulateObservable() {
    const pattern = { cmd: 'sumObservable' };
    const payload = [1, 2, 3, 4, 5];

    // 模拟操作 可以使用 pipe(timeout(5000)) 这个操作符
    return this.M1_client.send<number[]>(pattern, payload);
  }

  // 发送事件 注意啊这个返回的是 一个热的Observable
  async publish() {
    this.M1_client.emit<number>('user_created', 666);
  }

  async publish2() {
    this.M1_client.emit<number>('time.use.*', 2123);
  }

  // redis
  async publishToRedis() {
    this.M1_client.emit<number>('notifications', 2123);
  }

  // MQTT
  publishToMQTT() {
    // this.M1_client.emit<number>('notificationsMQTT', {
    //   name: 6666,
    // });

    // 配置 消息选项
    const userProperties = { 'x-version': '1.0.0' };
    const record = new MqttRecordBuilder(':cat:')
      .setProperties({ userProperties })
      .setQoS(1)
      .build();
    console.log(record);

    return this.M1_client.send('replace-emoji', record);
  }

  // NAST
  publishToNAST() {
    // this.M1_client.emit<number>('notificationsNATS', {
    //   name: 6666,
    // });

    // 配置 消息选项
    const headers = nats.headers();
    headers.set('x-version', '1.0.0');
    const record = new NatsRecordBuilder(':cat:').setHeaders(headers).build();

    this.M1_client.send('replace-emoji-NATS', record).subscribe((it) => {
      console.log(it);
    });
  }

  // RMQ
  publishToRMQ() {
    this.M1_client.send('notificationsRMQ', {
      name: 'RMQ',
    }).subscribe((it) => {
      console.log(it);
    });
    // const message = ':cat:';
    // const record = new RmqRecordBuilder(message)
    //   .setOptions({
    //     headers: {
    //       ['x-version']: '1.0.0',
    //     },
    //     priority: 3,
    //   })
    //   .build();

    // this.M1_client.send('replace-emoji-RMQ', record).subscribe((it) => {
    //   console.log(it);
    // });
  }

  // Kafka
  async publicToKafka() {
    const value = await this.kafkaService.killDragon();
    console.log(value);
  }
}
