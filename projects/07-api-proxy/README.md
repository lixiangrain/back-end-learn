# API Proxy 服务接口文档

## 1. 用户认证接口

### 1.1 注册接口
```bash
# 请求示例
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'

# 响应示例
{
  "code": 201,
  "message": "注册成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 1.2 登录接口
```bash
# 请求示例
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'

# 响应示例
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## 2. 流式聊天接口
```bash
# 请求示例（需替换为实际token）
curl -N -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"model":"qwen2.5-coder:7b","message":"你好"}'

# 响应示例（流式）
data: {"content": "你好"}
data: {"content": "！"}
data: {"content": "有什么"}
data: {"content": "我可以"}
data: {"content": "帮忙"}
data: {"content": "的"}
data: {"content": "吗"}
data: {"content": "？"}
data: {"done": true}
```

## 3. 模型列表接口
```bash
# 请求示例（需替换为实际token）
curl -X GET http://localhost:3000/api/chat/models \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 响应示例
{
  "code": 200,
  "message": "获取模型列表成功",
  "data": [
    {
      "name": "qwen2.5-coder:7b",
      "modified_at": "2025-07-31T12:22:41.006756127+08:00",
      "size": 4683087561
    },
    {
      "name": "llama3:8b",
      "modified_at": "2025-07-01T10:38:17.435899912+08:00",
      "size": 4661224676
    },
    {
      "name": "gemma3:latest",
      "modified_at": "2025-06-17T16:27:51.291583621+08:00",
      "size": 3338801804
    }
  ]
}
```

## 4. 错误响应示例
```json
{
  "code": 401,
  "message": "未提供认证令牌",
  "data": null
}
```

```json
{
  "code": 500,
  "message": "聊天服务异常",
  "data": null
}
```