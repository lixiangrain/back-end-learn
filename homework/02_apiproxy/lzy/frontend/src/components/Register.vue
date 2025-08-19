<template>
  <div>
    <h2>注册</h2>
    <form @submit.prevent="register">
      <input v-model="username" placeholder="用户名" required />
      <input v-model="password" type="password" placeholder="密码" required />
      <button type="submit">注册</button>
      <button type="button" @click="$emit('login')">已有账号？登录</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
      error: "",
    };
  },
  methods: {
    async register() {
      try {
        const response = await fetch("http://localhost:3000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: this.username, password: this.password }),
        });
        const result = await response.json();
        if (response.ok) {
          this.$emit("login");
        } else {
          this.error = result.message;
        }
      } catch (error) {
        this.error = "注册失败";
      }
    },
  },
};
</script>
<style scoped>
/* 整体容器 */
div {
  max-width: 400px;
  margin: 80px auto;
  padding: 40px 30px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
}

/* 标题 */
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

/* 主按钮：注册 */
button[type="submit"] {
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

button[type="submit"]:hover {
  background-color: #43a047;
  transform: translateY(-1px);
}

button[type="submit"]:active {
  transform: translateY(0);
}

/* 次按钮：已有账号？登录 */
button[type="button"] {
  padding: 12px;
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: background 0.3s, transform 0.2s;
}

button[type="button"]:hover {
  background-color: #e0e0e0;
  transform: translateY(-1px);
}

button[type="button"]:active {
  transform: translateY(0);
}

/* 错误信息 */
p {
  color: #d32f2f;
  margin-top: 15px;
  font-size: 14px;
  font-weight: 500;
}
</style>
