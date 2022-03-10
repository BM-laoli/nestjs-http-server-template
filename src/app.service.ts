import { Injectable } from '@nestjs/common';

/**
Providers 是 Nest 的一个基本概念。许多基本的 Nest 类可能被视为 provider 比如
service, repository, factory, helper 等等。 他们都可以通过 constructor 注入依赖关系。
这意味着对象可以彼此创建各种关系，并且“连接”对象实例的功能在很大程度上可以委托给 Nest运行时系统。 
Provider 只是一个用 @Injectable() 装饰器注释的类。比如下面的AppService 就是应该provider，至于如何使用请看App.Controller
 */
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
