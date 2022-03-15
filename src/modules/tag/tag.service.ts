import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/entities/tag.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  getAll() {
    return this.tagRepository.find({ relations: ['create_by'] });
  }

  async create(tag: Tag) {
    // 依据typeorm 的文档 如果需要保存关系需要使用 ，这样方式来做
    const user = await this.userRepository.findOne(tag.create_by);
    tag.create_by = user;
    return this.tagRepository.save(tag);
  }

  updateById(id, tag: Tag) {
    return this.tagRepository.update(id, tag);
  }

  deleteById(id) {
    return this.tagRepository.delete(id);
  }
}
