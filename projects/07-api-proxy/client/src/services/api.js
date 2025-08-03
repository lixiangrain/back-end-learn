import axios from 'axios';

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // 后端 API 基础 URL
  timeout: 10000, // 请求超时时间
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从本地存储中获取认证令牌
    const token = localStorage.getItem('auth-storage');

    // 如果存在令牌，则添加到请求头中
    if (token) {
      const tokenData = JSON.parse(token);
      if (tokenData.state && tokenData.state.token) {
        config.headers.Authorization = `Bearer ${tokenData.state.token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    // 直接返回响应数据
    return response.data;
  },
  (error) => {
    // 统一处理错误响应
    if (error.response) {
      // 服务器返回错误状态码
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('Network Error:', error.request);
      return Promise.reject({
        code: 500,
        message: '网络错误，请检查您的连接'
      });
    } else {
      // 其他错误
      console.error('Error:', error.message);
      return Promise.reject({
        code: 500,
        message: '请求配置错误'
      });
    }
  }
);

export default api;