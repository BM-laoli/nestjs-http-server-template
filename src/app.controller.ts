import { Body, Controller, Get, Header, HttpCode, HttpStatus, Param, Post, Query, Redirect, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import  { Request,Response, } from 'express'
import { ConfigService } from './tagModule/Tag.module';
// import { TagService } from './tagModule/tag.service';
@Controller("main")
export class AppController {
  private helloMessage: string;

  constructor(
    // private readonly appService: AppService,  // 模块中provider使用非常的简单在这里加入就好了
    // private readonly tagService: TagService,
    private readonly configService: ConfigService,  // 动态模块 
  ) {
    this.helloMessage = configService.get("value1")
  }

  

  @Get()
  getHello(): string {
    // return this.appService.getHello();
    return this.helloMessage;
  }

}
