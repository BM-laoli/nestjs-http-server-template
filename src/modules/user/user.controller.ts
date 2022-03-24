import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UsePipes,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { UserInfoDTO } from 'src/dto/user.dto';
import { User } from 'src/entities/user.entity';
import { HttpReqTransformInterceptor } from 'src/filter/http-req.filter';
import { ValidationPipe } from 'src/pipe/validation.pipe';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { ClientProxy } from '@nestjs/microservices';
import Rx, { observable, pipe, of } from 'rxjs';
@ApiTags('User相关')
@Controller('user')
@UseInterceptors(new HttpReqTransformInterceptor<any>()) // 统一返回体
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject('NEST_MICRO') private client: ClientProxy,
  ) {}

  // 启用一个人微服务
  @Post('/math/wordcount')
  async wordCount(@Body() { text }: { text: string }) {
    const value2 = await this.client.send('math:wordcount', text).toPromise();
    await this.client.emit('math:log', text).toPromise();

    return value2;
  }

  @Get('/users')
  async getHello() {
    const value = await this.userService.getAll();
    return value;
  }

  @Get('/:id')
  async getUserById(@Param() params: { id: number }) {
    const value = await this.userService.getUerById(params.id);
    return value;
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() userInfo: UserInfoDTO) {
    const value = await this.userService.create(userInfo);
    return value;
  }

  @Put('/:id')
  async updateUser(@Param() params: { id: number }, @Body() userInfo: User) {
    const value = await this.userService.updateById(params.id, userInfo);
    return value;
  }

  @Delete('/:id')
  async deleteUser(@Param() params: { id: number }) {
    const value = await this.userService.deleteById(params.id);
    return value;
  }
}
