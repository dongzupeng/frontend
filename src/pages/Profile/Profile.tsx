import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmDialog from '../../components/ConfirmDialog';

const Profile: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate('/login');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="profile-container">
        <div className="profile-not-logged-in">
          <h2>请先登录</h2>
          <p>登录后查看个人信息</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src="" alt="头像" />
        </div>
        <div className="profile-info">
          <h2>{user.username}</h2>
          <p>个人公众号</p>
        </div>
      </div>
      
      <div className="profile-stats">
        <div className="stat-item">
          <div className="stat-value">268</div>
          <div className="stat-label">动态</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">38</div>
          <div className="stat-label">关注</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">1830</div>
          <div className="stat-label">粉丝</div>
        </div>
      </div>
      
      <div className="profile-actions">
        <div className="action-button green">
          <span className="action-icon">👥</span>
          <span className="action-label">我的活动</span>
        </div>
        <div className="action-button yellow">
          <span className="action-icon">👪</span>
          <span className="action-label">多人群聊</span>
        </div>
      </div>
      
      <div className="profile-menu">
        <div className="menu-item">
          <span className="menu-icon">📹</span>
          <span className="menu-label">我的视频</span>
        </div>
        <div className="menu-item">
          <span className="menu-icon">⭐</span>
          <span className="menu-label">我的收藏</span>
        </div>
        <div className="menu-item">
          <span className="menu-icon">💬</span>
          <span className="menu-label">我的话题</span>
        </div>
        <div className="menu-item">
          <span className="menu-icon">🕐</span>
          <span className="menu-label">浏览历史</span>
        </div>
      </div>
      
      <button className="logout-button" onClick={handleLogout}>
        退出登录
      </button>
      
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="确认退出"
        message="确定要退出登录吗？"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </div>
  );
};

export default Profile;