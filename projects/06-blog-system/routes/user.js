// User 路由
import express from 'express';
import User from '../models/user.js';
import { success, error } from '../utils/response.js';

const userRouter = express.Router();

// 用户注册路由
userRouter.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const userData = await User.create({ username, email, password });

        res.status(201).json(
            success(
                {
                    id: userData.id,
                    username: userData.username,
                    email: userData.email
                },
                '用户创建成功',
                201
            )
        );
    } catch (err) {
        console.error('用户注册失败:', err);
        res.status(500).json(
            error('用户注册过程中发生错误', null, 500)
        );
    }
});

// 用户登录路由
userRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await User.login(email, password);

        if (!result) {
            return res.status(401).json(
                error('邮箱或密码错误', null, 401)
            );
        }

        res.json(
            success(
                {
                    user: result.user,
                    token: result.token
                },
                '登录成功',
                200
            )
        );
    } catch (err) {
        console.error('用户登录失败:', err);
        res.status(500).json(
            error('验证用户凭证时发生错误', null, 500)
        );
    }
});

export default userRouter;