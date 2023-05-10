import { Controller, Get, Param, Query, Render, Res } from '@nestjs/common';
import { log } from 'console';
import { Response } from 'express';

@Controller('pages')
export class PageController {
  @Get()
  @Render('home')
  root() {
    return {
      title: 'Home',
      message: 'Hello world!',
    };
  }

  // 动态渲染
  @Get('p1')
  // 注意 你不能使用 passthrough: true
  p1(@Res() res: Response) {
    return res.render('p1', {
      title: 'P1',
      message: 'Hello world!',
    });
  }

  // 大部分情况下 我们用不到 动态渲染，大多数情况下是传递参数
  @Get('p2/:id')
  @Render('p1')
  p2(@Param('id') id: string) {
    log(id);
    return {
      title: id,
      message: 'Hello world!',
    };
  }

  @Get('message')
  @Render('message')
  renderMessage() {
    return {};
  }

  @Get('message2')
  @Render('message2')
  renderMessage2() {
    return {};
  }
}
