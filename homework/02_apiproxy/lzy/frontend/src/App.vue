<template>
  <div>
    <h1>ApiProxy Demo</h1>
    <Register v-if="!token && !isLoggedIn" @login="switchToLogin" />
    <Login v-else-if="!isLoggedIn" @login-success="handleLogin" />
    <Chat v-else @logout="handleLogout" />
  </div>
</template>

<script>
import Register from "./components/Register.vue";
import Login from "./components/Login.vue";
import Chat from "./components/Chat.vue";

export default {
  name: "App",
  components: { Register, Login, Chat },
  data() {
    const token = localStorage.getItem("token") || null;
    console.log("[App.vue] Initialized, token:", token, "isLoggedIn:", !!token);
    return {
      token,
      isLoggedIn: !!token,
    };
  },
  watch: {
    isLoggedIn: {
      handler(newVal, oldVal) {
        console.log("[App.vue] isLoggedIn changed from", oldVal, "to", newVal);
      },
      immediate: true,
    },
    token: {
      handler(newVal, oldVal) {
        console.log("[App.vue] token changed from", oldVal, "to", newVal);
      },
      immediate: true,
    },
  },
  methods: {
    switchToLogin() {
      console.log("[App.vue] switchToLogin called, current state:", {
        token: this.token,
        isLoggedIn: this.isLoggedIn,
      });
      this.token = !null;
      this.isLoggedIn = false;
      console.log("[App.vue] State updated:", { token: this.token, isLoggedIn: this.isLoggedIn });
    },
    handleLogin(token) {
      console.log("[App.vue] handleLogin, token:", token);
      localStorage.setItem("token", token);
      this.token = token;
      this.isLoggedIn = true;
      console.log("[App.vue] Login state:", { token: this.token, isLoggedIn: this.isLoggedIn });
    },
    handleLogout() {
      console.log("[App.vue] handleLogout called");
      localStorage.removeItem("token");
      this.token = null;
      this.isLoggedIn = false;
      console.log("[App.vue] Logout state:", { token: this.token, isLoggedIn: this.isLoggedIn });
    },
  },
};
</script>
<style scoped>
/* 全局容器 */
div {
  max-width: 900px;
  margin: 60px auto;
  padding: 40px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  text-align: center;
  font-family: "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* 标题样式 */
h1 {
  font-size: 2rem;
  margin-bottom: 30px;
  font-weight: 600;
  color: #333;
  letter-spacing: 1px;
  text-align: center;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

/* 组件区域统一居中 */
Register, Login, Chat {
  display: block;
  margin-top: 20px;
}
</style>
