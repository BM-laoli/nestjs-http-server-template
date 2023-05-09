import {
  ClassSerializerInterceptor,
  Injectable,
  UseInterceptors,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Cat, CatDocument } from './schemas/cat.schema';

@Injectable()
export class CatService {
  // 注入model / 连接池（后者的功能要更强大 (https://mongoosejs.com/docs/api/connection.html#Connection())
  // @InjectConnection() private connection: Connection,
  // @InjectConnection('testDB') private connection: Connection,
  // @InjectConnection('testDB2') private connection2: Connection,
  constructor(
    @InjectModel('Cat', 'testDB2') private catModel: Model<CatDocument>, // @InjectConnection() private connection: Connection, // @InjectConnection('testDB') private connection: Connection, // @InjectConnection('testDB2') private connection2: Connection,
  ) {}

  // mongo 直接这样返回有问题 ClassSerializerInterceptor 源码在这里 https://github.com/nestjs/nest/blob/85966703ac57a5b263ab5807033f6ac78548c0ef/packages/common/serializer/class-serializer.interceptor.ts
  // 我们重新实现一个 ClassSerializerMongoModelInterceptor
  @UseInterceptors(ClassSerializerInterceptor)
  getCat(): Promise<Cat[]> {
    return this.catModel.find().exec();
  }

  async create(data: any): Promise<Cat> {
    const createCat = new this.catModel(data);
    return createCat.save();
  }
}
