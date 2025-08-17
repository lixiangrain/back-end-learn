const express = require('express')
const authRouter = require('./router/auth.router')
const chatRouter = require('./router/chat.router')
const config = require('./config/jwt.config');
const { expressjwt: expressJWT } = require("express-jwt");
const { AppDataSource } = require("./data.source");
const app = express()
const cors = require('cors')

// 中间件
app.use(cors())
app.use(express.json())
app.use(expressJWT({
    secret: config.secretKey,
    algorithms: ["HS256"],
}).unless({ path: [/^\/api\//] }));
// 路由
app.use('/api', authRouter)
app.use('/chat', chatRouter)

// 错误处理中间件
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        console.log('JWT验证失败:', err.message);
        return res.status(401).json({
            code: 401,
            message: 'Token验证失败',
            error: err.message
        });
    }
    console.log(err)
    res.status(500).json({
        code: 500,
        message: 'Internal server error',
        data: null
    })
    // res.send({
    //     code: 500,
    //     message: 'Internal server error',
    //     data: null
    // })
    // next()
})
// 初始化数据库并启动服务器
AppDataSource.initialize()
    .then(() => {
        console.log("数据库连接已建立");
        app.listen(3000, () => {
            console.log('Server is running on port: http://localhost:3000')
        })
    })
    .catch((error) => {
        console.error("数据库连接错误:", error);
    });

