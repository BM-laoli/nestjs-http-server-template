import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (
        configService: ConfigService,
      ): Omit<MongooseModuleOptions, 'connectionName'> => {
        const mongodbConfig = {
          NAME: configService.get<string>('MONGOOSE_NAME'),
          HOST: configService.get<string>('MONGOOSE_HOST'),
          PASSWORD: configService.get<string>('MONGOOSE_PASSWORD'),
        };
        return {
          uri: `mongodb://${mongodbConfig.NAME}:${mongodbConfig.PASSWORD}@${mongodbConfig.HOST}:27017/testDB`,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          authSource: 'admin',
        };
      },
      inject: [ConfigService],
      connectionName: 'testDB', // 请自信看 类型声明
      /**
      export interface MongooseModuleFactoryOptions extends Omit<MongooseModuleOptions, 'connectionName'> {
      }
      export interface MongooseModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
          connectionName?: string;
          useExisting?: Type<MongooseOptionsFactory>;
          useClass?: Type<MongooseOptionsFactory>;
          useFactory?: (...args: any[]) => Promise<MongooseModuleFactoryOptions> | MongooseModuleFactoryOptions;
          inject?: any[];
      }
       */
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const mongodbConfig = {
          NAME: configService.get<string>('MONGOOSE_NAME'),
          HOST: configService.get<string>('MONGOOSE_HOST'),
          PASSWORD: configService.get<string>('MONGOOSE_PASSWORD'),
        };
        return {
          uri: `mongodb://${mongodbConfig.NAME}:${mongodbConfig.PASSWORD}@${mongodbConfig.HOST}:27017/testDB2`,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          authSource: 'admin',
        };
      },
      inject: [ConfigService],
      connectionName: 'testDB2', // 翻了一下源代码 发现在这里 要声明一个name....有点痛苦
      // https://github.com/nestjs/mongoose/blob/master/lib/mongoose-core.module.ts
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class CoreModule {}
