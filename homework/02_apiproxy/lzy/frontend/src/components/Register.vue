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