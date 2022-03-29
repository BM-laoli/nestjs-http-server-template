# 这个仓库是什么？干什么的？

> 这部分的内容，我们将会学习如何使哟nestjs实现最简单的功能 完成tag user Arctic的CRUD （增删改查）

## 先完成最简单的功能（阶段1入门）

> 这里我们先把理论知识 ，梳理一遍，

### Nest是什么 以及基础概念解析

Nest 是一个用于构建高效，可扩展的 Node.js 服务器端应用程序的框架。全面支持TS 严重 借鉴了Angular，如果你会Angular 那么Nestjs就非常的香。 如果要我说Nest最大的特点是什么那么一定是它的 定位 ===> “Nest 提供了一个开箱即用的应用程序架构，”

- 安装非常的简单

- 看看大概的项目结构样子

- Controller 和参数如何获取 路由如何构建

- Providers 这个概念

- 基于Providers我们衍生出了service 和modules，我们啦聊聊他们
（难点突破 动态模块 ）

### 看看我们如何设计路由（实战）

实际上我们的需要做目标就是设计一个非常非常简单的博客, 需要有article 和tag 以及user article 会被打上tag标签，user可以对tag 和 article 维护

1. Article相关

- get /artcels 获取所有文章
- get /artcels:id 获取指定id的文章
 -post /artcels 创建文章
 -put /artcels:id 修改文章
 -delete /artcels:id 删除文章

2. Tag相关

- get /tags 获取所有 标签
 -post /tag 创建标签
 -put /tag:id 修改标签
 -delete /tag:id 删除标签

3. User相关

- get /users 获取所有用户
- get /user:id 获取指定id用户的用户信息
 -post /user 创建用户（注册）
 -put /user:id 修改用户 信息
 -delete /user:id 删除用户

路有的实现请去看源代码，这里列举一份简单的

```ts
// controller 由于只是路有因此我们只需要这个controller 和module就够了，但是后续一定会controller modules 和service并存的，所以这里都加上

import { Body, Controller, Get, Header, HttpCode, HttpStatus, Param, Post, Query, Redirect, Req, Res,Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import  { Request,Response, } from 'express'

interface InterUserInfo {
  
}
@Controller("user")
export class UserController {
  constructor(private readonly  userService: UserService) {}

  @Get('/users')
  getHello(): string {
    return "this is userGet"
  }

  @Get('/:id')
  getUserById(@Param() id:string  ): string {
    return id
  }

  @Post()
  createUser(@Body() userInfo: InterUserInfo  ): string {
    return JSON.stringify(userInfo || {})
  }
  
  @Put("/:id")
  updateUser(@Param() id:string, @Body() userInfo: InterUserInfo  ): string {
    return JSON.stringify(userInfo || {})
  }

  @Delete("/:id")
  deleteUser(@Param() id:string,  ): string {
    return "deleteUser"
  }
}


// service
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getHello(): string {
    return 'Hello World!';
  }
}


// modules
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [],
  controllers: [UserController], 
  providers: [UserService],  
})
export class UserModule {}


// AppModules中聚合一下
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    UserModule,
  ],
  providers: [AppService],  // 这个我们暂且不管
})
export class AppModule {}


```

### 看看我们如何设计数据库（实战）

我们以最基础的mysql为例子，先创建三张表

article表

| name            | typ | Description |
| ----------- | ----------- |----------- |
rticle| id      | int       | 主键       |
| title      | varchar(100)       | 标题       |
| create_time   |  init        | 创建时（时间戳）       |
| update_time   | init        | 修改时间       |
| create_by   |  userId        | 被谁创建     |
| content   | varchar(255)        | 文章内容       |
| desc   | varchar(100)        | 摘要       |
| cover_image_url   |  varchar(100)        | 封面       |
| state   | tinyinit        | 状态 0 1 （0 隐藏 1 开启）       |
| tags      |  tagId       | 被关联的tag 外健       |

tag表

| name            | typ | Description |
| ----------- | ----------- |----------- |
| id      | int       | 主键        |
| name      | varchar(100)       |    名称    |
| create_time   |  init        | 创建时（时间戳）       |
| update_time   | init        | 修改时间       |
| state   | tinyinit        | 状态 0 1 （0 隐藏 1 开启）       |
| create_by   |  userId        | 被谁创建     |

user 表

| name            | typ | Description |
| ----------- | ----------- |----------- |
| id      | int       | 主键        |
| username   |  varchar(100)        | 用户名     |
| password   | varchar(255)        | 密码       |
| create_time   |  init        | 创建时（时间戳）       |
| update_time   | init        | 修改时间       |
| state   |     tinyinit    | 状态 0 1 （0 隐藏 1 开启）       |
| email   |  varchar(100        |  邮箱地址 |

有了这份数据库的设计，我们开始做来搞这个数据库, 我在这儿放了个SQL，当然如果你使用可视化的操作工具还是可以的 🔧

首先是生产user的

```sql
CREATE TABLE `node_blog`.`无标题`  (
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '用户名',
  `create_time` int NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` int NULL DEFAULT NULL COMMENT '修改时间',
  `state` tinyint NULL DEFAULT NULL COMMENT '状态',
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '邮箱',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '密码',
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;
```

然后是生产tag的

```sql
CREATE TABLE `node_blog`.`无标题`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '标签名',
  `create_time` int NULL DEFAULT NULL COMMENT '创建时间',
  `update_name` int NULL DEFAULT NULL COMMENT '修改时间',
  `state` tinyint NULL DEFAULT NULL COMMENT '状态',
  `create_by` int UNSIGNED NULL DEFAULT NULL COMMENT '被谁创建',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `create_by_id`(`create_by` ASC) USING BTREE,
  CONSTRAINT `create_by_id` FOREIGN KEY (`create_by`) REFERENCES `node_blog`.`user` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

```

最后是生产article

```sql
CREATE TABLE `node_blog`.`无标题`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'id',
  `title` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '标题',
  `create_time` int NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` int NULL DEFAULT NULL COMMENT '合时更新',
  `content` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '内容',
  `desc` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '概述',
  `cover_image_url` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '封面图',
  `state` tinyint NULL DEFAULT NULL COMMENT '状态',
  `tags` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '标签',
  `create_by` int UNSIGNED NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `create_by_ids`(`create_by` ASC) USING BTREE,
  CONSTRAINT `create_by_ids` FOREIGN KEY (`create_by`) REFERENCES `node_blog`.`user` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;
```

### 看看我们如何设计开始CRUD（实战）

有了表之后，我们看看如何连接到mysql，载nodejs中这块还算非常简单了，有许许多多的orm库, 在这里我们选择一个名字叫做typeorm的一个库，载nodejs中typeorm还是非常流行的，很多坑什么的都填的差不多，具体如何实现载代码中都有体现，我们这里举一个例子，看看Article 的 全部CRUD 如何实现

这里需要说明的是DataBase 和typeOrm 的使用，我们不用安装官方的走，会有问题（按照官方的走 你会遇到数据库初始化多次导致多对多表 一对多表的索引处问题）。

下一个问题就是如何使用 typeorm 对关系数据进行索引查询，我在示例中也给出了 同样的我们并没有按照Nest 官方给的typeorm使用，我们看看@nest/typeorm + typeorm 官方文档就够用了
**初始化模块 + 数据库关系** 是重点

- 阶段1的总结

## 优化的方向和方法（阶段2 优化）

> 上述只是 最简单的实现，现在我们来看看如何 做进一步的优化，让它更像一个 “正规军”的打法，这需要完善的内容包括了下面的几个部分，比如配置集中管理 日志收集 单元测试 压力测试 jwt验证等....

### 如何做配置优化

> 配置优化比较好做 看官方的这个文档就够了

特别提醒**运行时**，假设我们现在有这样的需求：在dev环境下就直接使用.env文件中的配置, 在
开发环境由 发布平台自己 去指定 运行时的一些环境变量，并且能够哦覆盖.env环境变量。

如果你希望这样做

```json
    "start:dev": "nest start --watch  XXXX=XXXX",
    // 这样做是不行的。因为nest是一个运行时的东西，如果你这样做nest启动前变量就获取完了，就轮不到你去设置了你应该这样修改
    "start:dev": "XXXX=XXXX nest start --watch",

    // 如果你希望在运行时能够自由的指定构建平台，你需要在这里进行指定 直接跑nest 不要跑 start了
     yarn add cross-env
     
     yarn cross-env DATABASE_HOST=000 nest start --watch
```

### 如何做日志收集和记录
<!-- 详细内容在 这里可以看到里面有很全面的教程， 我们是哟 log4j 把日志记录到本地文件中，后续运维可以通过这些日志的持久化读取出来 进行分析-->

### 封装统一的错我返回体和正常的返回体

### 如何做Jwt验证

### 关于Nest的运行时 和build

### 上传文件如何实现

### swage如何实现

### 定时job 如何实现

### redis缓存如何实现

### 导入导出excel如何实现

### 微服务如何做

### 优雅重启如何做

### 如何部署（构建自定义的CI）

## 如何使用Docker和Gitlab-CI做自动化（阶段3 部署和上线）

```shell
nest g mo /modules/cache
nest g co /modules/cache  --no-spec
nest g s /modules/cache --no-spec
```

# 配置管理

# 日志收集和记录（中间价、 拦截器）

# 异常过滤（拦截器）

# 请求参数校验 （Dto）

# jwt验证方案

# 统一返回体定义

# 上传文件

# 请求转发

# 定时Job

# 上swagger

# 利用redis做单点登录

# 如何做微服务？通信架构如何设计？

# Nest到底咋运行的？
