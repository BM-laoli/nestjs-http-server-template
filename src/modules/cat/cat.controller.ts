import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { CatService } from './cat.service';
import { Cat, CatEntity } from './schemas/cat.schema';
import { ClassSerializerMongoModelInterceptor } from './interceptor/serializerMongo.interceptor';
import { log } from 'console';
import { MongoEntityClass } from './decorator/MongoEntity.decorator';
import { ClassSerializerMongoModel2Interceptor } from './interceptor/serializerMongo2.interceptor';

@Controller('cat')
@SerializeOptions({
  excludePrefixes: ['__v', '_id'],
})
@UseInterceptors(ClassSerializerMongoModel2Interceptor)
export class CatController {
  constructor(private readonly catService: CatService) {}

  @Post('create')
  create(@Body() body: any) {
    return this.catService.create(body);
  }

  // @MongoEntityClass(CatEntity)
  // @UseInterceptors(ClassSerializerMongoModelInterceptor)
  // 或者丢到全局去
  @Get('cat')
  async getCat(): Promise<Array<Cat>> {
    const value = await this.catService.getCat();
    log(value);
    return value;
  }
}
