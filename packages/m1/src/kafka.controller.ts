import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import * as util from 'util';
import { KafkaMessage } from 'kafkajs';

interface Dragon {
  id: number;
  name: string;
}

type KillDragonMessage = Omit<KafkaMessage, 'value'> & {
  value: Pick<Dragon, 'id'>;
};

// Simplified example: move method implementations to the service ofc
@Controller()
export class KafkaController {
  private readonly logger = new Logger(KafkaController.name);

  @MessagePattern('hero.kill.dragon')
  onKillDragon(
    @Payload() message: KillDragonMessage,
    @Ctx() context: KafkaContext,
  ) {
    const dragons = [
      { id: 1, name: 'Smaug' },
      { id: 2, name: 'Ancalagon The Black' },
      { id: 3, name: 'Glaurung' },
    ];
    this.logger.log(`[hero.kill.dragon] message = ${util.inspect(message)}`);

    // 简单的使用 直接返回 结果
    // return dragons;

    // 获取 原始信息
    // context.getTopic()
    // const originalMessage = context.getMessage();
    // const partition = context.getPartition();
    // const { headers, timestamp } = originalMessage;

    // 下面的返回 可以满足 “共同分区要求” key value
    return {
      headers: {
        realm: 'Nest',
      },
      key: message.value,
      value: dragons,
    };
  }
}
