import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../services/api';
import type { User } from '../types/index';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserInfo: (userData: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初始化时检查本地存储中的token和用户信息
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = localStorage.getItem('user');
          if (userData) {
            setUser(JSON.parse(userData));
          } else {
            // 如果有token但没有用户信息，尝试从服务器获取
            try {
              const response = await authApi.getCurrentUser();
              setUser(response);
              localStorage.setItem('user', JSON.stringify(response));
            } catch (apiErr: any) {
              // 如果API调用失败（如401），清除token
              if (apiErr.response?.status === 401) {
                console.error('Token expired or invalid, clearing...');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
              } else {
                throw apiErr;
              }
            }
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        // 清除无效的token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.login({ username, password });
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    } catch (err: any) {
      setError(err.response?.data?.message || '登录失败');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // 调用后端退出接口
      await authApi.logout();
    } catch (err) {
      console.error('Logout API call failed:', err);
    } finally {
      // 无论接口调用成功与否，都清除本地存储
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const updateUserInfo = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      // 调用后端更新用户接口
      const updatedUser = await authApi.updateUserInfo(userData);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err: any) {
      setError(err.response?.data?.message || '更新个人资料失败');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateUserInfo,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};