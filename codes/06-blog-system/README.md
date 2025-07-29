# 博客系统项目

这是一个基于Express和MySQL的完整博客系统项目，实现了用户管理和文章管理功能，包含完整的用户认证和文章模块。

## 项目特性

- 使用Express框架构建Web服务器
- 原生SQL操作数据库（无ORM）
- 简化三层架构设计（路由、模型）
- RESTful API设计
- 完善的错误处理机制
- 请求日志记录
- JWT令牌认证
- 支持Swagger文档
- 使用ES模块语法

## 数据库设计

### 用户表 (users)
| 字段名 | 类型 | 描述 |
|-------|------|------|
| id | INT | 主键，自增 |
| username | VARCHAR(50) | 用户名 |
| email | VARCHAR(100) | 邮箱 |
| password | VARCHAR(255) | 密码（加密存储） |
| created_at | TIMESTAMP | 创建时间 |

### 文章表 (posts)
| 字段名 | 类型 | 描述 |
|-------|------|------|
| id | INT | 主键，自增 |
| title | VARCHAR(200) | 文章标题 |
| content | TEXT | 文章内容 |
| user_id | INT | 外键，关联用户表 |
| created_at | TIMESTAMP | 创建时间 |

## API文档

完整的API文档可通过Swagger访问，访问地址：`http://localhost:3000/api-docs`

## 功能模块

### 用户认证模块
- 用户注册（创建新用户）
- 用户登录（获取JWT令牌）
- JWT令牌验证（保护API路由）

### 文章模块
- 文章CRUD操作（创建、读取、更新、删除）
- 分页支持
- 用户关联（每篇文章关联一个作者）

## 项目架构

本项目采用简化的三层架构模式：
- 路由层(routes/)：处理HTTP请求和响应，包含业务逻辑
- 模型层(models/)：负责数据访问和数据库操作
- 中间件层(middleware/)：处理认证、日志等横切关注点

## 安装和运行

1. 安装依赖
```bash
npm install
```

2. 创建数据库
```sql
CREATE DATABASE blog_db;
-- 创建用户表和文章表（见数据库设计部分）
```

3. 启动服务
```bash
npm start
```

## 项目结构
```
blog-system/
├── app.js                # 主应用文件
├── package.json          # 项目依赖配置
├── config/               # 配置文件
│   └── db.js             # 数据库配置
├── models/               # 数据模型
│   ├── user.js           # 用户模型
│   └── post.js           # 文章模型
├── routes/               # 路由定义和业务逻辑
│   └── api.js            # API路由
├── middleware/           # 自定义中间件
│   ├── auth.js           # JWT认证中间件
│   ├── logger.js         # 日志中间件
│   └── cors.js           # CORS中间件
├── utils/                # 工具函数
│   └── response.js       # 统一响应格式工具
└── README.md             # 项目说明文档
```