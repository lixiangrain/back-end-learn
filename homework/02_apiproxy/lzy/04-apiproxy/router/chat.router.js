// router/chat.router.js
const express = require("express");
const router = express.Router();
const chatService = require("../service/chat.service");
const { requireAuth } = require("../middleware/auth.middleware");

router.post("/", requireAuth(), async (req, res) => {
  try {
    console.log("[chat.router.js] Chat request:", req.body);
    await chatService.streamChat(req, res);
  } catch (error) {
    console.error("[chat.router.js] Chat error:", error.message);
    res.status(500).json({ code: 500, message: `聊天服务异常: ${error.message}` });
  }
});

module.exports = router;