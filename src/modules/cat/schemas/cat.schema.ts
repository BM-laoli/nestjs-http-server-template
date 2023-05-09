import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Exclude, Expose } from 'class-transformer';
import { log } from 'console';

// 声明 document 类型
export type CatDocument = Cat & Document;

// 定义 这个schema class
// @Schema()  当然你可以使用 DefinitionsFactory 来生产一个更原始的 schema

// @Schema 会把 cat 映射到 同名的 cat 复数 Collection 中去
// 注意这个 @Schema  可以接受更多的参数 （https://mongoosejs.com/docs/guide.html#options）
@Schema({
  autoIndex: true,
  toObject: {
    transform: (doc, ret, options) => {
      const value = new CatEntity(doc.toJSON());
      Object.setPrototypeOf(ret, Object.getPrototypeOf(value));
      return ret;
    },
  },
})
export class Cat extends Document {
  // @Props 非常强大 不仅可以 定义类型 也可以定义验证规则，详细稳定  https://mongoosejs.com/docs/schematypes.html
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  @Exclude()
  breed: string;

  @Prop([String])
  tags: string[];

  @Prop({ required: true })
  sex: string;

  @Prop(
    raw({
      firstName: { type: String },
      lastName: { type: String },
    }),
  )
  details: Record<string, any>;
}

export const CatSchema = SchemaFactory.createForClass(Cat);

export class CatEntity {
  _id: ObjectId;
  name: string;
  age: number;
  tags: string[];
  sex: string;
  details: Record<string, any>;
  @Exclude()
  breed: string;

  @Expose()
  get id(): string {
    return this._id.toString();
  }

  constructor(partial: Partial<CatEntity>) {
    Object.assign(this, partial);
  }
}

// 如果不习惯使用装饰器 可以 直接 monogose
// import * as mongoose from 'mongoose';
// export const CatSchema = new mongoose.Schema({
//   name: String,
//   age: Number,
//   breed: String,
// });
