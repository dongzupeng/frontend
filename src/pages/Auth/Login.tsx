import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/pages/auth.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(true);

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
    <div className="auth-container">
      <div className="auth-bg"></div>
      <div className="auth-card">
        <div className="auth-tabs">
          <div className="auth-tab active">登录</div>
          <div className="auth-tab" onClick={() => navigate('/register')}>注册</div>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <div className="auth-input-with-icon">
              <span className="auth-input-icon">👤</span>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="账号"
                required
              />
            </div>
          </div>
          <div className="auth-form-group">
            <div className="auth-input-with-icon">
              <span className="auth-input-icon">🔒</span>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="密码"
                required
              />
            </div>
          </div>
          <div className="forgot-password">
            <a href="#">忘记密码</a>
          </div>
          <div className="auth-agreement">
            <input
              type="checkbox"
              id="agreement"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              required
            />
            <label htmlFor="agreement">
              已阅读并同意《服务协议》和《隐私政策》
            </label>
          </div>
          <button type="submit" className="auth-button" disabled={loading || !agreed}>
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;