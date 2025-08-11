// 04-apiproxy/app.js
const express = require("express");
const corsMiddleware = require("./middleware/cors.middleware");
const loggerMiddleware = require("./middleware/logger.middleware");
const authRouter = require("./router/auth.router");
const chatRouter = require("./router/chat.router");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

app.use(cors());
app.use(express.json());
// app.use(corsMiddleware);
// app.use(loggerMiddleware);
// 日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 挂载路由
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);

// 处理 404 错误
app.use((req, res, next) => {
  console.log("[app.js] 404 Error: Requested path:", req.originalUrl);
  res.status(404).json({ code: 404, message: "端点不存在" });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error("[app.js] Server error:", err.stack);
  res.status(500).json({ code: 500, message: "服务器内部错误" });
});

// Chat SSE 路由
app.get("/api/chat", async (req, res) => {
  try {
    const model = req.query.model || 'qwen';
    const message = req.query.message;

    // 设置 SSE 响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    console.log(`[Chat] 收到请求: 模型=${model}, 消息=${message}`);

    // 调用 Ollama API
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: message }],
        stream: true
      })
    });

    // 处理流式响应
    for await (const chunk of response.body) {
      const text = chunk.toString();
      try {
        const data = JSON.parse(text);
        // 发送数据到客户端
        res.write(`data: ${JSON.stringify(data)}\n\n`);

        if (data.done) {
          res.write('data: {"done": true}\n\n');
          break;
        }
      } catch (e) {
        console.error('解析响应出错:', e);
      }
    }

    res.end();
  } catch (error) {
    console.error('[Chat] 错误:', error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
