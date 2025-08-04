import { useState, useEffect } from "react";
import { Button, Select, Spinner } from "./ui";
import { LogOut, Menu } from "lucide-react";
import { getModels } from "../services/chatService";
import Logo from "../../public/logo.png";

const Sidebar = ({
  user,
  onLogout,
  selectedModel,
  setSelectedModel,
  toggleSidebar,
}) => {
  const [models, setModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(true);

  // 获取模型列表
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setModelsLoading(true);
        const modelsData = await getModels();
        setModels(modelsData);

        // 如果有模型数据，设置默认选中的模型
        if (modelsData.length > 0 && !selectedModel) {
          setSelectedModel(modelsData[0].name);
        }
      } catch (err) {
        console.error("获取模型列表失败:", err);
      } finally {
        setModelsLoading(false);
      }
    };

    fetchModels();
  }, []);

  return (
    <>
      {/* 移动端侧边栏切换按钮 */}
      <div
        style={{
          position: "fixed",
          top: "16px",
          left: "16px",
          zIndex: 1000,
          display: "none",
        }}
      >
        <Button
          icon={<Menu size={16} />}
          onClick={toggleSidebar}
          type="primary"
        />
      </div>

      {/* 侧边栏 */}
      <div
        style={{
          width: "280px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          zIndex: 999,
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s ease",
          height: "100%",
        }}
      >
        {/* 侧边栏头部 */}
        <div
          style={{
            padding: "16px",
            borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: "700",
              color: "#007AFF",
            }}
          >
            Ollama Chat
          </h2>
          <p
            style={{
              margin: "8px 0 0 0",
              fontSize: "14px",
              color: "rgba(0, 0, 0, 0.6)",
            }}
          >
            本地模型对话
          </p>
        </div>

        {/* 用户信息 */}
        <div
          style={{
            padding: "16px",
            borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: "18px",
                marginRight: "12px",
                backgroundImage: `url(${Logo})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                backgroundPosition: "center",
              }}
            ></div>
            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "rgba(0, 0, 0, 0.85)",
                }}
              >
                {user?.username || "用户"}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "rgba(0, 0, 0, 0.45)",
                }}
              >
                {user?.username ? "在线" : "未登录"}
              </div>
            </div>
          </div>

          <Button
            icon={<LogOut size={16} />}
            onClick={onLogout}
            type="danger"
            style={{ width: "100%" }}
          >
            登出
          </Button>
        </div>

        {/* 模型选择 */}
        <div
          style={{
            padding: "16px",
            flex: 1,
          }}
        >
          <h3
            style={{
              margin: "0 0 16px 0",
              fontSize: "16px",
              fontWeight: "600",
              color: "rgba(0, 0, 0, 0.85)",
            }}
          >
            模型选择
          </h3>

          {modelsLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "16px",
              }}
            >
              <Spinner size="small" />
            </div>
          ) : (
            <div>
              <Select
                value={selectedModel}
                onChange={setSelectedModel}
                options={models.map((model) => ({
                  label: model.name,
                  value: model.name,
                }))}
              />
              <div
                style={{
                  marginTop: "16px",
                  fontSize: "12px",
                  color: "rgba(0, 0, 0, 0.45)",
                }}
              >
                <p style={{ margin: "0 0 8px 0" }}>
                  <strong>当前模型:</strong>
                </p>
                <p style={{ margin: 0 }}>{selectedModel}</p>
              </div>
            </div>
          )}
        </div>

        {/* 侧边栏底部 */}
        <div
          style={{
            padding: "16px",
            textAlign: "center",
            fontSize: "12px",
            color: "rgba(0, 0, 0, 0.45)",
            borderTop: "1px solid rgba(0, 0, 0, 0.06)",
          }}
        >
          Ollama Chat © {new Date().getFullYear()}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
