const cors = require("cors");

module.exports = cors({
  origin: "*", // 允许所有来源，生产环境需限制
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
});