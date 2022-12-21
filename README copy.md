# 仓库说明

## 分支说明

## 更新说明

- 聚合一些业务无关的通用模块
- 替换掉原来的redis （之前的redis 是一个不时尚的写法）
- 加入 validate 的验证器
- 加入 zk 简化启动和代码中写死的配置
- 回答 issues 和 掘友的一些问题

### 聚合

> 我们把一些 通用的模块，与业务无关的模块给聚合起来 到core中，方便以后的复用逻辑

### ZK

> 关于ZK的实现，请看代码具体的例子，整个核心就是Nest的 动态模块 的动态注入！
> 相关的文章，我前文有分享，请自己查看, 下面放一些核心代码, NEST中非常重要的东西之一 就是 动态模块 DynamicModule！

```ts
// 设计一个全局的modle 然后别的地方再饮用 里面的service 的时候就不需要在自己的module 去导入了
// 官方文档有写

// 由于 node-zk 是异步 所以我也使用 异步 模块来实现

@Global()
@Module({
  providers: [
    ZKService,
    {
      provide: ZOOKEEPER_CLIENT,
      useFactory: async (optionsProvider: ConfigService) => {
        const zookeeperClient = await getZKClient({
          url: optionsProvider.get(EnumInterInitConfigKey.zkHost),
        });
        return zookeeperClient;
      },
      inject: [ConfigService],
    },
  ],
  exports: [ZKService],
})
//.....
 const getClient = async (options: any) => {
        const {url, ...opt} = options;

        const client = zookeeper.createClient(url, opt);

        client.once('connected', () => {
          Logger.log('zk connected success...');
        });

        client.on('state', (state: string) => {
          const sessionId = client.getSessionId().toString('hex');
        });

        client.connect();
        return client;
      };

// 这样写的话，用的时候直接丢就好啦
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [configuration],
    }),
    FaqModule,
    ZKModule.forRootAsync(),
  ],
  exports: [FaqModule],
})
export class CoreModule {}

// 只需要在用的地方 直接用ZkServic 就ok ，但是这样不够优雅，于是进化成啦🧬 这样 把它内聚一下

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
        const {url, ...opt} = options;

        const client = zookeeper.createClient(url, opt);

        client.once('connected', () => {
          Logger.log('zk connected success...');
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

// 用的地方就变成啦 forootAsync 
 ZKModule.forRootAsync(),

// 其他的redis 还是mq 都可以这样用 都是这样用的
import { ClusterModule, ClusterModuleOptions } from '@liaoliaots/nestjs-redis';
.....
  ClusterModule.forRootAsync({
      imports: [ConfigModule, ZooKeeperModule],
      inject: [MpsConfigService, MpsZKService],
      useFactory: async (
        configService: MpsConfigService,
        zkService: MpsZKService,
      ): Promise<ClusterModuleOptions> => {
        const data = JSON.parse(
          (await zkService.getData(configService.zooKeeperRedisNode)) as string,
        ) as ZooKeeperRedisResponse[];
        const cluster =
          process.env.K0S_CLUSTER_LOCATION ||
          configService.redisClusterLocationDefault;
        const { Host, Password } = data.find((_) => _.Name === cluster)!;
        const nodes = Host.split(',').map((_) => ({
          host: _.split(':')[0],
          port: Number(_.split(':')[1]),
        }));

        return {
          readyLog: true,
          config: {
            nodes,
            redisOptions: { password: Password },
            onClientCreated(client) {
              client.on('error', (err) => {
                Logger.error(err, 'CoreModule');
              });
              client.on('ready', () => {
                Logger.log('Connected to Redis.', 'CoreModule');
              });
            },
          },
        };
      },
    }),
  // 用的时候直接引入 第三方写的 
  import { ClusterService } from '@liaoliaots/nestjs-redis'; 就ok ，它会自动租册

// 比如说mq是没有的，怎么办？也很简单，使用动态模块 的特性 自己搞一个就好了
    MessageQueueModule.forRootAsync(), 具体代码就不写啦
      
```

最终的配置 (这东西不会写在代码里，只会放回zk服务器上去)

```json
  {
   "mysql":{
      "host":"localhost",
      "prot":3306,
      "name":"root",
      "pwd":"123456",
      "lib":"node_blog"
   },
   "redis":{
      "host":"localhost",
      "prot":6379,
      "pwd":"",
      "family":4,
      "db":0
   },
   "uploads":{
      "prefix":0,
      "dir":"uploads"
   },
   "auth": {
     "secret": "shinobi7414"
   }
}
```

### redis 替换

> 直接替换成 第三方封装好的zk ，当然你当然可以自己封装, 实际上，如何 @@liaoliaots/nestjs-redis 的源代码也是使用啦 动态模块，我这里图方便 就直接用了，毕竟它成熟哈哈哈，但是原理和源码如何设计的 我希望你明白

### 去掉微服务

> 我们目前还不需要，去掉

### validate是?

> 实际上就是dto相关的东西，先说一个概念

### 回答 issues 和 掘友的一些问题

1. 程序中的jwt 验证到底如何设计？

那么首先，我们来简单的说两个概念，一个  是 jwt授权 另一个是 角色权限role认证

- jwt(授权) 是对外部请求的 检查，看看它是否能够使用我们的这些服务

- role(认证) 是基于角色 🎭 进行的细粒度 控制，比如 某x 有某权限，某x 没有访问x的权限，但是可以访问其他。

  这一点，实际上也比较的简单，就是设计一个 守卫 guard 就好啦，但是这就涉及到，改动我们的数据库设计..... 比较烦炸，放到第二期去做吧，我在前面的文章中也提到过这个话题，感兴趣的可以去翻一下

有的时候 我们基本上全局都是 需要jwt的，但是比如注册，这个一定是不需要的，你注册都没有注册，哪有什么JWT给你，于是我们这样做 [全局设置](https://learnku.com/articles/44044)

我们不需要  passport 的local 策略 目前而言 "passport" 有点 “特性” 😂 无法解决....

```ts
//  自己定义一个 Guard 扩展它的逻辑
@Injectable()
export class MyAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //    在这里取metadata中的no-auth，得到的会是一个bool
    const noAuth = this.reflector.get<boolean>('no-auth', context.getHandler());

    const guard = MyAuthGuard.getAuthGuard(noAuth);
    if (noAuth) {
      return true;
    } else {
      return guard.canActivate(context); //    执行所选策略Guard的canActivate方法
    }
  }

  //    根据NoAuth的t/f选择合适的策略Guard
  private static getAuthGuard(noAuth: boolean): IAuthGuard {
    return new (AuthGuard('jwt'))();
  }
}

// 
@Module({
  imports: [
    CoreModule,
    //下面的应该仅包含业务模块 不包含 通用模块，通用模块聚合 在core中
    UserModule,
    TagModule,
    ArticleModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: MyAuthGuard,
    },
  ],
})
```

> 基于此 我们需要重新设计 和实现我们的系统，

2. Issues中的node 17 yarn 的时候error

3. 服务发现

4. 工程结构
