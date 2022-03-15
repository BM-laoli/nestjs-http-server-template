import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { InterParams } from 'src/typings/controller';
import { Article } from 'src/entities/article.entity';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('/articles')
  getAll() {
    return this.articleService.getAll();
  }

  @Get('/:id')
  getArticleById(@Param() params: InterParams) {
    return this.articleService.getArticleById(params.id);
  }

  @Post()
  createArticle(@Body() articleInfo: Article) {
    return this.articleService.createArticle(articleInfo);
  }

  @Put('/:id')
  updateArticle(@Param() params: InterParams, @Body() articleInfo: Article) {
    return this.articleService.updateArticleById(params.id, articleInfo);
  }

  @Delete('/:id')
  deleteArticle(@Param() params: InterParams) {
    return this.articleService.deleteArticle(params.id);
  }
}
