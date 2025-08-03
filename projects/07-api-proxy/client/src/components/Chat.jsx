import { useState, useRef, useEffect } from "react";
import { Alert } from "./ui";
import useAuthStore from "../store/authStore";
import { getModels, streamChatResponse } from "../services/chatService";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const Chat = () => {
  // 聊天消息状态
  const [messages, setMessages] = useState([]);
  // 输入的消息
  const [inputMessage, setInputMessage] = useState("");
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 模型列表
  const [models, setModels] = useState([]);
  // 选中的模型
  const [selectedModel, setSelectedModel] = useState("qwen2.5-coder:7b");
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
        setError("获取模型列表失败: " + (err.message || "未知错误"));
        console.error("获取模型列表失败:", err);
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
        sender: "user",
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputMessage("");
      setLoading(true);

      // 准备请求数据
      const requestData = {
        model: selectedModel,
        message: inputMessage,
      };

      // 使用流式请求发送消息
      abortRef.current = await streamChatResponse(
        requestData,
        (content) => {
          // 更新AI消息内容
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastIndex = newMessages.length - 1;
            const lastMessage = newMessages[lastIndex];

            // 如果最后一条消息是AI消息，则更新它
            if (lastMessage && lastMessage.sender === "ai") {
              newMessages[lastIndex] = {
                ...lastMessage,
                text: lastMessage.text + content,
              };
            } else {
              // 否则创建新的AI消息
              newMessages.push({
                id: Date.now(),
                text: content,
                sender: "ai",
                timestamp: new Date().toLocaleTimeString(),
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
      console.error("发送消息时出错:", error);
      setError("发送消息失败: " + (error.message || "未知错误"));
      setLoading(false);
    }
  };

  // 处理回车键发送消息
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      {/* 头部区域 */}
      <ChatHeader
        user={user}
        models={models}
        modelsLoading={modelsLoading}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        onLogout={handleLogout}
      />

      {/* 错误提示 */}
      {error && (
        <Alert message={error} type="error" onClose={() => setError(null)} />
      )}

      {/* 消息显示区域 */}
      <ChatMessages messages={messages} messagesEndRef={messagesEndRef} />

      {/* 输入区域 */}
      <ChatInput
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        handleKeyPress={handleKeyPress}
        sendMessage={sendMessage}
        loading={loading}
        disabled={!inputMessage.trim() || loading}
      />
    </div>
  );
};

export default Chat;
