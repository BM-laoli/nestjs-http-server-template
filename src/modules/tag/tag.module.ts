import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from 'src/entities/tag.entity';
import { User } from 'src/entities/user.entity';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, User])],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
