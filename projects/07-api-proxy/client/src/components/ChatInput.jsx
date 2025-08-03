import { Input, Button } from "./ui";
import { SendOutlined } from "@ant-design/icons";

const ChatInput = ({
  inputMessage,
  setInputMessage,
  handleKeyPress,
  sendMessage,
  loading,
  disabled,
}) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        padding: "16px",
        background: "#fff",
        borderRadius: "18px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div style={{ flex: 1 }}>
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入消息..."
          style={{ width: "100%" }}
          disabled={loading}
        />
      </div>
      <Button
        type="primary"
        icon={<SendOutlined />}
        onClick={sendMessage}
        loading={loading}
        disabled={disabled}
      >
        发送
      </Button>
    </div>
  );
};

export default ChatInput;
