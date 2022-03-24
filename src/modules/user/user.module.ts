import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Tag } from 'src/entities/tag.entity';
import { ClientsModule, Transport } from '@nestjs/microservices'; // 注册一个用于对微服务进行数据传输的客户端

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NEST_MICRO',
        transport: Transport.TCP,
        options: {
          host: '192.168.101.2',
          port: 3333,
        },
      },
    ]),
    TypeOrmModule.forFeature([User, Tag]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
