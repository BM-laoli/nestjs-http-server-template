import { Injectable } from '@nestjs/common';
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

  getHello(): string {
    return 'Hello World!';
  }

  async create(data: any): Promise<Cat> {
    const createCat = new this.catModel(data);
    return createCat.save();
  }
}
