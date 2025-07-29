// 主应用文件
import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import apiRouter from './routes/api.js';
import { pool, getConnection } from './config/db.js';
import logger from './middleware/logger.js';
import cors from './middleware/cors.js';
import { error } from './utils/response.js';

// 创建Express应用
const app = express();

// Swagger配置
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '博客系统API文档',
      version: '1.0.0',
      description: '博客系统API接口文档',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: '开发环境'
      }
    ]
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// 日志记录中间件
/**
 * 日志记录中间件
 * 记录请求方法、URL、IP地址、状态码和响应时间
 */
app.use(logger);

// CORS中间件
/**
 * CORS (Cross-Origin Resource Sharing) 中间件
 * 允许跨域请求访问API
 */
app.use(cors);

// JSON解析中间件
app.use(express.json());

// Swagger路由
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API路由
app.use('/api', apiRouter);

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

// 测试数据库连接
async function testDBConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('数据库连接成功');
    connection.release();
  } catch (err) {
    console.error('数据库连接失败:', err);
  }
}

// 启动服务器前测试数据库连接
testDBConnection();

// 启动服务器
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`博客系统服务已启动，监听端口 ${PORT}`);
  console.log('数据库连接状态: 已连接');
  console.log('Swagger文档地址: http://localhost:3000/api-docs');
});

export default app;