const { Ollama } = require('ollama');

/**
 * 获取可用模型列表
 * @returns {Promise<Array>} 模型列表
 */
async function listModels() {
  try {
    console.log('正在获取模型列表...');
    
    // 创建 Ollama 客户端
    const ollama = new Ollama();
    
    // 获取模型列表
    const response = await ollama.list();
    
    console.log('成功获取模型列表:', response.models.length, '个模型');
    
    // 提取模型名称
    const models = response.models.map(model => ({
      name: model.name,
      modified_at: model.modified_at,
      size: model.size
    }));
    
    return models;
  } catch (error) {
    console.error('获取模型列表时发生错误:', error);
    throw new Error('无法获取模型列表: ' + (error.message || '未知错误'));
  }
}

/**
 * 流式聊天服务
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
async function streamChat(req, res) {
  try {
    console.log('开始处理聊天请求...');
    
    // 设置 SSE 头部信息
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    
    // 获取请求数据
    const { model, message } = req.body;
    
    console.log('接收到聊天请求:', { model, message });
    
    // 检查必要参数
    if (!message) {
      console.warn('缺少必要参数: message');
      if (!res.headersSent) {
        res.status(400).json({
          code: 400,
          message: '缺少必要参数: message',
          data: null
        });
      } else {
        res.end();
      }
      return;
    }
    
    // 创建 Ollama 客户端
    const ollama = new Ollama();
    
    // 使用默认模型（如果未提供或提供的模型不合法）
    const modelName = model && model !== 'qwen' ? model : 'qwen2.5-coder:7b';
    
    console.log('使用模型:', modelName);
    
    // 从 Ollama 获取流式响应
    console.log('正在调用 Ollama 服务...');
    const response = await ollama.chat({
      model: modelName,
      messages: [{ role: 'user', content: message }],
      stream: true
    });
    
    console.log('Ollama 服务调用成功，开始处理流式响应');
    
    // 处理流式响应
    for await (const chunk of response) {
      // 发送部分响应给客户端
      res.write(`data: ${JSON.stringify({ content: chunk.message.content })}\n\n`);
    }
    
    // 发送完成消息
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
    
    console.log('聊天响应完成');
  } catch (error) {
    console.error('聊天服务发生错误:', error);
    console.error('错误堆栈:', error.stack);
    
    // 只有在头部未发送的情况下才发送错误响应
    if (!res.headersSent) {
      res.status(500).json({
        code: 500,
        message: '聊天服务异常: ' + (error.message || '未知错误'),
        data: null
      });
    } else {
      res.end();
    }
    
    throw error;
  }
}

module.exports = {
  listModels,
  streamChat
};