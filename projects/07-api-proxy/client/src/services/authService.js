import api from './api';

// 用户注册
export const registerUser = async (userData) => {
  try {
    // 发送注册请求到后端
    const response = await api.post('/auth/register', userData);
    
    // 返回响应数据
    return response;
  } catch (error) {
    // 抛出错误供调用方处理
    throw error;
  }
};

// 用户登录
export const loginUser = async (credentials) => {
  try {
    // 发送登录请求到后端
    const response = await api.post('/auth/login', credentials);
    
    // 返回响应数据
    return response;
  } catch (error) {
    // 抛出错误供调用方处理
    throw error;
  }
};

// 用户登出
export const logoutUser = () => {
  // 登出逻辑将在组件中通过 zustand 状态管理处理
  // 这里可以添加额外的清理逻辑（如清除本地缓存等）
  console.log('User logged out');
};