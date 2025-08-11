// router/auth.router.js
const express = require("express");
const router = express.Router();
const userService = require("../service/user.service");

router.post("/register", async (req, res) => {
  try {
    console.log("[auth.router.js] Register request:", req.body.username);
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ code: 400, message: "用户名或密码不能为空" });
    }
    const token = await userService.registerUser({ username, password });
    res.status(201).json({ code: 201, message: "注册成功", data: { token } });
  } catch (error) {
    console.error("[auth.router.js] Register error:", error.message);
    res.status(500).json({ code: 500, message: "注册服务异常" });
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log("[auth.router.js] Login request:", req.body.username);
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ code: 400, message: "用户名或密码不能为空" });
    }
    const token = await userService.loginUser({ username, password });
    if (!token) {
      return res.status(401).json({ code: 401, message: "用户名或密码错误" });
    }
    res.status(200).json({ code: 200, message: "登录成功", data: { token } });
  } catch (error) {
    console.error("[auth.router.js] Login error:", error.message);
    res.status(500).json({ code: 500, message: "登录服务异常" });
  }
});

module.exports = router;