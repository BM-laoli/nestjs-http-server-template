import { Module } from '@nestjs/common';
import { QueueController } from './queue.controller';
import { QueueModuleService } from './queue.service';
import { BullModule } from '@nestjs/bull';
import { AudioService } from './audio.service';
import { AudioConsumer } from './audio.consumer';
import { ConfigService } from '@nestjs/config';
@Module({
  imports: [
    // 注册队列 名为audio 它有很多属性，请参考源代码中的 注释
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('MONGOOSE_HOST'),
          port: 6379,
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'audio',
    }),
  ],
  controllers: [QueueController],
  providers: [QueueModuleService, AudioConsumer, AudioService],
})
export class QueueModule {}
