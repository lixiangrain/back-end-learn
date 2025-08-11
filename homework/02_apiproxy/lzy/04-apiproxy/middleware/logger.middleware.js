function requestLogger() {
  return (req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${
          res.statusCode
        } - ${duration}ms`
      );
      console.log("客户端IP:", req.ip);
      console.log("请求参数:", req.method === "POST" ? req.body : req.query);
    });
    next();
  };
}

module.exports = { requestLogger };