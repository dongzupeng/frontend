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

  const handleMenuClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src="" alt="头像" />
        </div>
        <div className="profile-info">
          <h2>{isAuthenticated && user ? user.username : '未登录'}</h2>
          <p>{isAuthenticated && user ? '个人公众号' : '登录体验更多精彩'}</p>
        </div>
      </div>
      
      <div className="profile-stats">
        <div className="stat-item" onClick={handleMenuClick} style={{ cursor: !isAuthenticated ? 'pointer' : 'default' }}>
          <div className="stat-value">{isAuthenticated ? '268' : '-'}</div>
          <div className="stat-label">动态</div>
        </div>
        <div className="stat-item" onClick={handleMenuClick} style={{ cursor: !isAuthenticated ? 'pointer' : 'default' }}>
          <div className="stat-value">{isAuthenticated ? '38' : '-'}</div>
          <div className="stat-label">关注</div>
        </div>
        <div className="stat-item" onClick={handleMenuClick} style={{ cursor: !isAuthenticated ? 'pointer' : 'default' }}>
          <div className="stat-value">{isAuthenticated ? '1830' : '-'}</div>
          <div className="stat-label">粉丝</div>
        </div>
      </div>
      
      <div className="profile-actions">
        <div className="action-button green" onClick={handleMenuClick} style={{ cursor: !isAuthenticated ? 'pointer' : 'default' }}>
          <span className="action-icon">👥</span>
          <span className="action-label">我的活动</span>
        </div>
        <div className="action-button yellow" onClick={handleMenuClick} style={{ cursor: !isAuthenticated ? 'pointer' : 'default' }}>
          <span className="action-icon">👪</span>
          <span className="action-label">多人群聊</span>
        </div>
      </div>
      
      <div className="profile-menu">
        <div className="menu-item" onClick={handleMenuClick} style={{ cursor: !isAuthenticated ? 'pointer' : 'default' }}>
          <span className="menu-icon">📹</span>
          <span className="menu-label">我的视频</span>
        </div>
        <div className="menu-item" onClick={handleMenuClick} style={{ cursor: !isAuthenticated ? 'pointer' : 'default' }}>
          <span className="menu-icon">⭐</span>
          <span className="menu-label">我的收藏</span>
        </div>
        <div className="menu-item" onClick={handleMenuClick} style={{ cursor: !isAuthenticated ? 'pointer' : 'default' }}>
          <span className="menu-icon">💬</span>
          <span className="menu-label">我的话题</span>
        </div>
        <div className="menu-item" onClick={handleMenuClick} style={{ cursor: !isAuthenticated ? 'pointer' : 'default' }}>
          <span className="menu-icon">🕐</span>
          <span className="menu-label">浏览历史</span>
        </div>
      </div>
      
      {isAuthenticated && (
        <button className="logout-button" onClick={handleLogout}>
          退出登录
        </button>
      )}
      
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