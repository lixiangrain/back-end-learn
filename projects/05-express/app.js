/**
 * Express基础示例 - 为初学者设计
 * 
 * 这个示例展示了如何使用Express框架创建一个简单的Web服务器
 * 包括路由处理、中间件使用和错误处理等核心概念
 */

// 1. 导入Express模块
// Express是一个基于Node.js的Web应用框架，提供了构建Web应用的多种功能
import express from 'express';

// 2. 创建Express应用实例
// app对象包含了所有Express的方法和中间件
const app = express();

const mockPosts = [
  {
    id: 1,
    title: 'Mock Post Title',
    content: 'This is a mock post content.',
  },
  {
    id: 2,
    title: 'Mock Post Title',
    content: 'This is a mock post content.',
  },
];

// 3. 使用中间件
// express.json()是一个内置中间件，用于解析JSON格式的请求体
// 当客户端发送JSON数据时，这个中间件会自动将其解析为JavaScript对象
app.use(express.json());

// 日志打印中间件：记录请求方法、URL和时间
app.use((req, res, next) => {
  req.startTime = Date.now();
  res.on('finish', () => {
    const responseTime = Date.now() - req.startTime;
    console.log(`${req.method} ${req.url} ${res.statusCode} - ${responseTime} ms`);
  });
  next();
});

// 4. 定义路由处理函数
// GET请求路由，当用户访问 /posts 路径时会执行这个函数
// req: 请求对象，包含客户端发送的数据
// res: 响应对象，用于向客户端发送数据
app.get('/posts', (req, res) => {
  // 发送JSON格式的响应数据给客户端
  res.success({
    data: mockPosts,
    message: '查询成功'
  });
});

// GET请求路由，根据ID获取单个文章
app.get('/post/:id', (req, res) => {
  const id = req.params.id;
  const mockPost = mockPosts.find((post) => post.id === parseInt(id));
  
  if (!mockPost) {
    return res.error({
      code: 404,
      message: '文章未找到'
    });
  }
  
  res.success({
    data: mockPost,
    message: '查询成功'
  });
});

// 5. 错误处理中间件
// 错误处理中间件需要4个参数：err, req, res, next
// 当应用中发生错误时，会自动调用这个中间件
app.use((err, req, res, next) => {
  // 在控制台打印错误堆栈，便于开发者调试
  console.error('应用程序发生错误:', err.stack);

  // 向客户端发送错误响应
  res.error({
    code: 500,
    message: '服务器内部错误'
  });
});

// 6. 启动服务器
// 定义服务器监听的端口号
const PORT = 3000;

// 为res对象添加统一响应方法
app.use((req, res, next) => {
  res.success = (payload) => {
    const defaultPayload = {
      code: 200,
      message: '成功',
      data: null,
      ...payload
    };
    
    // 如果没有提供message且有data但message在payload中，使用默认message
    if (!payload.message && payload.data !== undefined) {
      defaultPayload.message = '成功';
    }
    
    return res.json(defaultPayload);
  };
  
  res.error = (payload) => {
    const defaultPayload = {
      code: 500,
      message: '失败',
      ...payload
    };
    
    // 如果没有提供message且code不是200系列
    if (!payload.message && (defaultPayload.code < 200 || defaultPayload.code >= 300)) {
      defaultPayload.message = '失败';
    }
    
    return res.status(defaultPayload.code).json(defaultPayload);
  };
  
  next();
});

// 启动服务器并监听指定端口
// listen方法启动服务器，当服务器成功启动后会执行回调函数
app.listen(PORT, () => {
  // 在控制台打印服务器启动信息
  console.log(`Express服务器已启动，正在监听端口 ${PORT}`);
  console.log(`在浏览器中访问 http://localhost:${PORT}/posts 测试API`);
});

// 7. 教学要点说明
/**
 * Express核心概念总结：
 * 
 * 1. 中间件(Middleware)：
 *    - 中间件是处理请求和响应的函数
 *    - 可以修改请求和响应对象
 *    - 可以结束请求-响应循环或调用下一个中间件
 *    - 按照注册顺序依次执行
 * 
 * 2. 路由(Routing)：
 *    - 定义应用程序如何响应客户端的特定端点请求
 *    - 包含URL和HTTP方法的组合
 *    - 可以使用app.get(), app.post(), app.put(), app.delete()等方法
 * 
 * 3. 请求和响应对象：
 *    - req: 包含HTTP请求的信息
 *    - res: 用于发送HTTP响应
 * 
 * 4. 响应格式：
 *    - 使用统一的响应格式(包含code, message, data字段)
 *    - 成功响应使用2xx状态码，错误响应使用非2xx状态码
 *    - message字段用于简要描述结果，data字段用于携带数据
 * 
 * 5. 错误处理：
 *    - 通过特殊的四参数中间件处理错误
 *    - 确保应用程序的稳定性
 */