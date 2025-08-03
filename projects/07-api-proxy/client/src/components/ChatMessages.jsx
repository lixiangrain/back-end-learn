import { Card } from "./ui";
import MessageWithMarkdown from "./MessageWithMarkdown";

const ChatMessages = ({ messages, messagesEndRef }) => {
  return (
    <Card
      style={{
        flex: 1,
        overflow: "auto",
        marginBottom: "20px",
        background: "#f5f5f7",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: "flex",
              justifyContent:
                message.sender === "user" ? "flex-end" : "flex-start",
              marginBottom: "16px",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <div
              style={{
                maxWidth: "85%",
                alignSelf:
                  message.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              <MessageWithMarkdown
                content={message.text}
                sender={message.sender}
              />
              <div
                style={{
                  fontSize: "12px",
                  opacity: 0.7,
                  marginTop: "6px",
                  textAlign: message.sender === "user" ? "right" : "left",
                  color:
                    message.sender === "user"
                      ? "rgba(255, 255, 255, 0.8)"
                      : "rgba(0, 0, 0, 0.5)",
                }}
              >
                {message.timestamp}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </Card>
  );
};

export default ChatMessages;
