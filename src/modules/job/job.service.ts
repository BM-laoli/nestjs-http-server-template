import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';
import * as fs from 'fs';
import { join } from 'path';

// 清除日志目录和本地上传的文件oss临时文件

@Injectable()
export class JobService {
  emptyDir = (fileUrl) => {
    const files = fs.readdirSync(fileUrl); //读取该文件夹
    files.forEach(function (file) {
      const stats = fs.statSync(fileUrl + '/' + file);
      if (stats.isDirectory()) {
        this.emptyDir(fileUrl + '/' + file);
      } else {
        fs.unlinkSync(fileUrl + '/' + file);
      }
    });
  };

  // 每天晚上11点执行一次
  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  handleCron() {
    // 删除OSS文件和日志文件
    const OSSRootDir = join(__dirname, '../../../upload-oos');

    // 日志一般是转存 而不是删除哈，注意 这里只是简单的例子而已
    const accesslogDir = join(__dirname, '../../../logs/access');
    const appOutDir = join(__dirname, '../../../logs/app-out');
    const errorsDir = join(__dirname, '../../../logs/errors');

    this.emptyDir(OSSRootDir);

    this.emptyDir(accesslogDir);
    this.emptyDir(appOutDir);
    this.emptyDir(errorsDir);
  }

  // 手动运行
  // @Cron('10 * * * * *', {
  //   name: 'notifications',
  // })
  @Interval('notifications', 5000)
  handleTimeout() {
    console.log('66666');
  }
}
