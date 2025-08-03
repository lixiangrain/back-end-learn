import { Spinner, Select, Button } from "./ui";
import { LogoutOutlined } from "@ant-design/icons";

const ChatHeader = ({
  user,
  models,
  modelsLoading,
  selectedModel,
  setSelectedModel,
  onLogout,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        padding: "10px",
        background: "#fff",
        borderRadius: "18px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
      }}
    >
      <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>
        Ollama Chat
      </h3>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "200px" }}>
            {modelsLoading ? (
              <Spinner size="small" />
            ) : (
              <Select
                value={selectedModel}
                onChange={setSelectedModel}
                options={models.map((model) => ({
                  label: model.name,
                  value: model.name,
                }))}
              />
            )}
          </div>
        </div>
        <Button icon={<LogoutOutlined />} onClick={onLogout} type="danger">
          登出
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
