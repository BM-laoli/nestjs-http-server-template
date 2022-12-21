import { Global, Module } from '@nestjs/common';
import { JobService } from './job.service';

// 这个模块专门处理job 如果其他模块由job的需求，全收敛到这里来处理
@Global()
@Module({
  providers: [JobService],
  exports: [JobService],
})
export class JobModule {}
