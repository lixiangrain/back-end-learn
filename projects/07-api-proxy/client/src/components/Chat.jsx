import { useState, useRef, useEffect } from 'react';
import { Button, Input, Card, Select, Spinner, Alert, Message } from './ui';
import { SendOutlined, LogoutOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import useAuthStore from '../store/authStore';
import { getModels, streamChatResponse } from '../services/chatService';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Chat = () => {
  // 聊天消息状态
  const [messages, setMessages] = useState([]);
  // 输入的消息
  const [inputMessage, setInputMessage] = useState('');
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 模型列表
  const [models, setModels] = useState([]);
  // 选中的模型
  const [selectedModel, setSelectedModel] = useState('qwen2.5-coder:7b');
  // 模型加载状态
  const [modelsLoading, setModelsLoading] = useState(true);
  // 错误信息
  const [error, setError] = useState(null);
  
  // 取消请求的函数
  const abortRef = useRef(null);
  
  // 获取用户信息和登出方法
  const { user, logout } = useAuthStore();
  
  // 消息列表引用，用于自动滚动到底部
  const messagesEndRef = useRef(null);
  
  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // 当消息变化时自动滚动
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // 获取模型列表
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setModelsLoading(true);
        const modelsData = await getModels();
        setModels(modelsData);
        
        // 如果有模型数据，设置默认选中的模型
        if (modelsData.length > 0) {
          setSelectedModel(modelsData[0].name);
        }
      } catch (err) {
        setError('获取模型列表失败: ' + (err.message || '未知错误'));
        console.error('获取模型列表失败:', err);
      } finally {
        setModelsLoading(false);
      }
    };
    
    fetchModels();
  }, []);
  
  // 组件卸载时取消请求
  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current();
      }
    };
  }, []);
  
  // 处理登出
  const handleLogout = () => {
    logout();
  };
  
  // 发送消息
  const sendMessage = async () => {
    // 如果输入为空或正在加载，则不处理
    if (!inputMessage.trim() || loading) return;
    
    try {
      // 清除之前的错误
      setError(null);
      
      // 添加用户消息到聊天记录
      const userMessage = {
        id: Date.now(),
        text: inputMessage,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
      setLoading(true);
      
      // 准备请求数据
      const requestData = {
        model: selectedModel,
        message: inputMessage
      };
      
      // 使用流式请求发送消息
      abortRef.current = await streamChatResponse(
        requestData,
        (content) => {
          // 更新AI消息内容
          setMessages(prev => {
            const newMessages = [...prev];
            const lastIndex = newMessages.length - 1;
            const lastMessage = newMessages[lastIndex];
            
            // 如果最后一条消息是AI消息，则更新它
            if (lastMessage && lastMessage.sender === 'ai') {
              newMessages[lastIndex] = {
                ...lastMessage,
                text: lastMessage.text + content
              };
            } else {
              // 否则创建新的AI消息
              newMessages.push({
                id: Date.now(),
                text: content,
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString()
              });
            }
            
            return newMessages;
          });
        },
        () => {
          // 完成回调
          setLoading(false);
        }
      );
      
    } catch (error) {
      console.error('发送消息时出错:', error);
      setError('发送消息失败: ' + (error.message || '未知错误'));
      setLoading(false);
    }
  };
  
  // 处理回车键发送消息
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  // 自定义Markdown组件
  const MarkdownComponents = {
    p: ({ node, ...props }) => <p style={{ margin: '0 0 10px 0' }} {...props} />,
    code: ({ node, inline, ...props }) => {
      if (inline) {
        return <code style={{ 
          background: 'rgba(118, 118, 128, 0.12)', 
          padding: '2px 4px', 
          borderRadius: '4px',
          fontSize: '14px'
        }} {...props} />;
      }
      return <code style={{ 
        display: 'block',
        background: 'rgba(118, 118, 128, 0.12)', 
        padding: '12px',
        borderRadius: '8px',
        fontSize: '14px',
        margin: '10px 0',
        whiteSpace: 'pre-wrap',
        overflowX: 'auto'
      }} {...props} />;
    },
    pre: ({ node, ...props }) => <pre style={{ 
      background: 'rgba(118, 118, 128, 0.12)', 
      padding: '12px',
      borderRadius: '8px',
      overflowX: 'auto',
      margin: '10px 0'
    }} {...props} />,
    ul: ({ node, ...props }) => <ul style={{ paddingLeft: '20px', margin: '0 0 10px 0' }} {...props} />,
    ol: ({ node, ...props }) => <ol style={{ paddingLeft: '20px', margin: '0 0 10px 0' }} {...props} />,
    li: ({ node, ...props }) => <li style={{ marginBottom: '4px' }} {...props} />,
    blockquote: ({ node, ...props }) => <blockquote style={{ 
      borderLeft: '3px solid #007AFF',
      paddingLeft: '16px',
      marginLeft: '0',
      color: 'rgba(0, 0, 0, 0.6)',
      margin: '10px 0'
    }} {...props} />,
    a: ({ node, ...props }) => <a style={{ color: '#007AFF' }} {...props} />,
    h1: ({ node, ...props }) => <h1 style={{ 
      fontSize: '24px', 
      fontWeight: '600', 
      margin: '16px 0 8px 0' 
    }} {...props} />,
    h2: ({ node, ...props }) => <h2 style={{ 
      fontSize: '20px', 
      fontWeight: '600', 
      margin: '16px 0 8px 0' 
    }} {...props} />,
    h3: ({ node, ...props }) => <h3 style={{ 
      fontSize: '18px', 
      fontWeight: '600', 
      margin: '16px 0 8px 0' 
    }} {...props} />,
    h4: ({ node, ...props }) => <h4 style={{ 
      fontSize: '16px', 
      fontWeight: '600', 
      margin: '16px 0 8px 0' 
    }} {...props} />,
    h5: ({ node, ...props }) => <h5 style={{ 
      fontSize: '14px', 
      fontWeight: '600', 
      margin: '16px 0 8px 0' 
    }} {...props} />,
    h6: ({ node, ...props }) => <h6 style={{ 
      fontSize: '12px', 
      fontWeight: '600', 
      margin: '16px 0 8px 0' 
    }} {...props} />
  };
  
  // 自定义消息组件，支持Markdown渲染
  const MessageWithMarkdown = ({ content, sender }) => {
    const isUser = sender === 'user';
    
    return (
      <div style={{
        padding: '12px 16px',
        borderRadius: '18px',
        position: 'relative',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        background: isUser 
          ? 'linear-gradient(135deg, #007AFF, #0A84FF)' 
          : '#f5f5f7',
        color: isUser ? 'white' : '#000',
        border: isUser 
          ? 'none' 
          : '1px solid rgba(0, 0, 0, 0.05)',
        maxWidth: '85%'
      }}>
        <Markdown 
          remarkPlugins={[remarkGfm]} 
          components={MarkdownComponents}
        >
          {content}
        </Markdown>
      </div>
    );
  };
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    }}>
      {/* 头部区域 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        padding: '16px',
        background: '#fff',
        borderRadius: '18px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
      }}>
        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>AI 聊天助手</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.7)' }}>
              {user?.username ? `欢迎, ${user.username}` : '欢迎'}
            </span>
            <div style={{ width: '200px' }}>
              {modelsLoading ? (
                <Spinner size="small" />
              ) : (
                <Select
                  value={selectedModel}
                  onChange={setSelectedModel}
                  options={models.map(model => ({
                    label: model.name,
                    value: model.name
                  }))}
                />
              )}
            </div>
          </div>
          <Button 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
            type="danger"
          >
            登出
          </Button>
        </div>
      </div>
      
      {/* 错误提示 */}
      {error && (
        <Alert 
          message={error} 
          type="error" 
          onClose={() => setError(null)}
        />
      )}
      
      {/* 消息显示区域 */}
      <Card style={{ 
        flex: 1, 
        overflow: 'auto', 
        marginBottom: '20px',
        background: '#f5f5f7',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          flex: 1
        }}>
          {messages.map((message) => (
            <div 
              key={message.id}
              style={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '16px',
                animation: 'fadeIn 0.3s ease'
              }}
            >
              <div style={{ 
                maxWidth: '85%',
                alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <MessageWithMarkdown 
                  content={message.text} 
                  sender={message.sender} 
                />
                <div style={{ 
                  fontSize: '12px', 
                  opacity: 0.7,
                  marginTop: '6px',
                  textAlign: message.sender === 'user' ? 'right' : 'left',
                  color: message.sender === 'user' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.5)'
                }}>
                  {message.timestamp}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </Card>
      
      {/* 输入区域 */}
      <div style={{ 
        display: 'flex', 
        gap: '10px',
        padding: '16px',
        background: '#fff',
        borderRadius: '18px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ flex: 1 }}>
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入消息..."
            style={{ width: '100%' }}
            disabled={loading}
          />
        </div>
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={sendMessage}
          loading={loading}
          disabled={!inputMessage.trim() || loading}
        >
          发送
        </Button>
      </div>
    </div>
  );
};

export default Chat;