// 用户模型
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

/**
 * 用户模型
 */
const User = {
  // 通过ID获取用户
  getById: async (id) => {
    try {
      const query = 'SELECT id, username, email, created_at FROM users WHERE id = ?';
      const [rows] = await pool.execute(query, [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  },
  
  // 通过邮箱获取用户
  getByEmail: async (email) => {
    try {
      const query = 'SELECT * FROM users WHERE email = ?';
      const [rows] = await pool.execute(query, [email]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  },
  
  // 创建新用户
  create: async (userData) => {
    try {
      // 对密码进行哈希处理
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const query = 'INSERT INTO users SET ?';
      const userDataWithHash = {
        ...userData,
        password: hashedPassword
      };
      
      const [result] = await pool.execute(query, userDataWithHash);
      return {
        id: result.insertId,
        ...userData
      };
    } catch (error) {
      throw error;
    }
  },
  
  // 验证用户登录
  login: async (email, password) => {
    try {
      const user = await User.getByEmail(email);
      if (!user) return null;
      
      // 验证密码
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return null;
      
      // 生成JWT令牌
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'secret_key',
        { expiresIn: '1h' }
      );
      
      return { user, token };
    } catch (error) {
      throw error;
    }
  }
};

export default User;