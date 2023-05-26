import { Body, Controller, Get, Header, HttpCode, HttpStatus, Param, Post, Query, Redirect, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import  { Request,Response, } from 'express'
import { ApiBasicAuth, ApiBody, ApiExtraModels, ApiHeader, ApiOkResponse, ApiQuery, ApiResponse, ApiSecurity, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { BigTypeDto, Cat, CatDto, CreateCatDto, Dog, PaginatedDto, UserRole } from './dto/createDto';
import { log } from 'console';
import { ApiPaginatedResponse } from './decorator/apiPaginatedResponse.decorator';

@ApiTags('cats')
@ApiExtraModels(Cat, Dog, PaginatedDto,CatDto)
@Controller("cats")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('create')
  @ApiBody({type: [CreateCatDto] })
  createUser(@Body() createCatDto: CreateCatDto[] ){
    
    return 'ok'
  }

  // 设置为true 的时候表示可以多选 ，但...url将会是 /findUserByRole?role=Moderator&role=User
  @ApiQuery({ name: 'role', enum: UserRole, isArray:false })
  @Get('findUserByRole')
  filterByRole(@Query('role') role: UserRole = UserRole.User) {
    log('role',role)// Array 类型 会随着装饰器上 isArray 变化而变化
  }

  // 
  @ApiBody({
    schema: {
      type: 'array',
      items: {
        type: 'array',
        items: {
          type: 'number',
        },
      },
    },
  })
  @Post('t2')
  async create(@Body() coords: number[][]) {}


  @ApiTags('6')
  @ApiHeader({
    name: 'X-MyHeader',
    description: 'Custom header',
  })
  @Post('t3')
  t2(@Body() bigTypeDto: BigTypeDto ){}


  @ApiOkResponse({
    schema: {
      allOf: [ //allOf 是 OAS 3 提供的概念，用于涵盖各种与继承相关的用例。
        { $ref: getSchemaPath(PaginatedDto) },
        {
          properties: {
            results: {
              type: 'array',
              items: { $ref: getSchemaPath(CatDto) },
            },
          },
        },
      ],
    },
  })
  @Get('t4')
  async ts4(): Promise<PaginatedDto<CatDto>> {
    return this.genrateCatDto()
  }

  @ApiSecurity('basic')
  @ApiBasicAuth()
  @ApiPaginatedResponse(CatDto)
  @Get('t5')
  async ts5(): Promise<PaginatedDto<CatDto>> {
    return this.genrateCatDto()
  }
  
  genrateCatDto () {
    return Promise.resolve({
      limit:10,
      total:1,
      offset:1,
      results:[{
        name:'6',
        age:2,
        breed:'6666'
      }]
    })
  }
}

