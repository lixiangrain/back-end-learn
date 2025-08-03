import { useState } from "react";
import { Button, Input, Card } from "./ui";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import useAuthStore from "../store/authStore";
import { loginUser, registerUser } from "../services/authService";

const Login = () => {
  // 表单类型状态（登录/注册）
  const [activeTab, setActiveTab] = useState("login");
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 表单数据
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // 从 Zustand store 中获取登录方法
  const login = useAuthStore((state) => state.login);

  // 处理表单输入变化
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeTab === "login") {
        // 登录逻辑
        const response = await loginUser(formData);
        // 保存用户信息到 Zustand store
        login(response.data, response.data.token);
      } else {
        // 注册逻辑
        const response = await registerUser(formData);
        // 注册成功后自动登录
        login(response.data, response.data.token);
      }
    } catch (error) {
      // 处理错误
      alert(error.message || (activeTab === "login" ? "登录失败" : "注册失败"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "white",
              marginBottom: "8px",
            }}
          >
            Ollama Chat
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "rgba(255, 255, 255, 0.9)",
            }}
          >
            本地模型对话GUI
          </p>
        </div>

        <Card>
          {/* 标签切换 */}
          <div
            style={{
              display: "flex",
              marginBottom: "24px",
              background: "rgba(118, 118, 128, 0.12)",
              borderRadius: "12px",
              padding: "4px",
            }}
          >
            <button
              onClick={() => setActiveTab("login")}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                background: activeTab === "login" ? "white" : "transparent",
                color: activeTab === "login" ? "#007AFF" : "rgba(0, 0, 0, 0.6)",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              登录
            </button>
            <button
              onClick={() => setActiveTab("register")}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                background: activeTab === "register" ? "white" : "transparent",
                color:
                  activeTab === "register" ? "#007AFF" : "rgba(0, 0, 0, 0.6)",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              注册
            </button>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <Input
                name="username"
                value={formData.username}
                onChange={handleChange}
                prefix={<UserOutlined />}
                placeholder="用户名"
                required
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                prefix={<LockOutlined />}
                placeholder="密码"
                required
              />
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: "100%" }}
            >
              {activeTab === "login" ? "登录" : "注册"}
            </Button>
          </form>

          <div
            style={{
              textAlign: "center",
              marginTop: "24px",
              fontSize: "14px",
              color: "rgba(0, 0, 0, 0.5)",
            }}
          >
            {activeTab === "login"
              ? "还没有账户？请切换到注册标签"
              : "已有账户？请切换到登录标签"}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
