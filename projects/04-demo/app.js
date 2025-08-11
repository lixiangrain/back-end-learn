// 1. 导入express
import express from 'express';

const users = [
    {
        name: '张三',
        age: 18
    },
    {
        name: '李四',
        age: 19
    },
]

// 2. 创建一个express实例 
const app = express();

// 3. 添加中间件
app.use(express.json())

// 4. app创建路由
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/user', (req, res) => {
    res.send(users);
})

// 4. 启动服务器
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});