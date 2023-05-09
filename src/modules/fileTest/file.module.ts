import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000, //  最大允许 超时 5s
      maxRedirects: 5, // 失败之后的 最大retry 次数
    }),
  ],
  controllers: [FileController],
  providers: [],
})
export class FileModule {}
