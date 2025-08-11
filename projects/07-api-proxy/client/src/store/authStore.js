import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 创建认证状态存储
const useAuthStore = create(
  persist(
    (set, get) => ({
      // 用户信息和认证状态
      user: null,
      token: null,
      isAuthenticated: false,
      
      // 登录方法
      login: (userData, token) => set({
        user: userData,
        token: token,
        isAuthenticated: true
      }),
      
      // 登出方法
      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false
      }),
      
      // 获取当前用户信息
      getUser: () => get().user,
      
      // 获取认证令牌
      getToken: () => get().token,
      
      // 检查是否已认证
      getIsAuthenticated: () => get().isAuthenticated,
    }),
    {
      name: 'auth-storage', // 存储在本地存储中的键名
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }), // 指定需要持久化的状态
    }
  )
);

export default useAuthStore;