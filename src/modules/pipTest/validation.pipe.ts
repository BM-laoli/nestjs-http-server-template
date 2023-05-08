import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
// import { ValidationPipe } from '@nestjs/common';

@Injectable()
export class MyValidationPipe implements PipeTransform {
  // 必须要实现的一个方法
  transform(value: any, metadata: ArgumentMetadata) {
    // 这里可以进行转化 / threw error

    // Value 就算输入的value
    // metadata 是所谓的 元数据 。比如string isRequired 这种

    // 具体的实现 可以参考 ValidationPipe 的源码实现
    return value;
  }
}
