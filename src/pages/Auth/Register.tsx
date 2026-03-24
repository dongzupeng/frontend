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
    <div className="auth-container">
      <div className="auth-bg"></div>
      <div className="auth-card">
        <div className="auth-tabs">
          <div className="auth-tab" onClick={() => navigate('/login')}>登录</div>
          <div className="auth-tab active">注册</div>
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
              <span className="auth-input-icon">📧</span>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="邮箱"
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
            {loading ? '注册中...' : '注册'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;