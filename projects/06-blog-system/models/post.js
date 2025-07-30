// 文章模型
import { pool } from '../config/db.js';

/**
 * 文章模型
 */
const Post = {
  // 获取所有文章（带分页）
  getAll: async (page = 1, limit = 10) => {
    try {
      const offset = (page - 1) * limit;
      const query = `SELECT p.id, p.title, p.content, 
                    u.username as author, 
                    p.created_at 
                    FROM posts p
                    JOIN users u ON p.user_id = u.id
                    ORDER BY p.created_at DESC
                    LIMIT ? OFFSET ?`;
      
      const [rows] = await pool.execute(query, [limit, offset]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  
  // 根据ID获取文章
  getById: async (id) => {
    try {
      const query = `SELECT p.id, p.title, p.content, 
                    u.username as author, 
                    p.created_at 
                    FROM posts p
                    JOIN users u ON p.user_id = u.id
                    WHERE p.id = ?`;
      
      const [rows] = await pool.execute(query, [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  },
  
  // 创建新文章
  create: async (postData, userId) => {
    try {
      const query = 'INSERT INTO posts SET ?, user_id = ?';
      const [result] = await pool.execute(query, [postData, userId]);
      
      const newPost = {
        id: result.insertId,
        ...postData,
        user_id: userId
      };
      
      return newPost;
    } catch (error) {
      throw error;
    }
  },
  
  // 更新文章
  update: async (id, updateData) => {
    try {
      const query = 'UPDATE posts SET ? WHERE id = ?';
      const [result] = await pool.execute(query, [updateData, id]);
      return { id, ...updateData };
    } catch (error) {
      throw error;
    }
  },
  
  // 删除文章
  delete: async (id) => {
    try {
      const query = 'DELETE FROM posts WHERE id = ?';
      const [result] = await pool.execute(query, [id]);
      return { id, deleted: true };
    } catch (error) {
      throw error;
    }
  }
};

export default Post;