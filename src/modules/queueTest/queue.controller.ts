import { Controller, Get } from '@nestjs/common';
import { AudioService } from './audio.service';
import { AudioConsumer } from './audio.consumer';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Controller('queue')
export class QueueController {
  constructor(
    @InjectQueue('audio') private audioQueue: Queue,
    private readonly audioConsumer: AudioConsumer,
  ) {}

  // 任务表现为序列化的JavaScript对象（因为它们被存储在 Redis 数据库中）
  async startAudioQueue() {
    // 注意任务有许多可选项配置 详见下文文档
    const job = await this.audioQueue.add('transcode', {
      foo: 'bar',
    });

    return job;
  }

  // 队列管理
  async pauseQueue() {
    await this.audioQueue.pause();
  }

  async resumeQueue() {
    await this.audioQueue.resume();
  }

  @Get('start')
  async start() {
    await this.startAudioQueue();
    return 1;
  }

  @Get('pause')
  pause() {
    return this.pauseQueue();
  }

  @Get('resume')
  resume() {
    return this.resumeQueue();
  }
}
