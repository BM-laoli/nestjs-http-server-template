import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Article } from 'src/entities/article.entity';
import { Tag } from 'src/entities/tag.entity';
import { User } from 'src/entities/user.entity';

// dto (Data Transfer Object) 数据传输对象
export class UserInfoDTO {
  @IsNotEmpty({ message: '用户名不允许为空' })
  readonly username: string;

  @IsNotEmpty({ message: '密码不允许为空' })
  readonly password: string;

  @IsNotEmpty({ message: '更新创建时间必选' })
  @IsNumber()
  readonly update_time: number;

  @IsNotEmpty({ message: '创建时间必选' })
  readonly create_time: number;

  @IsNotEmpty({ message: '状态必填' })
  readonly state: number;
}
