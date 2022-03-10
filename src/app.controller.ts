import { Body, Controller, Get, Header, HttpCode, HttpStatus, Inject, Injectable, Optional, Param, Post, Query, Redirect, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import  { Request,Response, } from 'express'
@Controller("")
export class AppController {
  // CatsService 是通过类构造函数注入的。注意这里使用了私有的只读语法。这意味着我们已经在同一位置创建并初始化了 catsService 成员。
  // 通常这样的设计模式 也被称为 依赖注入，前面我们也提到过Nest大量的设计借鉴了 angular 所以 这个文档有详细说明 https://angular.cn/guide/dependency-injection
  constructor(
    private readonly appService: AppService,
  ) {}
    // 注意⚠️  你还需要把你的 provider 放入模块中 进行声明 详情见app.module.ts  

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

}
