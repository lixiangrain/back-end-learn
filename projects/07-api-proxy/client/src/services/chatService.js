import api from './api';

/**
 * 获取模型列表
 * @returns {Promise<Array>} 模型列表
 */
export const getModels = async () => {
  try {
    const response = await api.get('/chat/models');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 发送聊天消息
 * @param {Object} messageData - 消息数据
 * @returns {Promise<Object>} 响应数据
 */
export const sendChatMessage = async (messageData) => {
  try {
    const response = await api.post('/chat', messageData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * 流式接收聊天响应（用于处理SSE）
 * @param {Object} messageData - 消息数据
 * @param {Function} onMessage - 接收消息回调
 * @param {Function} onDone - 完成回调
 * @returns {Promise} 可取消的流式请求
 */
export const streamChatResponse = async (messageData, onMessage, onDone) => {
  // 获取认证令牌
  const token = localStorage.getItem('auth-storage');
  let authToken = null;
  
  if (token) {
    try {
      const tokenData = JSON.parse(token);
      authToken = tokenData.state?.token;
    } catch (e) {
      console.error('解析令牌时出错:', e);
    }
  }
  
  // 创建 AbortController 用于取消请求
  const controller = new AbortController();
  
  try {
    // 发起流式请求
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken ? `Bearer ${authToken}` : ''
      },
      body: JSON.stringify(messageData),
      signal: controller.signal
    });
    
    // 检查响应是否成功
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // 获取响应体的 readable stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    
    // 读取流数据
    while (true) {
      const { done, value } = await reader.read();
      
      // 如果读取完成，结束循环
      if (done) {
        onDone && onDone();
        break;
      }
      
      // 解码数据
      const chunk = decoder.decode(value, { stream: true });
      
      // 处理服务端发送的事件数据
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            
            // 如果收到完成标识，则结束
            if (data.done) {
              onDone && onDone();
              break;
            } else {
              // 否则传递消息内容
              onMessage && onMessage(data.content);
            }
          } catch (error) {
            console.error('解析消息时出错:', error);
          }
        }
      }
    }
    
    // 关闭读取器
    reader.releaseLock();
    
    // 返回取消函数
    return () => controller.abort();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('请求已被取消');
    } else {
      console.error('流式请求失败:', error);
      throw error;
    }
  }
};