import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../../services/api';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(true);

  // 保存之前的位置，以便登录后重定向
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authApi.register({ username, password, email });
      // 注册成功后跳转到登录页面，并传递之前的位置
      navigate('/login', { state: { from } });
    } catch (err: any) {
      setError(err.response?.data?.message || '注册失败，请检查输入信息');
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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">立即注册</h1>
        <p className="text-gray-500 mb-10">鱼塘博客，文化传承新力量</p>
        {error && <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="mb-2 text-sm text-gray-500">用户名</div>
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
            <div className="mb-2 text-sm text-gray-500">电子邮件</div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <div className="mb-10 flex items-start">
            <input
              type="checkbox"
              id="agreement"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              required
              className="mt-1 mr-2"
            />
            <label htmlFor="agreement" className="text-sm text-gray-600">
              已阅读并同意《服务协议》和《隐私政策》
            </label>
          </div>
          <button 
            type="submit" 
            className="w-full py-3 bg-primary/10 text-primary rounded-lg font-medium transition-all duration-300 hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !agreed}
          >
            {loading ? '注册中...' : '注册'}
          </button>
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-500">已有账户？</span>
            <a href="/login" className="text-sm text-primary hover:underline ml-1">登录</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;