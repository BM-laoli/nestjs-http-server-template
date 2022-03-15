import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UsePipes,
} from '@nestjs/common';
import { UserInfoDTO } from 'src/dto/user.dto';
import { User } from 'src/entities/user.entity';
import { ValidationPipe } from 'src/pipe/validation.pipe';
import { UserService } from './user.service';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
