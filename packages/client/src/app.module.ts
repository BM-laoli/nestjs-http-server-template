import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppController2 } from './app.controller2';
import { AppService } from './app.service';
import { GRPCController } from './gRPC.controller';
import { KafkaService } from './kafka.service';

// 连接到微服务 又两种方式一个是注入，一个是 直接加装饰器(不推荐)
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'HERO_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'hero', // ['hero', 'hero2']
          protoPath: join(__dirname, './hero/hero.proto'), // ['./hero/hero.proto', './hero/hero2.proto']
        },
      },
    ]),
  ],
  controllers: [GRPCController],
  providers: [],
})
export class AppModule {}
