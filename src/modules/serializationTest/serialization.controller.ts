import {
  CacheInterceptor,
  ClassSerializerInterceptor,
  Controller,
  Get,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { RoleEntity, UserEntity } from './entity/user.entity';

@Controller('serialization')
export class SerializationController {
  // 不建议 全局使用 因为有可能会存在问题 除非你仔细评估之后 确实可以全局
  @SerializeOptions({
    excludePrefixes: ['_'], // _ 开头的属性 全排出
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('t1')
  getT1() {
    return {
      users: [
        new UserEntity({
          firstName: 'Joney',
          lastName: 'SLI',
          password: 'password',
          _pid: 0,
          role: new RoleEntity({
            id: 1,
            name: 'admin',
          }),
        }),
        new UserEntity({
          firstName: 'Joney',
          lastName: 'SLI',
          password: 'password',
          _pid: 0,
          role: new RoleEntity({
            id: 1,
            name: 'admin',
          }),
        }),
      ],
    };
  }
}
