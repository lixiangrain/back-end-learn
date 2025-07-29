// 主应用文件
import express from 'express';

import PostRouter from './routes/post.js';
import userRouter from './routes/user.js';

import { cors, logger } from './middleware/index.js';
import { error } from './utils/response.js';

// 创建Express应用
const app = express();

app.use(logger);  // 日志记录中间件
app.use(cors);  // CORS中间件
app.use(express.json());  // JSON解析中间件

// 注册路由
app.use('/api/user', userRouter);
app.use('/api/post', PostRouter);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('发生错误:', err);
  res.status(500).json(
    error('服务器内部错误', err.message, 500)
  );
});

// 404处理
app.use((req, res, next) => {
  res.status(404).json(
    error('请求的资源不存在', null, 404)
  );
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`博客系统服务已启动，监听端口 ${PORT}`);
});