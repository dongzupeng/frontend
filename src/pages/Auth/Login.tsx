import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 从location.state中获取之前尝试访问的页面
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      // 登录成功后重定向回之前的页面
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto px-6 py-12">
        <button 
          className="w-10 h-10 rounded-full flex items-center justify-center mb-10"
          onClick={() => navigate('/')}
        >
          ←
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">立即登录</h1>
        <p className="text-gray-500 mb-10">鱼塘博客，文化传承新力量</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="mb-2 text-sm text-gray-500">用户名/电子邮件</div>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-600 bg-transparent placeholder-gray-400"
            />
          </div>
          <div className="mb-6">
            <div className="mb-2 text-sm text-gray-500">密码</div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入您的密码"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-600 bg-transparent placeholder-gray-400"
            />
          </div>
          <div className="mb-10 text-right">
            <a href="#" className="text-sm text-primary hover:underline">忘记密码？</a>
          </div>
          <button 
            type="submit" 
            className="w-full py-3 bg-primary/10 text-primary rounded-lg font-medium transition-all duration-300 hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? '登录中...' : '登录'}
          </button>
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-500">没有账户？</span>
            <a href="/register" className="text-sm text-primary hover:underline ml-1">注册</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;