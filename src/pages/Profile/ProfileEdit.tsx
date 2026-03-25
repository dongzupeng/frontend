import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Upload from '../../components/Upload';
import '../../styles/components/upload.css';

const ProfileEdit: React.FC = () => {
  const { user, updateUserInfo } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>(user?.username || '');
  const [avatar, setAvatar] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setAvatar(user.avatar || '');
      setBio(user.bio || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!username) {
      setError('请输入用户名');
      return;
    }

    try {
      setLoading(true);
      // 调用updateUser API
      await updateUserInfo({ username, avatar, bio });
      setSuccess('个人资料更新成功');
      // 1秒后返回个人页面
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || '更新个人资料失败');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="article-form">
      <h2>修改个人资料</h2>
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="success-message">
          <span className="success-icon">✅</span>
          <span>{success}</span>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="avatar">头像</label>
          <Upload
            value={avatar}
            onChange={setAvatar}
            placeholder="请输入头像 URL 或上传图片"
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">用户名</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="请输入用户名"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="bio">个人简介</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="请输入个人简介"
            rows={4}
          />
        </div>

        <div className="form-actions">
          <button type="button" className="action-button cancel-button" onClick={() => navigate('/profile')}>
            取消
          </button>
          <button type="submit" className="action-button submit-button" disabled={loading}>
            {loading ? '处理中...' : '更新资料'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;