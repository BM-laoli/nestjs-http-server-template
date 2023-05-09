import {
  Processor,
  Process,
  OnQueueActive,
  OnGlobalQueueCompleted,
  OnQueueCompleted,
} from '@nestjs/bull';
import { Job } from 'bull';
import { log } from 'console';

@Processor('audio')
export class AudioConsumer {
  // 消费者
  // 在工作空闲或者队列中有消息要处理的时候被自动调用
  @Process('transcode')
  async transcode(job: Job<unknown>) {
    // 注意这个参数 仅作为参数，处理完之后才可以访问 也就是 doSomething之后
    let progress = 0;
    for (let i = 0; i < 100; i++) {
      // await doSomething(job.data);
      progress += 10;
      job.progress(progress);
      // progress 用来更新 job进程
    }
    return progress;
    // 它返回一个 数据JS object
  }

  // 监听者1 Active时监听 注意有许多种类型的状态监听 而且还会区分 全局（分布式/ 本地的 两类
  @OnQueueActive({ name: 'transcode' })
  onActive(job: Job) {
    log('5555');
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  // 监听者2 完成时 监听
  @OnQueueCompleted({
    name: 'transcode',
  })
  async onQueueCompleted(jobId: number, result: any) {
    // const job = await this.que.getJob(jobId);
    await this.mockJob(6000);
    console.log('(Global) on completed: job ', jobId, ' -> result: ', result);
  }

  // 监听者2 完成时 监听(全局)
  @OnGlobalQueueCompleted({
    name: 'transcode',
  })
  async onGlobalCompleted(jobId: number, result: any) {
    await this.mockJob(6000);
    console.log('(Global) on completed: job ', jobId, ' -> result: ', result);
  }

  // 测试方法 模拟 堵塞任务
  async mockJob(time: number) {
    return new Promise((resvole, reject) => {
      setTimeout(() => resvole('1'), time);
    });
  }
}
