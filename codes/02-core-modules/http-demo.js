/**
 * HTTP 模块演示
 * 
 * 展示如何使用 Node.js 内置 http 模块创建服务器和客户端
 * 运行方式：node http-demo.js
 * 然后在浏览器访问 http://localhost:3000
 */

const http = require('http');
const url = require('url');
const querystring = require('querystring');

console.log('=== HTTP 模块演示 ===\n');

// 服务器配置
const PORT = 3000;
const HOST = 'localhost';

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  // 解析请求 URL
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;
  const method = req.method;
  
  // 记录请求信息
  console.log(`📥 ${method} ${pathname} - ${new Date().toLocaleString()}`);
  
  // 设置通用响应头
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 路由处理
  switch (pathname) {
    case '/':
      handleHome(req, res);
      break;
    case '/api/info':
      handleApiInfo(req, res);
      break;
    case '/api/echo':
      handleEcho(req, res, query);
      break;
    case '/api/post':
      handlePost(req, res);
      break;
    case '/api/json':
      handleJson(req, res);
      break;
    case '/health':
      handleHealth(req, res);
      break;
    default:
      handle404(req, res);
  }
});

/**
 * 首页处理
 */
function handleHome(req, res) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Node.js HTTP 服务器演示</title>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .container { max-width: 800px; margin: 0 auto; }
            .endpoint { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .method { color: #007acc; font-weight: bold; }
            button { background: #007acc; color: white; border: none; padding: 10px 15px; margin: 5px; border-radius: 3px; cursor: pointer; }
            button:hover { background: #005a9e; }
            #result { background: #f9f9f9; padding: 15px; margin: 10px 0; border-radius: 5px; min-height: 50px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 Node.js HTTP 服务器演示</h1>
            <p>欢迎来到 Node.js HTTP 服务器！这里演示了各种 HTTP 功能。</p>
            
            <h2>📡 可用的 API 端点：</h2>
            
            <div class="endpoint">
                <span class="method">GET</span> /api/info - 获取服务器信息
                <button onclick="testApi('/api/info')">测试</button>
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> /api/echo?message=hello - 回显消息
                <button onclick="testApi('/api/echo?message=Hello%20Node.js!')">测试</button>
            </div>
            
            <div class="endpoint">
                <span class="method">POST</span> /api/post - 处理 POST 数据
                <button onclick="testPost()">测试</button>
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> /api/json - 返回 JSON 数据
                <button onclick="testApi('/api/json')">测试</button>
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> /health - 健康检查
                <button onclick="testApi('/health')">测试</button>
            </div>
            
            <h3>📋 测试结果：</h3>
            <div id="result">点击上面的按钮测试 API...</div>
            
            <script>
                async function testApi(endpoint) {
                    try {
                        const response = await fetch(endpoint);
                        const data = await response.text();
                        document.getElementById('result').innerHTML = 
                            '<strong>状态:</strong> ' + response.status + '<br>' +
                            '<strong>响应:</strong><br><pre>' + data + '</pre>';
                    } catch (error) {
                        document.getElementById('result').innerHTML = 
                            '<strong style="color: red;">错误:</strong> ' + error.message;
                    }
                }
                
                async function testPost() {
                    try {
                        const response = await fetch('/api/post', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                                name: '张三', 
                                message: '这是一个 POST 请求测试',
                                timestamp: new Date().toISOString()
                            })
                        });
                        const data = await response.text();
                        document.getElementById('result').innerHTML = 
                            '<strong>状态:</strong> ' + response.status + '<br>' +
                            '<strong>响应:</strong><br><pre>' + data + '</pre>';
                    } catch (error) {
                        document.getElementById('result').innerHTML = 
                            '<strong style="color: red;">错误:</strong> ' + error.message;
                    }
                }
            </script>
        </div>
    </body>
    </html>
  `;
  
  res.writeHead(200);
  res.end(html);
}

/**
 * API 信息处理
 */
function handleApiInfo(req, res) {
  const info = {
    server: 'Node.js HTTP Server',
    version: process.version,
    platform: process.platform,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers
    }
  };
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(info, null, 2));
}

/**
 * 回显处理
 */
function handleEcho(req, res, query) {
  const message = query.message || '没有提供消息';
  const response = {
    echo: message,
    timestamp: new Date().toISOString(),
    method: req.method,
    query: query
  };
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(response, null, 2));
}

/**
 * POST 请求处理
 */
function handlePost(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: '只支持 POST 方法' }));
    return;
  }
  
  let body = '';
  
  // 接收数据
  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  // 数据接收完成
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      const response = {
        message: '数据接收成功',
        received: data,
        timestamp: new Date().toISOString(),
        contentLength: body.length
      };
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response, null, 2));
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'JSON 解析失败: ' + error.message }));
    }
  });
}

/**
 * JSON 数据处理
 */
function handleJson(req, res) {
  const data = {
    users: [
      { id: 1, name: '张三', email: 'zhangsan@example.com' },
      { id: 2, name: '李四', email: 'lisi@example.com' },
      { id: 3, name: '王五', email: 'wangwu@example.com' }
    ],
    total: 3,
    timestamp: new Date().toISOString()
  };
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data, null, 2));
}

/**
 * 健康检查
 */
function handleHealth(req, res) {
  const health = {
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
    }
  };
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(health, null, 2));
}

/**
 * 404 处理
 */
function handle404(req, res) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>404 - 页面未找到</title>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; text-align: center; margin-top: 100px; }
            .error { color: #e74c3c; }
        </style>
    </head>
    <body>
        <h1 class="error">404 - 页面未找到</h1>
        <p>请求的路径 <code>${req.url}</code> 不存在</p>
        <a href="/">返回首页</a>
    </body>
    </html>
  `;
  
  res.writeHead(404);
  res.end(html);
}

// 启动服务器
server.listen(PORT, HOST, () => {
  console.log(`🚀 HTTP 服务器启动成功！`);
  console.log(`📍 地址: http://${HOST}:${PORT}`);
  console.log(`⏰ 启动时间: ${new Date().toLocaleString()}`);
  console.log(`🔧 Node.js 版本: ${process.version}`);
  console.log('\n💡 提示：');
  console.log('- 在浏览器中访问 http://localhost:3000');
  console.log('- 按 Ctrl+C 停止服务器');
  console.log('- 查看控制台输出了解请求信息\n');
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n🛑 收到停止信号，正在关闭服务器...');
  server.close(() => {
    console.log('✅ 服务器已关闭');
    process.exit(0);
  });
});

// 错误处理
server.on('error', (err) => {
  console.error('❌ 服务器错误:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.error(`端口 ${PORT} 已被占用，请尝试其他端口`);
  }
});

// 演示 HTTP 客户端请求
setTimeout(() => {
  console.log('\n🔄 演示 HTTP 客户端请求：');
  
  const options = {
    hostname: HOST,
    port: PORT,
    path: '/api/info',
    method: 'GET'
  };
  
  const clientReq = http.request(options, (clientRes) => {
    let data = '';
    
    clientRes.on('data', (chunk) => {
      data += chunk;
    });
    
    clientRes.on('end', () => {
      console.log('📨 客户端请求响应状态:', clientRes.statusCode);
      console.log('📄 响应数据长度:', data.length, '字符');
    });
  });
  
  clientReq.on('error', (err) => {
    console.error('❌ 客户端请求错误:', err.message);
  });
  
  clientReq.end();
}, 2000);
