import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Tag } from './tag.entity';
import { User } from './user.entity';

// typeorm 关于外键的修改并不会让你 把值能够附上 而且manyToMany 需要
// 多维护一张表 save操作也不一样 如何修改和查询关联表需要参考 typeoorm
@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  title: string;

  @Column('int')
  create_time: number;

  @Column('int')
  update_time: number;

  @Column('varchar')
  content: string;

  @Column('varchar')
  desc: string;

  @Column('varchar')
  cover_image_url: string;

  @Column('int')
  state: number;

  @ManyToOne((type) => User, (user) => user.tags)
  create_by: User;

  @ManyToMany(() => Tag, (tag) => tag.id)
  // @JoinTable需要指定这是关系的所有者方。
  @JoinTable()
  tags: Tag[];
}
