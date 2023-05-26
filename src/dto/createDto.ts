import { ApiProperty, ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger';
import { log } from 'console';
import { types } from 'util';

export enum UserRole {
  Admin = 'Admin',
  Moderator = 'Moderator',
  User = 'User',
}

class NodeBranch {
  @ApiProperty({
    type: String
  })
  name:string

  @ApiProperty({
    type: Number
  })
  id:number
}

export class CreateCatDto {
  @ApiProperty()
  name: string;

  @ApiProperty({
    default:1,
    description:"age",
    minimum:1,
    type:Number,
    required:true
  })
  age: number;

  @ApiProperty({
    type: [String]
  })
  breed: string[];

  // 如果有循环依赖 请使用
  @ApiProperty({
    type: () => NodeBranch
  })
  nodeBranch: NodeBranch;

  // 两种方式使用 enum
  // @ApiProperty({
  //   enum:['Admin','Moderator','User']
  // })
  // role: string

  @ApiProperty({
    enum:UserRole
  })
  role: UserRole


  @ApiProperty({
    type: () => {
      const $refModel = getSchemaPath(NodeBranch)
      // 这种情况下 可以直接获取到NodeBranch 的model 引用，在使用 mongodb的时候
      // 很有帮助
      return String
    }
  })
  roles: UserRole
}

export class Cat {
  @ApiProperty()
  catName:string
}

export class Dog {
  @ApiProperty()
  dogName:string
}

export class BigTypeDto {
  @ApiProperty({
    oneOf:[ // 不仅仅有 这个
      { $ref: getSchemaPath(Cat) },
      { $ref: getSchemaPath(Dog) },
    ]
  })
  pet:Cat | Dog
}


export class PaginatedDto<TData> {
  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;

  results: TData[];
}


export class CatDto {
  @ApiProperty({
  })
  name: string;

  @ApiProperty()
  age: number;

  @ApiProperty()
  breed: string;
}