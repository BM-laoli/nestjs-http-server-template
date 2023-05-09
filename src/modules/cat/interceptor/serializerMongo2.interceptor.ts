import {
  CallHandler,
  ClassSerializerInterceptor,
  ExecutionContext,
  Injectable,
  PlainLiteralObject,
} from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { TransformerPackage } from '@nestjs/common/interfaces/external/transformer-package.interface';
import { Observable, map } from 'rxjs';

@Injectable()
export class ClassSerializerMongoModel2Interceptor extends ClassSerializerInterceptor {
  // 扩展一个方法
  transform(data) {
    return Array.isArray(data)
      ? data.map((obj) => obj.toObject())
      : data.toObject();
  }

  // 重写这个方法
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextOptions = this.getContextOptions(context);
    const options = {
      ...this.defaultOptions,
      ...contextOptions,
    };
    return next.handle().pipe(
      map((data) => {
        return classToPlain(this.transform(data));
      }),
      map((res: PlainLiteralObject | Array<PlainLiteralObject>) => {
        return this.serialize(res, options);
      }),
    );
  }
}
