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