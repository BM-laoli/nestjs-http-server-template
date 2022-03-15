import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Tag } from 'src/entities/tag.entity';
import { Article } from 'src/entities/article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, User, Tag])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
