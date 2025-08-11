const { Ollama } = require("ollama");

async function streamChat(req, res) {
  const { model, message } = req.body;
  console.log("[chat.service.js] StreamChat, model:", model, "message:", message);
  if (!model || !message) {
    res.status(400).json({ code: 400, message: "模型或消息不能为空" });
    return;
  }
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const ollama = new Ollama(); // 使用默认配置
    // 测试 Ollama 连接
    try {
      const response = await ollama.list(); // 测试连接并获取模型列表
      console.log("[chat.service.js] Ollama server connected, available models:");
    } catch (error) {
      console.error("[chat.service.js] Ollama connection failed:", error.message);
      res.write(`data: ${JSON.stringify({ error: `无法连接到 Ollama 服务: ${error.message}` })}\n\n`);
      res.end();
      return;
    }
    // 验证模型存在
    const models = await ollama.list();
    if (!models.some((m) => m.name.includes(model))) {
      console.error("[chat.service.js] Model not found:", model);
      res.write(`data: ${JSON.stringify({ error: `模型 ${model} 未安装` })}\n\n`);
      res.end();
      return;
    }
    const stream = await ollama.chat({
      model,
      messages: [{ role: "user", content: message }],
      stream: true,
    });
    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify({ content: chunk.message.content })}\n\n`);
    }
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    console.error("[chat.service.js] Error:", error.message);
    res.write(`data: ${JSON.stringify({ error: error.message || "聊天服务异常" })}\n\n`);
    res.end();
  }
}

module.exports = { streamChat };