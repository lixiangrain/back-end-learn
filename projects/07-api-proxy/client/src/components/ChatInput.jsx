import { Input, Button } from "./ui";
import { Send } from "lucide-react";

const ChatInput = ({
  inputMessage,
  setInputMessage,
  handleKeyPress,
  sendMessage,
  loading,
  disabled,
}) => {
  const containerStyle = {
    display: "flex",
    gap: "10px",
    padding: "12px",
    background: "#fff",
    borderRadius: "18px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    maxWidth: "80%",
    margin: "0 auto",
  };

  const inputContainerStyle = {
    flex: 1,
    minWidth: "200px",
  };

  const inputStyle = {
    width: "100%",
  };

  const buttonStyle = {
    flexShrink: 0,
  };

  return (
    <div style={containerStyle}>
      <div style={inputContainerStyle}>
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入消息..."
          style={inputStyle}
          disabled={loading}
          aria-label="输入消息"
        />
      </div>
      <Button
        type="primary"
        icon={<Send size={16} />}
        onClick={sendMessage}
        loading={loading}
        disabled={disabled}
        style={buttonStyle}
        aria-label="发送消息"
      >
        发送
      </Button>
    </div>
  );
};

export default ChatInput;
