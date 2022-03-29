import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { Request, Response } from 'express';
import { InterParams } from 'src/typings/controller';
import { Tag } from 'src/entities/tag.entity';
import { AuthGuard } from '@nestjs/passport';
import { HttpReqTransformInterceptor } from 'src/interceptor/http-req.interceptor';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SchedulerRegistry } from '@nestjs/schedule';

@ApiTags('Tag相关')
@ApiBearerAuth()
@Controller('tag')
@UseInterceptors(new HttpReqTransformInterceptor<any>()) // 统一返回体
export class TagController {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private readonly tagService: TagService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/tags')
  async getAll() {
    // const value = await this.tagService.getAll();
    // return value;
    throw new UnauthorizedException('您账户已经在另一处登陆，请重新登陆');
  }

  @UseGuards(AuthGuard('local'))
  @Post()
  async createTag(@Body() tagInfo: Tag) {
    const value = await this.tagService.create(tagInfo);
    return value;
  }

  @Put('/:id')
  async updateTag(@Param() params: InterParams, @Body() tagInfo: Tag) {
    const value = await this.tagService.updateById(params.id, tagInfo);
    return value;
  }

  @Delete('/:id')
  async deleteTag(@Param() params: InterParams) {
    const value = this.tagService.deleteById(params.id);
    return value;
  }

  //测试job
  @Post('/job')
  async stopJob(@Body() body: { start: boolean }) {
    this.schedulerRegistry.deleteInterval('notifications');
    // 如果是Cron的新式这里会变得不一样
  }
}
