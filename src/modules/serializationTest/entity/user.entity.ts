import { Exclude, Expose, Transform } from 'class-transformer';

export class RoleEntity {
  id: number;
  name: string;

  constructor(partial: Partial<RoleEntity>) {
    Object.assign(this, partial);
  }
}

// 比如这样的实体
export class UserEntity {
  id: number;
  firstName: string;
  lastName: string;
  _pid: number;

  // 排出某个
  @Exclude()
  password: string;

  // 修改别名  class 的get 和set 方法 非常基础的js知识 不赘述
  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // 如果你需要 返回其中的 某个 而不是整个object 可以使用
  @Transform(({ value }) => value.name)
  role: RoleEntity;

  // 如果你 需要使用 深入到底层 请修改
  // 传递的选项作为底层 classToPlain() 函数的第二个参数传递。在本例中，我们自动排除了所有以_前缀开头的属性。
  // 详细见  serialization.controller @SerializeOptions 方法

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
