import {
  CallHandler,
  ClassSerializerInterceptor,
  ExecutionContext,
  Injectable,
  PlainLiteralObject,
} from '@nestjs/common';
import { isArray } from 'class-validator';
import { classToPlain } from 'class-transformer';
import { TransformerPackage } from '@nestjs/common/interfaces/external/transformer-package.interface';
import { loadPackage } from '@nestjs/common/utils/load-package.util';
import { Observable, map } from 'rxjs';
import { MONGO_ENTITY_CLASS } from '../decorator/MongoEntity.decorator';

/**
mongodb query 出来的是一个model 而不是 一个可以被 Serializer 解析的 class
故我们添加转化配置 
 (1. 添加装饰器指定 entity，
 (2. 添加 新的 Interceptor 继承 ClassSerializerInterceptor 并且重写里面的方法
 */

@Injectable()
export class ClassSerializerMongoModelInterceptor extends ClassSerializerInterceptor {
  transform(MongoEntity, data) {
    return Array.isArray(data)
      ? data.map((obj) => new MongoEntity(obj.toObject()))
      : new MongoEntity(data.toObject());
  }

  // 重写这个方法
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const MongoEntity = this.reflector?.getAllAndOverride(MONGO_ENTITY_CLASS, [
      context.getHandler(),
      context.getClass(),
    ]);

    const contextOptions = this.getContextOptions(context);
    const options = {
      ...this.defaultOptions,
      ...contextOptions,
    };

    return next.handle().pipe(
      map((data) => {
        return this.transform(MongoEntity, data);
      }),
      map((res: PlainLiteralObject | Array<PlainLiteralObject>) => {
        return this.serialize(res, options);
      }),
    );
  }
}
