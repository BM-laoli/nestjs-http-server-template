import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { Request, Response } from 'express';
import { InterParams } from 'src/typings/controller';
import { Tag } from 'src/entities/tag.entity';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('/tags')
  async getAll() {
    const value = await this.tagService.getAll();
    return value;
  }

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
