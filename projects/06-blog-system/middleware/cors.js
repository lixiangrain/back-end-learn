/**
 * CORS (Cross-Origin Resource Sharing) 中间件
 * 
 * 该中间件用于处理跨域资源共享请求，允许前端应用从不同域访问API。
 * 主要功能包括：
 * - 设置响应头允许跨域请求
 * - 处理预检请求（OPTIONS）
 * - 设置允许的HTTP方法和请求头
 */

/**
 * CORS中间件函数
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - 下一个中间件函数
 */
const cors = (req, res, next) => {
  // 设置允许访问的源（* 表示允许所有源）
  res.header('Access-Control-Allow-Origin', '*');
  
  // 设置允许的HTTP方法
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  // 设置允许的请求头
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // 处理预检请求（OPTIONS）
  if (req.method === 'OPTIONS') {
    // 预检请求直接返回200状态码
    res.sendStatus(200);
  } else {
    // 非预检请求，调用下一个中间件
    next();
  }
};

export default cors;