import {
  Controller,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import * as util from 'util';

interface Dragon {
  id: number;
  name: string;
}

@Injectable()
export class KafkaService implements OnModuleInit {
  private readonly logger = new Logger(KafkaService.name);

  // Dragon IDs from 1 to 3 are available
  private readonly minDragons = 1;
  private readonly maxDragons = 3;

  constructor(@Inject('M1_SERVICE') private readonly client: ClientKafka) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('hero.kill.dragon');

    // await this.client.connect();
  }

  private chooseDragonId(): number {
    return Math.floor(
      Math.random() * (this.maxDragons - this.minDragons + 1) + this.minDragons,
    );
  }

  // 简单的使用
  // async killDragon() {
  //   this.logger.log('Killing the dragon...');
  //   this.logger.log('Success! Sending message to Kafka...');

  //   const dragon: Pick<Dragon, 'id'> = { id: this.chooseDragonId() };
  //   const killedDragon = await lastValueFrom(
  //     this.client.send<Dragon>('hero.kill.dragon', dragon),
  //   );

  //   this.logger.log(`Consumer response: ${util.inspect(killedDragon)}`);

  //   return `${killedDragon} is dead! The kingdom is saved!`;
  // }

  // 测试 满足同时分区
  async killDragon() {
    const value = {
      id: 0,
      name: 'doc',
      heroId: 1,
      dragonId: 3,
    };

    const dragon: Pick<Dragon, 'id'> = value;
    const killedDragon = await lastValueFrom(
      this.client.send<Dragon>('hero.kill.dragon', dragon),
    );

    this.logger.log(`Consumer response: ${util.inspect(killedDragon)}`);

    return `${killedDragon} is dead! The kingdom is saved!`;
  }
}
