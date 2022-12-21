import {
  DynamicModule,
  Global,
  Inject,
  Logger,
  Module,
  OnModuleDestroy,
  Provider,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ZKService } from './zk.service';
import { EnumInterInitConfigKey, ZOOKEEPER_CLIENT } from '../typings';
import * as zookeeper from 'node-zookeeper-client';

@Global()
@Module({
  providers: [ZKService],
  exports: [ZKService],
})
export class ZKModule implements OnModuleDestroy {
  static forRootAsync(): DynamicModule {
    return {
      module: ZKModule,
      imports: [],
      providers: [ZKService, this.createClient()],
    };
  }
  constructor(
    @Inject(ZOOKEEPER_CLIENT)
    private readonly zkCk: any,
  ) {}

  onModuleDestroy() {
    this.zkCk.close();
  }

  private static createClient = (): Provider => ({
    provide: ZOOKEEPER_CLIENT,
    useFactory: async (optionsProvider: ConfigService) => {
      const getClient = async (options: any) => {
        const { url, ...opt } = options;

        const client = zookeeper.createClient(url, opt);

        client.once('connected', () => {
          Logger.verbose('zk connected success...');
        });

        client.on('state', (state: string) => {
          const sessionId = client.getSessionId().toString('hex');
        });

        client.connect();
        return client;
      };

      const zookeeperClient = await getClient({
        url: optionsProvider.get(EnumInterInitConfigKey.zkHost),
      });

      return zookeeperClient;
    },
    inject: [ConfigService],
  });
}
