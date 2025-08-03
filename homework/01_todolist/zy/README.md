# 待办事项应用

一个基于Vue3前端和Node.js后端的待办事项管理应用。

## 技术栈
- 前端：Vue3 + Vite + Pinia
- 后端：Node.js HTTP服务器
- 数据存储：JSON文件

## 项目结构

└── zy/
├── public/            # 静态资源
├── server/            # 后端代码
│   ├── index.js      # Node.js服务器
│   └── todos.json    # 数据存储
├── src/              # 前端源码
│   ├── api/          # API调用
│   └── utils/        # 工具函数
└── vite.config.js    # Vite配置

## 功能特性
- 待办事项的增删改查
- 状态标记(完成/未完成)
- 本地持久化存储
## 安装与运行
### 前端
```
npm install
npm run dev
```
### 后端
```
cd server
node index.js
```
## API接口
- GET /api/todos - 获取所有待办事项
- POST /api/todos - 添加新待办事项
- PUT /api/todos/:id - 更新待办事项
- DELETE /api/todos/:id - 删除待办事项
