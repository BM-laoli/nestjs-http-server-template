import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppController2 } from './app.controller2';
import { AppService } from './app.service';

// 连接到微服务 又两种方式一个是注入，一个是 直接加装饰器(不推荐)
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'M1_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'cats_queue',
          noAck: false,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [AppController, AppController2],
  providers: [],
})
export class AppModule {}
