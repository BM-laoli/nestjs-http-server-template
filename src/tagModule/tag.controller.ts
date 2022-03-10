import { Body, Controller, Get, Header, HttpCode, HttpStatus, Param, Post, Query, Redirect, Req, Res } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller("tag")
export class TagController {
  constructor(private readonly tagService:  TagService) {}

  @Get()
  getHello(): string {
    return this.tagService.getHello();
  }

}
