import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
// @Controller()
@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // 基础路由
  @Get('/send')
  sendMessage(): string {
    // 这样做会有问题吗？这样做不会有问题
    //  JavaScript 对象或数组时，它将自动序列化为 JSON。但是，当它返回一个 JavaScript 基本类型（例如string、number、boolean）时， Nest 将只发送值，而不尝试序列化它。
    // 这使响应处理变得简单：只需要返回值，其余的由 Nest 负责。比如你的http状态吗什么的也是由Nest为你做了
    return '222';
  }

  // 如何获取req 和res 对象，并且手动的设置值 cookie什么之类的
  @Get('/getReq')
  getReq(@Req() request: Request, @Res() response: Response): any {
    console.log(request.headers); // 通过获取到ts的类型 我想你应该是理解这个对象的意义的 如果你调用了Req 和Res那么这个时候你就需要手动的res,sed()了，不推荐 如果你直接
    // 这样做将会导致 失去与依赖于 Nest 标准响应处理的 Nest 功能（例如，拦截器（Interceptors） 和 @HttpCode()/@Header() 装饰器）的兼容性
    // 要解决此问题，可以将 passthrough 选项设置为 true 比如下面的函数 “/getReq2” 这样就能兼容，你只定义了code 其它的定义依然交由Nest处理
    response.status(HttpStatus.OK).send();
  }

  @Get('/getReq2')
  getReq2(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): any {
    response.status(HttpStatus.OK);
    return [];
  }

  // 如何获取get的query参数和parma参数
  @Get('getQueryAndParam/:id?')
  getQuery(
    @Param('id') params: string,
    @Query() query: { value: number; qx: number },
  ): any {
    // 实际上你可以直接通过req去拿，当然通过注入也是可以的
    console.log('params', params);
    console.log('query', query);
    return '2222';
  }

  // 如何护去POST PUT 等请求的Body参数
  @Post('postQuery/:id?')
  postQuery(
    @Param('id') params: string,
    @Body() body: { value: number; qx: number },
  ): any {
    // 实际上你可以直接通过req去拿，当然通过注入也是可以的
    console.log('params', params);
    console.log('body', body);
    return 'PostQuery';
  }

  // 如何自定义状态吗，其实非常的简单 使用装饰器注入就好了@HttpCode 另外同类型的还有 @Redirect  @Header
  @Get('userState')
  @HttpCode(204)
  @Header('Cache-Control', 'none')
  userState(): any {
    return 'userState';
  }

  // 通过装饰器 重定向也非常容易实现
  @Get('docs')
  @Redirect('https://docs.nestjs.com', 302)
  getDocs(@Query('version') version) {
    if (version && version === '5') {
      return { url: 'https://docs.nestjs.com/v5/' };
    }
  }

  // 有关路有和参数处理以及 Controller 我们就讲怎么多，我们看看 Controller 是通过什么方式加载到main上去的，请前往app.module.ts
}
