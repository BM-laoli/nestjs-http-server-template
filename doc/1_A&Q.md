# 说明
>
> 回答一些 A&Q 的问题, 可能存在偏见或错误，欢迎👏大家指出，努力改进 共同努力💪

## 重要的路径说明
>
> 前面的文档很多次 都是在说什么什么这么用，怎么用，但是我们现在接触了这么多的 🔧 工具： Controller\ Providers\ Module \ Service \ Middleware \ Filter \ Pip \Guard \ Interceptor \ Decorator \
> 其中 除去四套件，Controller\ Module \ Service  \ Providers 我们很好理解之外，其它都是对 request/ respose 的增强， 那么这里就有一个问题了，它们之间的调用顺序是什么？什么事情适合用这个 什么事情适合用那个?
> 以下 我仅从官方和 自己的经验来谈谈 供你参考

### 官方的文档 对 request生命周期做了简要说明

<https://docs.nestjs.com/faq/request-lifecycle>

由于Nest提供了非常多的 res/req 的增强工具，而且 它们各种都具备 全局的/模块内的，这导致我们的最终会非常的困难，组合方式也非常的多。所以我们先来简单的看看，官方为原话是 **一般来说，一个请求流经中间件、守卫与拦截器，然后到达管道，并最终回到拦截器中的返回路径中（从而产生响应**

中间价 -> 守卫 —> req拦截器 -> 管道 -> 返回相应 -> res拦截器

1. 中间件

先看第一点 *中间件是在路由处理程序 之前 调用的函数*
对于 middleware 有全局和模块的两种，req进入时，Nest先会运行全局的(app.use)，然后运行路径中指定的模块内middleware， req出去的时候 则是先模块内的然后全局的。

2. 守卫

对于 守卫来说*守卫在每个中间件之后执行，但在任何拦截器或管道之前执行。* 全局守卫 -> 控制器守卫 -> 最后是路径守卫 ，若多个守卫则是按顺序执行

```ts
app.useGlobalGuard(new Guard0())
++++
@UseGuards(Guard1, Guard2)
@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @UseGuards(Guard3)
  @Get()
  getCats(): Cats[] {
    return this.catsService.getCats();
  }
}

// 这种情况下 Guard0 -> Guard1 -> Guard2 -> Guard3 当然了如果有全局的 就会先执行全局的 （app.useGlobalGuard()）
```

3. 拦截器（请求前  next.handle() 之前

大部分情况下类型，但是有一种情况特殊 就是 返回rxjs Observables 时就是*先进后出了*  或者 req/res 在error时 都能够被 拦截器 *catchError* 读取到。

也就是 next.handle() 之前 会绑定部分逻辑 然后进入下面的处理中

4. 管道

管道按照标准的从全局到控制器再到路由的绑定顺序，遵循先进先出的原则按照@usePipes()参数次序顺序执行, 但有一个情况特殊 *路由参数层 多个管道执行，从后向前*

```ts
@UsePipes(GeneralValidationPipe)
@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @UsePipes(RouteSpecificPipe)
  @Patch(':id')
  updateCat(
    @Body() body: UpdateCatDTO,
    @Param() params: UpdateCatParams,
    @Query() query: UpdateCatQuery,
  ) {
    return this.catsService.updateCat(body, params, query);
  }
}

// GeneralValidationPipe 先执行query然后是params > body
// 然后是  RouteSpecificPipe的 RouteSpecificPipe
```

5. 执行具体的controller 方法

6. 回到 拦截器中 （请求之后 next.handle() 之后）

7. 过滤器 前面的所有流程中的异常 也可以在这里catch到

这个东西 比较特殊 *而是会从最低层次开始处理* 先 具体的router > contoller > 全局，
且 **异常无法从过滤器传递到另一个过滤器**

**如果一个路由层过滤器捕捉到一个异常，一个控制器或者全局层面的过滤器就捕捉不到这个异常。如果要实现类似的效果可以在过滤器之间使用继承。**

### 总结一下 就是下面的顺序

1. 收到请求
2. 全局绑定的中间件
3. 模块绑定的中间件
4. 全局守卫
5. 控制层守卫
6. 路由守卫
7. 全局拦截器（控制器之前）
8. 控制器层拦截器 （控制器之前）
9. 路由拦截器 （控制器之前）
10. 全局管道
11. 控制器管道
12. 路由管道
13. 路由参数管道
14. 控制器（方法处理器） 15。服务（如果有）
16. 路由拦截器（请求之后）
17. 控制器拦截器 （请求之后）
18. 全局拦截器 （请求之后）
19. 异常过滤器 （路由，之后是控制器，之后是全局）
29. 服务器响应

### 有的同学 对 拦截器的 next.handle() 先和后有疑问
>
> 有的同学 对 拦截器的 next.handle() 先和后有疑问 ,我们用一个具体的例子来说来说明，

```ts
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
  }
}

@Controller('cats')
@UseGuards(RolesGuard)
@UseInterceptors(LoggingInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(RolesGuard3)
  getHello(): string {
    console.log('getHello');
    return this.appService.getHello();
  }
}

// 那么你将会看到这样的log 信息
Before...
getHello
After... 3ms
```

## 关于error 堆栈定位的问题
>
> 许多同学都提到一个问题 **winston 打印的堆栈信息怎么定位到源码位置，我调试出来总是定位到编译后的文件位置**

1. 我们先不看使用何种 log记录器，我们就单纯的来看 “如何定位为ts源代码”

我们先造一个error, 有一点需要特别注意，我们run 并不是直接run ts，而是编译之后的js ，故一般error 的 堆栈信息 都是在编译后的js中

```shell
yarn build

node ./dist main.js
```

nestjs 编译出来之后 实际上是默认生产 sourcemap的，那么这就好办了 ，node12 之后有一个命令，可以解析这些信息，所以我们只需要  

```shell
 node --enable-source-maps ./dist/main.js
```

2. log记录器 同样可以记录到

## 深入一下 自定义的 装饰器
>
> 一般和拦截器/中间价 结合起来使用
