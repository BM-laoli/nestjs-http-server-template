# 说明
>
> 让我们深入聊聊其它的一些高级 骚操作 和其它API的深入
>
## 高级操作

### provider 的骚操作

我已经详细的说明了 请移步 <https://juejin.cn/post/7078847428455530526#heading-8>

### 动态模块

1. 常规的模块导入和运行

```ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  /*
    Implementation that makes use of this.usersService
  */
}

// 如此这样 AuthModule 模块中才能使用到 UsersModule中的 UsersService

```

上述的过程 也叫做*静态模块绑定*，它们发生了下面的一些事情

- 实例化 UsersModule 包括其的引用 模块
- 实例化 AuthModule ，并将 UsersModule 导出的提供者提供给 AuthModule 中的组件
- 在AuthService 注入UsersService

2. 动态模块例子1

我们经常能看到这样的模块，它们在导入的时候 赋予了一些接受参数的功能

```ts
ConfigModule.register({...})
TypeOrmModule.forRootAsync({
    useFactory: async (zkService: ZKService) => {
      const { mysql } = await zkService.getDataWithJSON<InterZKConfigNest>(
        EnumZkConfigPath.nest,
      );
      return {
        type: 'mysql',
        host: mysql.host,
        port: mysql.prot,
        username: mysql.name,
        password: mysql.pwd,
        database: mysql.lib,
        entities: [resolve(__dirname, '../entities/**/*.entity{.ts,.js}')], // 扫描本项目中.entity.ts或者.entity.js的文件
        synchronize: true,
      };
    },
    inject: [ZKService],
  }),
// 它们都涉及到一个知识点 动态模块
```

动态模块就像插件一样，用的时候 传递配置进行初始化，可以指定不同的行为

下面我们就来尝试做一个这样的 例子

```ts
// 我们需要达到的效果
@Module({
  imports: [ConfigModule.register({ folder: './config' })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


// 我们最终的实现
// 1. 首先我们这个register 上一个static method 返回一个DynamicModule
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({})
export class ConfigModule {
  static register(): DynamicModule {
    return {
      module: ConfigModule,
      providers: [ConfigService],
      exports: [ConfigService],
    };
  }
}

// 2. 我们的 configModule 提供了一个 configService
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { EnvConfig } from './interfaces';

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor() {
    const options = { folder: './config' };

    const filePath = `${process.env.NODE_ENV || 'development'}.env`;
    const envFile = path.resolve(__dirname, '../../', options.folder, filePath);
    this.envConfig = dotenv.parse(fs.readFileSync(envFile));
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}

// 3. 现在我们module需要传入参数
export const CONFIG_OPTIONS = 'CONFIG_OPTIONS';
@Module({})
export class ConfigModule {
  static register(options): DynamicModule {
    return {
      module: ConfigModule,
      providers: [ // 注意啊 这个地方在provider的时候有详细的说明这就不说了
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        ConfigService,
      ],
      exports: [ConfigService],
    };
  }
}

// 4. service 接受这个 inject 的 令牌
import { Injectable, Inject } from '@nestjs/common';

import * as dotenv from 'dotenv';
import * as fs from 'fs';

import { EnvConfig } from './interfaces';

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(@Inject(CONFIG_OPTIONS) private options) {
    const filePath = `${process.env.NODE_ENV || 'development'}.env`;
    const envFile = path.resolve(__dirname, '../../', options.folder, filePath);
    this.envConfig = dotenv.parse(fs.readFileSync(envFile));
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}

// 好啦 以上就是全部啦
```

3. 动态模块例子2

以上的例子还是很简单 我们需要复杂一些的比如 传递更多的参数 那就 forRoot/forRootAsync, (实际上就是约定俗成的叫法而已，你当然可以是 registerAsync)

比如我封装 一个zk （请移步到这里 <https://juejin.cn/post/7179577349279744057#heading-3> ）

简单的来说就是 使用 动态模块的特性 把需要用到的service 当做/不当做 参数传递进去，进行一部异步/同步 的初始化

以上的内容在中文文档中说的没有这么详细，请看 原英语文档 <a href="https://docs.nestjs.com/fundamentals/dynamic-modules#custom-options-factory-class">Nest9 英语文档</a>

上面的 zk 封装 并不是非常的完美，完美可以去看看 另一个开源模块 的源码用以学习
<a href="https://github.com/liaoliaots/nestjs-redis/blob/main/packages/redis/lib/redis/redis.providers.ts">nestjs-redis源码</a>
<a href="https://github.com/apachecn/logrocket-blog-zh/blob/73cfca092085c96494fbe91cb588f1d5254f0c63/docs/use-configurable-module-builders-nest-js-v9.md">NestV9版本如何自定义模块</a>

重点说一下 V9 的写法

```ts
// ConfigurableModuleBuilder 返回了一些特定的 令牌 和 class ，让我们定义动态模块的时候 更加简单

// 1、我们希望可以完成这样的 样板代码
import { EnvProxyModule } from './env-proxy-module/env-proxy.module';
@Module({
  imports: [ApiModule, EnvProxyModule.registerAsync({
    useFactory: async () => {
      return {
        exclude: [
          "DATA"
        ]
      }
    }
  })],
})
export class AppModule {}

// EnvProxyModule 功能就去获取 .env 上变量

// 2. 返回 一个builder env-proxy.definition.ts
import { ConfigurableModuleBuilder } from '@nestjs/common';
export interface EnvProxyModuleOptions {
  exclude: string[];
}
export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<EnvProxyModuleOptions>({
    moduleName: 'EnvProxy',
  })
    .build();

// 3. 实现 EnvProxy
@Global()
@Module({
  providers: [EnvProxyService],
  exports: [EnvProxyService],
})
export class EnvProxyModule extends ConfigurableModuleClass {}

@Injectable()
export class EnvProxyService {
  public readonly env: NodeJS.ProcessEnv;
  constructor(@Inject(MODULE_OPTIONS_TOKEN) private options: EnvProxyModuleOptions) {
    this.env = process.env;
    options.exclude.forEach(val => {
      delete this.env[val];
    });
  }
}
```

哇 这代码相比原来的，要简洁不少

### 注入作用域（scoped providers
>
> （模块有三个注入范围） 这个功能说实话，我自己用的是比较少的，不知道你们用的多不多。我只能简单的举个例子供大家参考和讨论了

1. 官方的说明

在官方的文档中 一个重要的观点 *Node.js并不遵循多线程下请求/响应的无状态模式 ，在Nest中基本上所有的内容都是共享的，使用单例 是没有问题的*

Nest把模块注入范围做了下面的区分:

| TYPE      | Description |
| ----------- | ----------- |
| 请求级模块 REQUEST      | 在请求处理完成后，将为每个传入请求和垃圾收集专门创建提供者的新实例  |
| 组件级模块或瞬态模块 TRANSIENT      | 临时提供者不能在提供者之间共享。每当其他提供者向 Nest 容器请求特定的临时提供者时，该容器将创建一个新的专用实例 |
| 共享应用程序级模块 DEFAULT      | 每个提供者可以跨多个类共享。提供者生命周期严格绑定到应用程序生命周期。**一旦应用程序启动，所有提供程序都已实例化**。默认情况下使用单例范围。 |

默认情况下，大多数 NestJS 模块是应用程序级模块，也称为全局共享模块。但是，不是每个模块都可以是全局模块。其中一些需要保持瞬态或请求级模块。

例如，如果您需要一个应用程序级的只读模块，您最好的选择是使用全局共享模块。存储在模块中的数据不会经常改变，所以它可以作为应用程序级的单例对象被延迟，以节省内存并创建一个全局可访问的类。带有@Global装饰器的模块消除了代码和组件级的冗余，因为你不需要重新初始化模块。

为了更好地理解模块级的状态保持，如果在一个具有瞬态或请求范围的模块中有一个常量，它将是一个不可变的变量，直到模块在垃圾收集时销毁它。但是，当使用跨整个应用程序的全局模块时，它只会在应用程序的生命周期结束时被销毁。

2. 数据竞争问题
使用单例时要小心的另一件事是数据竞争问题。 Node.js 不能免受数据竞争条件的影响，NestJS 也是如此。

当两个独立的进程试图同时更新同一个数据块时，就会出现数据争用情况。因为对象是全局可访问的，同时执行数据可能会导致执行时丢失数据点。

避免数据竞争情况的最佳实践包括创建一个全局只读模块，并对每个模块的注入范围更加谨慎。全局模块最容易受到数据竞争条件的影响，使用全局模块在组件之间通信或管理状态将导致反模式。

但是，为什么瞬态组件级模块不能这样说呢？在组件级别，封装障碍只扩展到组件的需求。每个瞬态模块提供程序都有一个专用的实例。组件级的关注点分离通常更细粒度，这使得它比大规模应用程序更容易预测。请求级的单例也是如此，尽管规模较小。

3. scope 实际上是在注入链中冒泡的

想象一下下面的链: CatsController <- CatsService <- CatsRepository 。如果您的 CatsService 是请求范围的(从理论上讲，其余的都是单例)，那么 CatsController 也将成为请求范围的(因为必须将请求范围的实例注入到新创建的控制器中)，而 CatsRepository 仍然是单例的。

我们来分析一下下面的代码看看会不会有什么问题

```ts
@Injectable({ scope: Scope.REQUEST })
export class RequestLogger {
  constructor() {
    console.log('RequestLogger init');
  }

  public log(message: string) {
    console.log('message', message);
  }
}

export class AppController {
  constructor(
    private readonly appService: AppService, // private readonly scopeLog: RequestLogger,
  ) {}

  @Get()
  @UseGuards(RolesGuard3)
  getHello(@Inject(RequestLogger) scopeLog: RequestLogger): string {
    console.log('getHello');
    // throw new Error('errro');
    // console.log(this);
    // this.scopeLog.log('222');
    scopeLog.log('22'); // 这个地方一定是 undefined 的！
    // 你最好的做法 要么说在 controller 要么在 server + 而且要注意 冒泡的问题🫧 

    return this.appService.getHello();
  }
}
```

4. 我在工作用有用到吗？

> 当然我在工作中发现过 “先人” 留下的代码, 所有的 provider 和 controller 都是 Scope.REQUEST的，原因在于，我们的项目是一个 Nest的SSR + BFF 整合在一体的项目，其中包含了许多逻辑，由于历史原因，有的地方在操作数据库 和操作缓存，若只用一个实例 会导致 并发的情况下 ，发生用户数据 错乱的问题

### 循环依赖
>
> 简而言之 A -> B -> C -> A

在Nest中是允许 允许在提供者( provider )和模块( module )之间创建循环依赖关系，从工程上来看我们应该尽量避免这种问题，但实在不行我们有下面的解决方法

1. 前向引用允许 Nest 引用目前尚未被定义的引用。

```ts
@Injectable()
export class CatsService {
  constructor(
    @Inject(forwardRef(() => CommonService))
    private readonly commonService: CommonService,
  ) {}
}

@Injectable()
export class CommonService {
  constructor(
    @Inject(forwardRef(() => CatsService))
    private readonly catsService: CatsService,
  ) {}
}

```

需要特别注意

**实例化的顺序是不确定的。不能保证哪个构造函数会被先调用。**

2. 模块前向引用

```ts
@Module({
  imports: [forwardRef(() => CatsModule)],
})
export class CommonModule {}

```

### 模块参考
>
> 简单来说 就是存在一个API 叫做 ModuleRef ，使用它 可以通过API的方式 完成DI容器的一些操作，比如获取前后的实例，创建额外的provider 等...

1. 获取当下的实例

```ts
// 获取本实例

@Injectable()
export class CatsService implements OnModuleInit {
  private service: Service;
  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    this.service = this.moduleRef.get(Service);
  }
}

// 从全局获取实例
this.moduleRef.get(Service, { strict: false });
```

*注意如果 scoped providers  需要使用另外的方式*

2.处理 作用域( scoped providers )

```ts
@Injectable()
export class CatsService implements OnModuleInit {
  private transientService: TransientService;
  constructor(private moduleRef: ModuleRef) {}

  async onModuleInit() {
    this.transientService = await this.moduleRef.resolve(TransientService);
  }
}


// 需要注意 法从其自身的注入容器树返回一个提供者的唯一实例。每个子树都有一个独一无二的上下文引用。因此如果你调用该方法一次以上并进行引用比较的话，结果是不同的。

@Injectable()
export class CatsService implements OnModuleInit {
  constructor(private moduleRef: ModuleRef) {}

  async onModuleInit() {
    const transientServices = await Promise.all([
      this.moduleRef.resolve(TransientService),
      this.moduleRef.resolve(TransientService),
    ]);
    console.log(transientServices[0] === transientServices[1]); // false
  }
}


// 若要保证一致 请提供一个id
// 使用ContextIdFactory类来生成上下文引用
@Injectable()
export class CatsService implements OnModuleInit {
  constructor(private moduleRef: ModuleRef) {}

  async onModuleInit() {
    const contextId = ContextIdFactory.create();
    const transientServices = await Promise.all([
      this.moduleRef.resolve(TransientService, contextId),
      this.moduleRef.resolve(TransientService, contextId),
    ]);
    console.log(transientServices[0] === transientServices[1]); // true
  }
}

// 若 要获取 子树中的 同一个实例，请使用
// CatsService是请求范围的，要获取的CatsRepository实例也被标识为请求范围。要分享同一个注入容器子树，你需要获取当前上下文引用而不是生成一个新的(像前面的ContextIdFactory.create()函数)。使用@Inject()来获取当前的请求对象。

@Injectable()
export class CatsService {
  constructor(
    @Inject(REQUEST) private request: Record<string, unknown>,
  ) {}
  ++++
}

// 使用ContextIdFactory类的getByRequest()方法来基于请求对象创建一个上下文id 并传递resolve()调用:
const contextId = ContextIdFactory.getByRequest(this.request);
const catsRepository = await this.moduleRef.resolve(CatsRepository, contextId);


// 用来实例话一个 别的class 在模块之外的
@Injectable()
export class CatsService implements OnModuleInit {
  private catsFactory: CatsFactory;
  constructor(private moduleRef: ModuleRef) {}

  async onModuleInit() {
    this.catsFactory = await this.moduleRef.create(CatsFactory);
  }
}

```

### context 应用上下文
>
> 有两个重要的class ArgumentsHost 和 ExecutionContext

1. ArgumentsHost

> 这玩意儿可以获取在上下文中的req以及其它的参数 ,(例如HTTP，RPC(微服务)或者Websockets)来从框架中获取参数。

这个东西在 guards, filters, and interceptors 都可以看到 , 我们按下不表，先看一个简单的  Filter ，下面的的host 就直接是 一个 ArgumentsHost类型了

```ts
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

// 他的一些API 
// 1. 获取应用类型
host.getType() // 返回 http ｜ rpc ｜ graphql
// host.getType<GqlContextType>() === 'graphql'

// 2. 获取req res next
const [req, res, next] = host.getArgs();

// 实际上我们并不推这样做 业务应用类型不一样 api是不一样的，最好的写法是这样
const ctx = host.switchToHttp(); 
// http 应用就用这个 switchToHttp
// rpc 就用这个 switchToRpc
// ws 应用就用这个 switchToWs
// 它们的类型 和具备的方法都个不一样,
const request = ctx.getRequest<Request>();
const response = ctx.getResponse<Response>();

```

2. ExecutionContext

这个是对 ArgumentsHost 的加强 源码如下

```ts
export interface ExecutionContext extends ArgumentsHost 

// getHandler() 方法返回要调用的处理程序的引用
// getClass() 方法返回一个特定处理程序所属的控制器类
// 再说简单的 就来看一个例子 （代码在 branch -> quersiont > logging.interceptor 中 
const methodKey = ctx.getHandler(); // "实例 create 方法"
const className = ctx.getClass(); // "class CatsController 不是实例"
```

3. 以上配置在结合 SetMetadata

Nest提供了通过@SetMetadata()装饰器将自定义元数据附加在路径处理程序的能力。我们可以在类中获取这些元数据来执行特定决策。

举个例子（ 在这个知识点上 我已经举了很多了 这里不说了

```ts
// 定义一个 装饰器
import { SetMetadata } from '@nestjs/common';
import { Role } from '../constants/RBAC';
export const ROLES_KEY = 'roles';
// 装饰器Roles SetMetadata将装饰器的值缓存
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

// 定义一个 守卫
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../constants/RBAC';
import { ROLES_KEY } from '../decorator/rbac.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1.通过反射获取到装饰器的权限
    // getAllAndOverride读取路由上的metadata getAllAndMerge合并路由上的metadata
    // 下面的具体的代码说明含义 前文ExecutionContext 已经详细说明了 
    const requireRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('requireRoles info', requireRoles);

    // 2.获取req拿到鉴权后的用户数据
    const req = context.switchToHttp().getRequest();

    // // 3.通过用户数据从数据查询权限
    const user = await Promise.resolve({ roles: [{ id: 1, text: 'admin' }] });
    const roleIds = user.roles.map((item) => item.id);

    // 4.判断用户权限是否为装饰器的权限 的some返回boolean
    const flag = requireRoles.some((role) => roleIds.includes(role));

    return flag;
  }
}


// 使用
@Roles(Role.Admin) // 仅限ADMIN 可以访问 可以用在具体的路由/controller 下
@UseGuards(RolesGuard, RoleGuard)
export class AppController {...}
```

4. 在前面的代码中 我们发现了这样的一个API this.reflector

这就是许多编程语言中 具备的一个概念 反射

```ts
// 看一种场景，基于前文的代码，如果我们要获取两个参数如何处理？
@Roles('user')
@Controller('cats')
export class CatsController {
  @Post()
  @Roles('admin')
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }
}

// 如果你想将user指定为默认角色，并且出于特定目的有选择地进行覆盖，可以使用 getAllAndOverride()方法。 它返回['admin']

const roles = this.reflector.getAllAndOverride<string[]>('roles', [
  context.getHandler(),
  context.getClass(),
]);

// 如果要获取所有的情使用下面的代码 它返回 ['user', 'admin']
const roles = this.reflector.getAllAndMerge<string[]>('roles', [
  context.getHandler(),
  context.getClass(),
]);


```

### 生命周期

请看这个图例
<img src="https://docs.nestjs.com/assets/lifecycle-events.png" />

|生命周期钩子方法| 生命周期时间触发钩子方法调用 |
|------|------|
| OnModuleInit() | 初始化主模块依赖处理后调用一次 |
| OnApplicationBootstrap() | 在应用程序完全启动并监听连接后调用一次 |
| OnModuleDestroy() | 收到终止信号(例如SIGTERM)后调用 |
| beforeApplicationShutdown() | 在onModuleDestroy()完成(Promise被resolved或者rejected)；一旦完成，将关闭所有连接(调用app.close() 方法). |
| OnApplicationShutdown() | 连接关闭处理时调用(app.close()) |

特别小心
**上述列出的生命周期钩子没有被 scope provider class 触发。 scope provider class 并没有和生命周期以及不可预测的寿命绑定。他们为每个请求单独创建，并在响应发送后通过垃圾清理系统自动清理。**

系统关闭hooks 消耗系统资源，默认关闭，但是对与你部署 或者到产线上非常有用

```ts
// 打开
 app.enableShutdownHooks();

//  enableShutdownHooks开始监听时消耗内存。如果要在一个单独Node线程中运行多个Nest应用(例如，使用多个Jest运行测试)，Node会抱怨监听者太多。出于这个原因，enableShutdownHooks默认未启用。要在单个Node进程中运行多个实例时尤其要注意这一点。
```

### 测试
>
> 关于测试 ，单元测试，E2E 测试 Nest 都有完整的方案

#### 简单单元测试
>
> 重点是模块内 的测试

1. 按照 测试工具 包（它底层依赖Jest

```shell
npm i --save-dev @nestjs/testing
```

2. 设置单测文件

必须以  .spec 或 .test 结尾

```ts
import { Test } from '@nestjs/testing';
import { CarController } from './car/car.controller';
import { CarService } from './car/car.service';

describe('CarController', () => {
  let catsController: CarController;
  let catsService: CarService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CarController],
      providers: [CarService],
    }).compile();

    // compile
    // 这个方法初始化一个模块和它的依赖(和传统应用中从main.ts文件使用NestFactory.create()方法类似)，并返回一个准备用于测试的模块。

    catsService = await moduleRef.resolve(CarService);
    catsController = await moduleRef.resolve(CarController);
  });

  describe('findAll', () => {
    it('should return an array of cats', async () => {
      const result = 'findAll';
      jest.spyOn(catsService, 'findAll').mockImplementation(() => result);

      const value = await catsController.findAll();
      console.log(value);

      expect(value).toBe(result);
    });
  });
});
```

#### 端到端测试 E2E

```ts
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CarModule } from '../src/car/car.module';
import { CarService } from '../src/car/car.service';

describe('Car', () => {
  let app: INestApplication;
  const carService = { findAll: () => 'findAll' };
  // const carService = new CarService();
  // 我们也提供了一个可选的CatsService(test-double)应用，它返回一个硬编码值供我们测试。使用overrideProvider()来进行覆盖替换。类似地，Nest也提供了覆盖守卫，拦截器，过滤器和管道的方法：overrideGuard(), overrideInterceptor(), overrideFilter(), overridePipe()。

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CarModule],
    })
      .overrideProvider(CarService)
      .useValue(carService)
// useClass: 提供一个类来覆盖对象(提供者，守卫等)。
// useValue: 提供一个实例来覆盖对象。
// useFactory: 提供一个方法来返回覆盖对象的实例。
      .compile();

    app = moduleRef.createNestApplication();
    // createNestApplication()方法来实例化一个Nest运行环境。我们在app变量中储存了一个app引用以便模拟HTTP请求。
    await app.init();
  });

  it(`/GET findAll`, () => {
    return request(app.getHttpServer())
      .get('/car/findAll')
      //  模拟请求 app.getHttpServer
      .expect(200)
      .expect(carService.findAll());
  });

  afterAll(async () => {
    await app.close();
  });
});

```

上述的app 编译完成之后 具备下面的一些方法
| method | des |
|----|----|
| createNestInstance() | 基于给定模块创建一个Nest实例（返回INestApplication）,请注意，必须使用init()方法手动初始化应用程序  |
| createNestMicroservice() | 基于给定模块创建Nest微服务实例（返回INestMicroservice）  |
| get() | 从module reference类继承，检索应用程序上下文中可用的控制器或提供程序（包括警卫，过滤器等）的实例  |
| resolve() | 从module reference类继承，检索应用程序上下文中控制器或提供者动态创建的范围实例（包括警卫，过滤器等）的实例  |
| select() | 浏览模块树，从所选模块中提取特定实例（与get()方法中严格模式{strict：true}一起使用)  |

注册一个全局的模块/让全局的一些provider 公用，而不需要我们单独的每个测试文件都添加 比如JwtAuthGuard

```ts
// AppModule 中改一下
providers: [
  {
    provide: APP_GUARD,
    useExisting: JwtAuthGuard,
  },
  JwtAuthGuard,
],
// 将useClass修改为useExisting来引用注册提供者，而不是在令牌之后使用Nest实例化。

const moduleRef = await Test.createTestingModule({
  imports: [AppModule],
})
  .overrideProvider(JwtAuthGuard)
  .useClass(MockAuthGuard)
  .compile();
  // 这样测试就会在每个请求中使用MockAuthGuard。
```

还有一个细节
请求范围提供者针对每个请求创建。其实例在请求处理完成后由垃圾回收机制销毁。这产生了一个问题，因为我们无法针对一个测试请求获取其注入依赖子树。

```ts
const contextId = ContextIdFactory.create();
jest
  .spyOn(ContextIdFactory, 'getByRequest')
  .mockImplementation(() => contextId);
  
catsService = await moduleRef.resolve(CatsService, contextId);

```

>
> 这个是最符合 实际生产要求的 测试方式  我们使用supertest 来模拟http

## 其它API和协同
