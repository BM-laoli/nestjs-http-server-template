/* eslint-disable prefer-const */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfoDTO } from 'src/dto/user.dto';
import { User } from 'src/entities/user.entity';
import { encryptPassword } from 'src/utils/crypt';
import { getRepository, Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAll(): Promise<User[]> {
    let list;
    /*
      第一种方式直接调用Repository Api的相关方法
      联表查询：
      第一个参数：relations: ['tags'] 属性
      (注意：tags 字段来源于 user 实体类中的 tags 字段)
    */
    // list = await this.userRepository.find({ relations: ['tags'] });
    list = await this.userRepository.find();

    const a = {};
    // // @ts-ignore
    // console.log(a.a.x);

    /*
      第二种方式构建QueryBuilder查询
      // 这里讲个个人理解：getConnection()、getManager()、getRepository()三者的区别
      // getConnection().manager === getManager()
      // getConnection().getRepository() === getRepository()
      // getManager().getRepository() === getRepository()
      // getConnection()获取连接，其实就是将数据库连接所有的内容都拿到了
      // getManager()获取实体存储库集合，这样就可以管理任何实体，并且随意使用任何实体
      // getRepository()获取具体实体，然后可以对具体实体操作
      // 开发中三者使用方式：三个都能使用.createQueryBuilder()方法构建内容，但是构建的结构有所区别
      // 例如：
      /* 获取user表所有数据getConnection()方式
        getConnection()
        .createQueryBuilder()
        .select('user')
        .from(User, 'user')
        .getMany();
      */
    /* 获取user表所有数据getManager()方式
        getManager()
        .createQueryBuilder(User,'user')
        .getMany();
      */
    /* 获取user表所有数据getRepository()方式
        getRepository(User)
        .createQueryBuilder('user')
        .getMany();
      */

    // User、tags 指的是实体类的名称
    // list = await getRepository(User)
    //   .createQueryBuilder('User')
    //   .leftJoinAndSelect('User.tags', 'ta.create_by')
    //   .getMany();

    /*
      第三种方式直接使用getManager().query("sql语句")执行原生sql操作即可。
      补充：
      1.三种方式中以第一种和第二种方式使用最多，
        争取能用第一种就用第一种，否则可选择第二种，实在不行则使用第三种。
      2.相关方法的参数请参考官网
    */
    return list;
  }

  async getUerById(id: number) {
    // return await getRepository(User)
    //   .createQueryBuilder('User')
    //   .where('User.id = :id', { id: id })
    //   .leftJoinAndSelect('User.tags', 'ta.create_by')
    //   .getOne();

    return this.userRepository.findOne(id, {
      relations: ['tags'],
    });
  }

  create(user: UserInfoDTO) {
    // 对于mysql 来说是save mongodb也许说create
    user.password = encryptPassword(user.password);
    return this.userRepository.save(user);
  }

  updateById(id: number, data: User) {
    return this.userRepository.update(id, data);
  }

  deleteById(id: number) {
    return this.userRepository.delete(id);
  }

  async findOne(username: any) {
    return this.userRepository.findOne({ username: username });
  }
}
