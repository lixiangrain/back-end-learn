<!-- frontend/src/components/Chat.vue -->
<template>
  <div class="chat-container">
    <h2>聊天</h2>
    <button @click="$emit('logout')" class="logout-btn">退出</button>
    <form @submit.prevent="sendMessage" class="chat-form">
      <select v-model="model" required>
        <option value="qwen">Qwen (默认)</option>
        <option value="llama3">Llama3</option>
        <option value="gemma">Gemma</option>
        <option value="mistral">Mistral</option>
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
      model: "qwen",
      message: "",
      messages: [],
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
            }
          }
          this.messages.push(`Error: ${errorText}`);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        
        let buffer = "";
        // let aiResponse = "12";

        while (true) {
          const { done, value } = await reader.read();
          buffer += decoder.decode(value, { stream: false });
          const lines = buffer.split("\n\n");
          buffer = lines.pop();
          // const jsonData = JSON.parse(buffer);
          if (done) {
            console.log("[Chat.vue] Stream complete");
            this.messages[this.messages.length - 1] = `AI: ${buffer}`;
            break;
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
  margin: 0 auto;
  padding: 20px;
}

.chat-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.messages-box {
  height: 400px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background: #f9f9f9;
}

.message {
  margin: 8px 0;
  padding: 10px;
  border-radius: 6px;
}

.message.user {
  background: #e3f2fd;
  margin-left: 20px;
}

.message.ai {
  background: #f5f5f5;
  margin-right: 20px;
}

.message.error {
  background: #ffebee;
}

.message-prefix {
  font-weight: bold;
  margin-right: 8px;
}

.error-text {
  color: #d32f2f;
}

select, input, button {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

input {
  flex: 1;
}

button {
  background: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

.logout-btn {
  background: #f44336;
  margin-bottom: 16px;
}
</style>