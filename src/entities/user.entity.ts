import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Article } from './article.entity';
import { Tag } from './tag.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  update_time: number;

  @Column()
  create_time: number;

  @Column()
  email: string;

  @Column()
  state: number;

  //  user => tag = 一对多关系
  @OneToMany(() => Tag, (tag) => tag.create_by)
  tags: Tag[];

  //  user => tag = 一对多关系
  @OneToMany(() => Article, (article) => article.create_by)
  articles: Article[];
}
