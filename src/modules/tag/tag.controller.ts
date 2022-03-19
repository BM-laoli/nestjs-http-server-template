import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { Request, Response } from 'express';
import { InterParams } from 'src/typings/controller';
import { Tag } from 'src/entities/tag.entity';
import { AuthGuard } from '@nestjs/passport';
import { HttpReqTransformInterceptor } from 'src/filter/http-req.filter';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Tag相关')
@ApiBearerAuth()
@Controller('tag')
@UseInterceptors(new HttpReqTransformInterceptor<any>()) // 统一返回体
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/tags')
  async getAll() {
    const value = await this.tagService.getAll();
    return value;
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
}
