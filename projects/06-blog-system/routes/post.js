// API路由
import express from 'express';
import Post from '../models/post.js';
import { authenticateToken } from '../middleware/auth.js';
import { success, error } from '../utils/response.js';

const postRouter = express.Router();

// 使用认证中间件的所有后续路由
postRouter.use(authenticateToken);

// 获取所有文章路由
postRouter.get('/posts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const posts = await Post.getAll(page, limit);

    res.json(
      success(
        {
          page,
          limit,
          total: posts.length, // 这里应该从数据库获取总数
          posts
        },
        '查询成功',
        200
      )
    );
  } catch (err) {
    console.error('获取文章列表失败:', err);
    res.status(500).json(
      error('获取文章列表时发生错误', null, 500)
    );
  }
});

// 获取单个文章路由
postRouter.get('/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.getById(postId);

    if (!post) {
      return res.status(404).json(
        error('找不到指定ID的文章', null, 404)
      );
    }

    res.json(
      success(post, '查询成功', 200)
    );
  } catch (err) {
    console.error('获取文章失败:', err);
    res.status(500).json(
      error('获取文章时发生错误', null, 500)
    );
  }
});

// 创建文章路由
postRouter.post('/posts', async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id; // 从认证信息中获取用户ID

    const post = await Post.create({ title, content }, userId);

    res.status(201).json(
      success(post, '文章创建成功', 201)
    );
  } catch (err) {
    console.error('创建文章失败:', err);
    res.status(500).json(
      error('创建文章时发生错误', null, 500)
    );
  }
});

// 更新文章路由
postRouter.put('/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const updateData = req.body;

    const post = await Post.update(postId, updateData);

    res.json(
      success(post, '文章更新成功', 200)
    );
  } catch (err) {
    console.error('更新文章失败:', err);
    res.status(500).json(
      error('更新文章时发生错误', null, 500)
    );
  }
});

// 删除文章路由
postRouter.delete('/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;

    const result = await Post.delete(postId);

    res.json(
      success(result, '文章删除成功', 200)
    );
  } catch (err) {
    console.error('删除文章失败:', err);
    res.status(500).json(
      error('删除文章时发生错误', null, 500)
    );
  }
});

export default postRouter;