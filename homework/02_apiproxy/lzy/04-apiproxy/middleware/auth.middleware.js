const jwt = require("jsonwebtoken");
const config = require("../config/jwt.config");

function requireAuth() {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ code: 401, message: "未提供认证令牌" });
      }
      const decoded = jwt.verify(token, config.secretKey);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ code: 401, message: "无效的认证令牌" });
    }
  };
}

module.exports = { requireAuth };