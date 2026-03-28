import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Upload from '../../components/Upload';

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
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <button 
          className="w-10 h-10 rounded-full flex items-center justify-center mb-10"
          onClick={() => navigate('/profile')}
        >
          ←
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">修改个人资料</h1>
        <p className="text-gray-500 mb-10">鱼塘博客，文化传承新力量</p>
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 p-3 bg-green-50 text-green-600 rounded-lg flex items-center gap-2">
            <span>✅</span>
            <span>{success}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="mb-2 text-sm text-gray-500">头像</div>
            <Upload
              value={avatar}
              onChange={setAvatar}
              placeholder="请输入头像 URL 或上传图片"
            />
          </div>
          <div className="mb-6">
            <div className="mb-2 text-sm text-gray-500">用户名</div>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-600 bg-transparent placeholder-gray-400"
            />
          </div>
          <div className="mb-6">
            <div className="mb-2 text-sm text-gray-500">个人简介</div>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="请输入个人简介"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical text-gray-600 bg-transparent placeholder-gray-400"
            />
          </div>

          <div className="flex gap-4 justify-end mt-10">
            <button 
              type="button" 
              className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg font-medium transition-all duration-300 hover:bg-gray-200"
              onClick={() => navigate('/profile')}
            >
              取消
            </button>
            <button 
              type="submit" 
              className="px-6 py-3 bg-primary/10 text-primary rounded-lg font-medium transition-all duration-300 hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? '处理中...' : '更新资料'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;