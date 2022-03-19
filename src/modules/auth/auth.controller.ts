import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { InterParams } from 'src/typings/controller';
import { Article } from 'src/entities/article.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 开始验证和加密
  // console.log('JWT验证 - Step 1: 用户请求登录');
  @Post('login')
  async login(@Body() loginParams: any) {
    const value = await this.authService.loginSingToken(loginParams);
    return value;
  }
}
