import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

// dto (Data Transfer Object) 数据传输对象
export class UserInfoDTO {
  @ApiProperty({
    description: '名称',
    default: '用户1',
  })
  @IsNotEmpty({ message: '用户名不允许为空' })
  username: string;

  @ApiProperty()
  @IsNotEmpty({ message: '密码不允许为空' })
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: '更新创建时间必选' })
  @IsNumber()
  update_time: number;

  @ApiProperty()
  @IsNotEmpty({ message: '创建时间必选' })
  create_time: number;

  @ApiProperty()
  @IsNotEmpty({ message: '状态必填' })
  state: number;
}
