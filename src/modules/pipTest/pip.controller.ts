import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { TestDto } from './dto/test.dto';

@Controller('pip')
export class PipController {
  @Get('t1/:id')
  test1(@Param('id', ParseIntPipe) id: number) {
    // 参数级别绑定
    return 't1';
  }

  @Get('t2/:id')
  test2(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    // 使用实例 而不是class class会在ioc 容器内部处理掉
    return 't2';
  }

  @Get('t3')
  test3(@Query('id', ParseIntPipe) id: number) {
    return 't3';
  }

  @Post('t4')
  test4(@Body() testDto: TestDto) {
    return 't4';
  }
}
