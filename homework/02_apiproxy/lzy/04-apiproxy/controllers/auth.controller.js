// controllers/auth.controller.js
const userService = require("../services/user.service");

exports.register = async (req, res) => {
  try {
    console.log("[auth.controller.js] Register request:", req.body);
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ code: 400, message: "用户名和密码不能为空" });
    }
    const token = await userService.registerUser({ username, password });
    res.status(201).json({ code: 201, message: "注册成功", data: { token } });
  } catch (error) {
    console.error("[auth.controller.js] Register error:", error.message);
    res.status(400).json({ code: 400, message: error.message || "注册失败" });
  }
};