import { useState, useRef, useEffect } from "react";
import { Button, Alert } from "../components/ui";
import { AlignLeft, AlignRight } from "lucide-react";
import useAuthStore from "../store/authStore";
import { streamChatResponse } from "../services/chatService";
import ChatMessages from "../components/ChatMessages";
import ChatInput from "../components/ChatInput";
import Sidebar from "../components/Sidebar";

const Chat = () => {
  // 聊天消息状态
  const [messages, setMessages] = useState([]);
  // 输入的消息
  const [inputMessage, setInputMessage] = useState("");
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 选中的模型
  const [selectedModel, setSelectedModel] = useState("");
  // 错误信息
  const [error, setError] = useState(null);
  // 侧边栏状态
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  // 切换侧边栏
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
        height: "100vh",
        maxWidth: "100vw",
        margin: 0,
        padding: 0,
      }}
    >
      {/* 侧边栏 */}
      <div
        style={{
          display: isSidebarOpen ? "flex" : "none",
          position: window.innerWidth <= 768 ? "fixed" : "relative",
          height: "100%",
          zIndex: 1000,
          left: isSidebarOpen ? 0 : "-280px",
        }}
      >
        <Sidebar
          user={user}
          onLogout={handleLogout}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      </div>

      {/* 主内容区域 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        {/* 移动端菜单按钮 */}
        <div
          style={{
            padding: "16px",
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
            background: "#fff",
          }}
        >
          <Button
            icon={
              isSidebarOpen ? <AlignLeft size={16} /> : <AlignRight size={16} />
            }
            size="small"
            onClick={toggleSidebar}
            type="primary"
          />
          <h3
            style={{
              margin: 0,
              marginLeft: "12px",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            Ollama Chat
          </h3>
        </div>

        {/* 错误提示 */}
        {error && (
          <div style={{ padding: "0 16px" }}>
            <Alert
              message={error}
              type="error"
              onClose={() => setError(null)}
            />
          </div>
        )}

        {/* 消息显示区域 */}
        <div style={{ flex: 1, padding: "0 10%", overflow: "hidden" }}>
          <ChatMessages messages={messages} messagesEndRef={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div style={{ padding: "16px" }}>
          <ChatInput
            loading={loading}
            inputMessage={inputMessage}
            disabled={!inputMessage.trim() || loading}
            setInputMessage={setInputMessage}
            handleKeyPress={handleKeyPress}
            sendMessage={sendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
