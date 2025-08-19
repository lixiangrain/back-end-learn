```vue
<!-- frontend/src/components/Chat.vue -->
<template>
  <div class="chat-container">
    <h2>聊天</h2>
    <button @click="$emit('logout')" class="logout-btn">退出</button>
    <form @submit.prevent="sendMessage" class="chat-form">
      <select v-model="model" required>
        <option value="qwen:latest">Qwen (Latest)</option>
        <option value="llama3:latest">Llama3 (Latest)</option>
        <option value="gemma:latest">Gemma (Latest)</option>
        <option value="mistral:latest">Mistral (Latest)</option>
      </select>
      <input v-model="message" placeholder="输入消息" required />
      <button type="submit">发送</button>
    </form>
    <div class="messages-box">
      <div v-for="(msg, index) in messages" 
           :key="index" 
           :class="['message', getMessageClass(msg)]">
        <template v-if="msg.startsWith('Error:')">
          <span class="error-text">{{ msg }}</span>
        </template>
        <template v-else>
          <span class="message-prefix">{{ msg.split(':')[0] }}:</span>
          <span class="message-content">{{ msg.split(':').slice(1).join(':') }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Chat",
  data() {
    return {
      model: "qwen:latest", // 与 <select> 选项一致
      message: "",
      messages: [], // 存储所有对话记录
    };
  },
  methods: {
    getMessageClass(msg) {
      if (msg.startsWith('Error:')) return 'error';
      if (msg.startsWith('AI:')) return 'ai';
      if (msg.startsWith('You:')) return 'user';
      return '';
    },
    async sendMessage() {
      console.log("[Chat.vue] Sending message with model:", this.model, "message:", this.message);
      if (!this.message) {
        this.messages.push("Error: 消息不能为空");
        console.log("[Chat.vue] Validation failed: empty message");
        return;
      }
      try {
        // 添加用户消息
        this.messages.push(`You: ${this.message}`);
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ model: this.model, message: this.message }),
        });

        if (!response.ok) {
          console.error("[Chat.vue] Response error, status:", response.status);
          let errorText;
          try {
            const errorData = await response.json();
            errorText = errorData.message || `HTTP ${response.status}`;
          } catch {
            errorText = `HTTP ${response.status}`;
            if (response.status === 404) {
              errorText = "聊天服务端点不存在 (HTTP 404)";
            } else if (response.status === 401) {
              errorText = "未授权，请重新登录 (HTTP 401)";
            }
          }
          this.messages.push(`Error: ${errorText}`);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let aiResponse = "";

        // 添加空的 AI 消息占位
        const aiMessageIndex = this.messages.length;
        this.messages.push("AI: ");

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log("[Chat.vue] Stream complete");
            if (aiResponse) {
              this.messages[aiMessageIndex] = `AI: ${aiResponse}`;
            } else {
              this.messages[aiMessageIndex] = "AI: [无响应]";
            }
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || ""; // 保存未处理的残余数据

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                console.log("[Chat.vue] Received data:", data);

                if (data && data.content) {
                  aiResponse += data.content;
                  this.messages[aiMessageIndex] = `AI: ${aiResponse}`; // 实时更新 AI 消息
                }

                if (data.done) {
                  console.log("[Chat.vue] Stream done");
                  break;
                }

                if (data.error) {
                  console.error("[Chat.vue] Server error:", data.error);
                  this.messages.push(`Error: ${data.error}`);
                  break;
                }
              } catch (error) {
                console.error("[Chat.vue] JSON parse error:", error);
                this.messages.push("Error: 响应格式错误");
              }
            }
          }
        }
      } catch (error) {
        console.error("[Chat.vue] Fetch error:", error);
        this.messages.push(`Error: 与服务器连接失败 - ${error.message}`);
      }
      this.message = "";
    },
  },
};
</script>

<style scoped>
.chat-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 12px;
  color: #333;
  font-weight: 600;
}

.logout-btn {
  align-self: flex-end;
  background: #f44336;
  margin-bottom: 20px;
  transition: background 0.3s;
}
.logout-btn:hover {
  background: #d32f2f;
}

.chat-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
}

select, input, button {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease-in-out;
}

select:focus, input:focus {
  border-color: #4CAF50;
  outline: none;
  box-shadow: 0 0 4px rgba(76, 175, 80, 0.4);
}

input {
  flex: 1;
}

button {
  background: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 500;
}
button:hover {
  background: #43a047;
}

.messages-box {
  flex: 1;
  height: 400px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 15px;
  background: #fafafa;
  box-shadow: inset 0 1px 4px rgba(0,0,0,0.05);
  scroll-behavior: smooth;
}

/* 美化滚动条 */
.messages-box::-webkit-scrollbar {
  width: 8px;
}
.messages-box::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}
.messages-box::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}

.message {
  margin: 10px 0;
  padding: 12px 14px;
  border-radius: 12px;
  line-height: 1.5;
  max-width: 70%;
  word-wrap: break-word;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.message.user {
  background: #e3f2fd;
  margin-left: auto;
  border: 1px solid #bbdefb;
}

.message.ai {
  background: #f5f5f5;
  margin-right: auto;
  border: 1px solid #e0e0e0;
}

.message.error {
  background: #ffebee;
  border: 1px solid #ef9a9a;
}

.message-prefix {
  font-weight: 600;
  margin-right: 8px;
  color: #333;
}

.error-text {
  color: #d32f2f;
  font-weight: 500;
}
</style>
```