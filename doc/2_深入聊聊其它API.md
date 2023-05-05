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

### 注入作用域

### 循环依赖

### 模块参考

### 懒加载

### context 应用上下文

### 生命周期

### 跨平台

### 测试

## 其它API和协同
