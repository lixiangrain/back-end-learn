// JWT认证中间件
import jwt from 'jsonwebtoken';
import { error } from '../utils/response.js';

/**
 * 验证JWT令牌
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一步函数
 */
const authenticateToken = (req, res, next) => {
  // 从请求头获取token
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json(
      error('需要提供有效的JWT令牌进行认证', null, 401)
    );
  }
  
  // 验证token
  jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, user) => {
    if (err) {
      return res.status(403).json(
        error('提供的JWT令牌无效或已过期', null, 403)
      );
    }
    
    // 将用户信息附加到请求对象
    req.user = user;
    next();
  });
};

export default authenticateToken;