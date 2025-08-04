import { useState } from "react";
import { Button, Input, Card } from "../components/ui";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import useAuthStore from "../store/authStore";
import { loginUser, registerUser } from "../services/authService";
import Logo from "../../public/logo.png"

const Login = () => {
  // 表单类型状态（登录/注册）
  const [activeTab, setActiveTab] = useState("login");
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 表单数据
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    repassword: "", // 确认密码字段
  });
  
  // 密码可见性状态
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [repasswordVisible, setRepasswordVisible] = useState(false);

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
        login(response.data.user, response.data.token);
      } else {
        // 注册逻辑 - 验证密码确认
        if (formData.password !== formData.repassword) {
          alert("两次输入的密码不一致");
          setLoading(false);
          return;
        }
        
        // 执行注册
        const response = await registerUser(formData);
        // 注册成功后自动登录
        login(response.data.user, response.data.token);
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      {/* 左右布局容器 */}
      <div
        style={{
          display: "flex",
          maxWidth: "900px",
          width: "100%",
          backgroundColor: "white",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* 左侧 Logo 区域 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px",
            color: "white",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "150px",
              height: "150px",
              marginBottom: "20px",
            }}
          >
            <img 
              src={Logo} 
              alt="Logo" 
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "700",
              marginBottom: "10px",
            }}
          >
            Ollama Chat
          </h1>
          <p
            style={{
              color: "#333",
              fontSize: "18px",
              opacity: "0.9",
            }}
          >
            与AI模型进行本地对话
          </p>
        </div>

        {/* 右侧表单区域 */}
        <div
          style={{
            flex: 1,
            padding: "50px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#333",
                marginBottom: "8px",
              }}
            >
              {activeTab === "login" ? "欢迎回来" : "创建账户"}
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "rgba(0, 0, 0, 0.6)",
              }}
            >
              {activeTab === "login" ? "请登录您的账户" : "请输入您的账户信息"}
            </p>
          </div>

          <Card style={{ border: "none", boxShadow: "none" }}>
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
                  prefix={<User size={16} />}
                  placeholder="用户名"
                  required
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <Input
                  name="password"
                  type={passwordVisible ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  prefix={<Lock size={16} />}
                  suffix={
                    formData.password ? (
                      passwordVisible ? (
                        <EyeOff size={16} onClick={() => setPasswordVisible(false)} style={{ cursor: "pointer" }} />
                      ) : (
                        <Eye size={16} onClick={() => setPasswordVisible(true)} style={{ cursor: "pointer" }} />
                      )
                    ) : null
                  }
                  placeholder="密码"
                  required
                />
              </div>

              {activeTab === "register" && (
                <div style={{ marginBottom: "24px" }}>
                  <Input
                    name="repassword"
                    type={repasswordVisible ? "text" : "password"}
                    value={formData.repassword}
                    onChange={handleChange}
                    prefix={<Lock size={16} />}
                    suffix={
                      formData.repassword ? (
                        repasswordVisible ? (
                          <EyeOff size={16} onClick={() => setRepasswordVisible(false)} style={{ cursor: "pointer" }} />
                        ) : (
                          <Eye size={16} onClick={() => setRepasswordVisible(true)} style={{ cursor: "pointer" }} />
                        )
                      ) : null
                    }
                    placeholder="确认密码"
                    required
                  />
                </div>
              )}

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
    </div>
  );
};

export default Login;