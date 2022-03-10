# 这个仓库是什么？干什么的？

> 这部分的内容，我们将会学习如何使哟nestjs实现最简单的功能 完成tag user Arctic的CRUD （增删改查）

## 先完成最简单的功能（阶段1入门）

> 这里我们先把理论知识 ，梳理一遍，

- Nest是什么

Nest 是一个用于构建高效，可扩展的 Node.js 服务器端应用程序的框架。全面支持TS 严重 借鉴了Angular，如果你会Angular 那么Nestjs就非常的香。 如果要我说Nest最大的特点是什么那么一定是它的 定位 ===> “Nest 提供了一个开箱即用的应用程序架构，”

- 安装非常的简单

- 看看大概的项目结构样子

- Controller 和参数如何获取 路由如何构建

- Providers 这个概念

- 基于Providers我们衍生出了service 和modules，我们啦聊聊他们
（难点突破 动态模块 ）

- 看看我们如何设计路由（实战）

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

- 看看我们如何设计数据库（实战）
我们以最基础的mysql为例子，先创建三张表

article表

| name            | typ | Description |
| ----------- | ----------- |----------- |
| id      | int       | 主键       |
| title      | varchar(100)       | 标题       |
| create_time   |  init        | 创建时（时间戳）       |
| create_by   |  userId        | 被谁创建     |
| update_time   | init        | 修改时间       |
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

- 看看我们如何设计开始CRUD（实战）
有了表之后，我们看看如何连接到mysql，载nodejs中这块还算非常简单了，有许许多多的orm库，我们使用

- 阶段1的总结

## 优化的方向和方法（阶段2 优化）

## 如何使用Docker和Gitlab-CI做自动化（阶段3 部署和上线）
