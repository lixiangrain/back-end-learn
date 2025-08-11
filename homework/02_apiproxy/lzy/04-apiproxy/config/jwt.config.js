module.exports = {
  secretKey: process.env.JWT_SECRET || "your_jwt_secret_key", // 生产环境从环境变量获取
};