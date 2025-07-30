# 06-blog-system

这是一个基于 Express 和 MySQL 的完整博客系统项目，实现了用户管理和文章管理功能，包含完整的用户认证和文章模块。

## 项目特性

- 使用 Express 框架构建 Web 服务器
- 原生 SQL 操作数据库（无 ORM）
- 简化的三层架构设计（路由、模型）
- RESTful API 设计
- 完善的错误处理机制
- 请求日志记录
- JWT 令牌认证
- 使用 ES 模块语法

## 数据库设计

### 用户表 (users)

| 字段名     | 类型         | 描述             |
| ---------- | ------------ | ---------------- |
| id         | INT          | 主键，自增       |
| username   | VARCHAR(50)  | 用户名           |
| email      | VARCHAR(100) | 邮箱             |
| password   | VARCHAR(255) | 密码（加密存储） |
| created_at | TIMESTAMP    | 创建时间         |

### 文章表 (posts)

| 字段名     | 类型         | 描述             |
| ---------- | ------------ | ---------------- |
| id         | INT          | 主键，自增       |
| title      | VARCHAR(200) | 文章标题         |
| content    | TEXT         | 文章内容         |
| user_id    | INT          | 外键，关联用户表 |
| created_at | TIMESTAMP    | 创建时间         |

## 数据库连接

项目使用 MySQL 数据库，并通过连接池管理数据库连接。配置文件位于 `config/db.js`，使用 `mysql2` 库提供的 Promise 包装来支持 async/await 语法。

数据库连接在模型层中使用：

- 用户模型: `models/user.js`
- 文章模型: `models/post.js`

### 数据库连接配置说明

数据库连接配置遵循以下规范：

1.  使用连接池模式提高数据库访问效率
2.  通过 Promise 封装支持现代化异步操作
3.  提供连接测试功能确保连接可用

### 测试数据库连接

```bash
# 方法1: 使用npm脚本
npm run test:db

# 方法2: 直接运行测试文件
node test-db-connection.js

# 方法3: 启动应用时自动测试
npm start
```

## 功能模块

### 用户认证模块

- 用户注册（创建新用户）
- 用户登录（获取 JWT 令牌）
- JWT 令牌验证（保护 API 路由）

### 文章模块

- 文章 CRUD 操作（创建、读取、更新、删除）
- 分页支持
- 用户关联（每篇文章关联一个作者）

## 项目架构

本项目采用简化的三层架构模式：

- `routes/`: 路由层，处理 HTTP 请求和响应，包含业务逻辑
- `models/`: 模型层，负责数据访问和数据库操作
- `middleware/`: 中间件层，处理认证、日志等横切关注点

## 安装和运行

1.  **安装依赖**

    在终端中进入此目录，然后运行：

    ```bash
    npm install
    ```

2.  **创建数据库**

    请确保您已安装并运行 MySQL。然后，创建一个名为 `blog_db` 的数据库：

    ```sql
    CREATE DATABASE blog_db;
    ```

    接下来，在 `blog_db` 数据库中创建 `users` 和 `posts` 表（请参考上面的“数据库设计”部分）。

3.  **配置数据库连接**

    打开 `config/db.js` 文件，根据您的 MySQL 设置修改数据库连接信息（如 `host`, `user`, `password`）。

4.  **测试数据库连接**

    ```bash
    npm run test:db
    ```

5.  **启动服务**

    ```bash
    npm start
    ```

    服务器启动后，您可以在 `http://localhost:3000` 访问该应用。

## 项目结构

```
projects/06-blog-system/
├── app.js                # 主应用文件
├── package.json          # 项目配置文件
├── README.md             # 项目说明文档
├── config/               # 配置文件目录
│   └── db.js             # 数据库连接配置
├── middleware/           # 自定义中间件目录
│   ├── auth.js           # 认证中间件
│   ├── cors.js           # CORS 中间件
│   ├── index.js          # 中间件入口
│   └── logger.js         # 日志中间件
├── models/               # 数据模型目录
│   ├── post.js           # 文章模型
│   └── user.js           # 用户模型
├── routes/               # 路由定义和业务逻辑目录
│   ├── post.js           # 文章路由
│   └── user.js           # 用户路由
└── utils/                # 工具函数目录
    └── response.js       # 统一响应格式工具
```
