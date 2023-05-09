import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import * as crypto from 'crypto';
import { Cookies } from './decorator/cookie.decorator';

export const cookieSecret = 'joney_';
@Controller('cookieSession')
export class CookieSessionController {
  @Get('t1')
  t1(@Req() request: Request) {
    // 简单获取cookie
    console.log(request.cookies);
    // 一般情况下企业级使用的时候 都会给cookie 进行加密(部分内容
    console.log(request.signedCookies);
  }

  @Get('t2')
  t2(@Res({ passthrough: true }) response: Response) {
    const valueStr = JSON.stringify({
      name: 'Joney',
      age: 24,
      address: 'CD',
      baseInfo: {
        f: 1,
      },
    });
    // 若 需要 加密请使用 signed: true
    // 默认会 去取 main中设置的 cookieSecret 拿值
    // 但.... 这有点拉胯 不建议使用 要用还请使用
    // crypto + 自定义 middleware 实现
    response.cookie('joney', valueStr, {
      signed: true,
    });
  }

  // 如果需要 更方便的获取 你可以实现一个装饰器
  @Get('t3')
  t3(@Cookies('joney') val: any) {
    console.log(val);
  }
}
