import { Module, Global, Injectable, DynamicModule,Inject } from '@nestjs/common';
// import { TagController } from './tag.controller';
// import { TagService } from './tag.service';

// 一般用法
// 如果希望这个modules 是 全局的，不需要每次都 inport一些就可以这么干，虽然这个是不建议的，但是我们提供了这个功能
// @Global()
// @Module({
//   imports: [],
//   controllers: [TagController],
//   providers: [TagService],
//   exports:[ TagService ] // 由本模块提供并应在其他模块中可用的提供者的子集。
// })
// export class TagModule {}

// 高级用法动态的modues，我现在希望我们的module是根据参数动态来，如何处理呢？nest提供了动态module 来提供解决方案，下面的例子我们根据不同的Usr
// 获取不同的数据库config配置
// 1. 首先是Modules
// 2. 然后 是modules 需要的 providers

const config1 = {
  value1:'config1'
}

const config2 = {
  value1:'config2',
}

interface EnvConfig {
  [key: string]: string;
}

interface ConfigOptions {
  folder: string;
}

const CONFIG_OPTIONS = 'CONFIG_OPTIONS';

interface ConfigModuleOptions {
 folder: string;
}

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(@Inject(CONFIG_OPTIONS) options: ConfigOptions) {
    // 将来它可能会从不同的路径读取不同的配置 进行模块内聚
    // const filePath = `${process.env.NODE_ENV || 'development'}.env`;
    // const envFile = path.resolve(__dirname, '../../', options.folder, filePath);
    options.folder === "config1" ? (this.envConfig = config1  ) : (this.envConfig = config2);
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}



@Module({})
export class ConfigModule {
  static register(options: ConfigModuleOptions): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
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