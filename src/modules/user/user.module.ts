import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Tag } from 'src/entities/tag.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User, Tag])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
