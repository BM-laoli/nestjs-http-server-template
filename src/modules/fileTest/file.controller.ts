import { Controller, Get, StreamableFile, Response } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { createReadStream } from 'fs';
import { join } from 'path';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Controller('file')
export class FileController {
  constructor(private readonly httpService: HttpService) {}

  @Get('t1')
  getFile(): StreamableFile {
    // 请不要使用 @res 要不然，其它的全局错误拦截器 将连接不到你的各种error
    // 那就是代价 若一定要使用 请开启 passthrough: true 看下面的例子
    // 具体文档  https://docs.nestjs.com/controllers#library-specific-approach
    const file = createReadStream(join(process.cwd(), 'package.json'));
    return new StreamableFile(file);
  }

  @Get('t2')
  getFile2(@Response({ passthrough: true }) res): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'package.json'));
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="package.json"',
    });
    return new StreamableFile(file);
  }

  @Get('t3')
  testAxios(): Observable<AxiosResponse<any> | any> {
    return this.httpService.get('https://api.wrdan.com/hitokoto').pipe(
      map((data) => {
        return {
          data: data.data,
          success: true,
        };
      }),
      catchError((err) => {
        return of({
          success: false,
          data: null,
        });
      }),
    );
  }
}
