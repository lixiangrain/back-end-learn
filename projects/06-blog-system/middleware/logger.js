/**
 * 日志记录中间件
 * 
 * 该中间件用于记录HTTP请求的相关信息，包括：
 * - 请求时间戳
 * - 请求方法
 * - 请求URL
 * - 响应状态码
 * - 请求处理时间
 */

/**
 * 日志记录中间件函数
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - 下一个中间件函数
 */
const logger = (req, res, next) => {
  // 记录请求开始时间
  const startTime = Date.now();
  
  // 监听响应完成事件，记录响应信息
  res.on('finish', () => {
    // 计算请求处理时间
    const duration = Date.now() - startTime;
    
    // 输出格式化的日志信息
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  
  // 调用下一个中间件
  next();
};

export default logger;