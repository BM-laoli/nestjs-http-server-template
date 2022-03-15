import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/entities/article.entity';
import { Tag } from 'src/entities/tag.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,

    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAll() {
    const value = await this.articleRepository.find();
    return value;
  }

  async getArticleById(id) {
    const value = await this.articleRepository.findOne(id, {
      relations: ['create_by', 'tags'],
    });
    return value;
  }

  // 创建方式
  async createArticle(article: Article) {
    const user = await this.userRepository.findOne(article.create_by);

    const getTags = async () => {
      const promiseList = <any>[];
      article.tags.forEach((item) => {
        promiseList.push(this.tagRepository.findOne(item));
      });
      const value = await Promise.all(promiseList);
      return value;
    };

    const allTags = await getTags();

    article.create_by = user;
    article.tags = allTags;
    const value = await this.articleRepository.save(article);
    return value;
  }

  async updateArticleById(id, article: Article) {
    const value = await this.articleRepository.update(id, article);
    return value;
  }

  async deleteArticle(id) {
    const value = await this.articleRepository.delete(id);
    return value;
  }
}
