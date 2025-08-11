import http from 'http';

// 自定义中间件队列处理器
function createMiddlewareChain(middlewares) {
    return function (req, res) {
        let i = 0;
        function next() {
            const middleware = middlewares[i++];
            if (middleware) {
                middleware(req, res, next);
            }
        }
        next();
    };
}

// 示例中间件: 记录请求的时间、方法、处理时间
function logger(req, res, next) {
    const startTime = Date.now();
    next(); // 调用下一个中间件：
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${Date.now() - startTime}ms`);
}

function helloMiddlewear(req, res, next) {
    console.log('helloMiddlewear');
    next() // 调用下一个中间件：
}

// 构建中间件链
const app = createMiddlewareChain([
    logger,
    helloMiddlewear
]);

// 创建服务器
const server = http.createServer((req, res) => {
    app(req, res); // 交由中间件链处理
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
