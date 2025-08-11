<template>
  <div>
    <h2>登录</h2>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="用户名" required />
      <input v-model="password" type="password" placeholder="密码" required />
      <button type="submit">登录</button>
    </form>
    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<script>
export default {
  emits: ['login-success'],
  data() {
    return {
      username: "",
      password: "",
      error: "",
    };
  },
  methods: {
    async login() {
      try {
        console.log('尝试登录:', { username: this.username });
        
        const response = await fetch("http://localhost:3000/api/auth/login", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ 
            username: this.username, 
            password: this.password 
          }),
        });

        console.log('服务器响应状态:', response.status);
        const result = await response.json();
        console.log('服务器返回数据:', result);

        if (response.ok) {
          if (result.data && result.data.token) {
            console.log('登录成功，获取到token');
            this.$emit("login-success", result.data.token);
          } else {
            this.error = "服务器响应格式错误";
          }
        } else {
          this.error = result.message || "登录失败";
        }
      } catch (error) {
        console.error('登录错误:', error);
        this.error = "登录失败: " + (error.message || '未知错误');
      }
    },
  },
};
</script>

<style scoped>
.error-message {
  color: red;
  margin-top: 10px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 300px;
  margin: 0 auto;
}

input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 8px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>