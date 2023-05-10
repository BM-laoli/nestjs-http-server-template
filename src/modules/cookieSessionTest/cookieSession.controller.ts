import { Controller, Get, Req, Res, Session } from '@nestjs/common';
import { Request, Response } from 'express';
import { Cookies } from './decorator/cookie.decorator';
import { log } from 'console';

export const cookieSecret = 'joney_cookie';
export const seesionSecret = 'joney_session';
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

  @Get('t4')
  t4(@Req() request: Request) {
    log(request.session);
    return 0;
  }

  @Get('t5')
  t5(@Session() session: Record<string, any>) {
    log(session);
    return 0;
  }
}
