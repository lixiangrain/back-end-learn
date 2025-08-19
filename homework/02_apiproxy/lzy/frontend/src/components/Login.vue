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
/* 整体容器居中 */
div {
  max-width: 400px;
  margin: 80px auto;
  padding: 40px 30px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
}

/* 标题样式 */
h2 {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #333;
  font-weight: 600;
}

/* 表单布局 */
form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 输入框样式 */
input {
  padding: 12px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease-in-out;
}

input:focus {
  border-color: #4CAF50;
  outline: none;
  box-shadow: 0 0 6px rgba(76, 175, 80, 0.3);
}

/* 按钮样式 */
button {
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: background 0.3s, transform 0.2s;
}

button:hover {
  background-color: #43a047;
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

/* 错误信息 */
.error-message {
  color: #d32f2f;
  margin-top: 15px;
  font-size: 14px;
  font-weight: 500;
}
</style>
