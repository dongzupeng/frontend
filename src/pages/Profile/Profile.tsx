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

  const handleMenuClick = (menu: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    switch (menu) {
      case 'profile':
        navigate('/profile/edit');
        break;
      case 'articles':
        navigate('/profile/articles');
        break;
      case 'favorites':
        navigate('/profile/favorites');
        break;
      case 'likes':
        navigate('/profile/likes');
        break;
      case 'history':
        navigate('/profile/history');
        break;
      case 'drafts':
        navigate('/profile/drafts');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-gray-500 mb-10">鱼塘博客，文化传承新力量</p>
        
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4">
            {isAuthenticated && user ? (
              user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt="头像" 
                  className="w-24 h-24 rounded-full object-cover cursor-pointer hover:shadow-md transition-all duration-300"
                  onClick={() => handleMenuClick('profile')}
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-all duration-300"
                  onClick={() => handleMenuClick('profile')}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-xs text-gray-600 mt-2">上传头像</span>
                </div>
              )
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-1">{isAuthenticated && user ? user.username : '未登录'}</h2>
            <p className="text-gray-600">{isAuthenticated && user ? user.bio : '登录体验更多精彩'}</p>
          </div>
        </div>
        
        <div className="flex justify-around mb-8 py-4 border-t border-b border-gray-200">
          <div className="text-center" onClick={() => handleMenuClick('activities')} style={{ cursor: !isAuthenticated ? 'pointer' : 'default' }}>
            <div className="text-2xl font-bold text-gray-800 mb-1">{isAuthenticated ? '268' : '-'}</div>
            <div className="text-xs text-gray-600">动态</div>
          </div>
          <div className="text-center" onClick={() => handleMenuClick('following')} style={{ cursor: !isAuthenticated ? 'pointer' : 'default' }}>
            <div className="text-2xl font-bold text-gray-800 mb-1">{isAuthenticated ? '38' : '-'}</div>
            <div className="text-xs text-gray-600">关注</div>
          </div>
          <div className="text-center" onClick={() => handleMenuClick('followers')} style={{ cursor: !isAuthenticated ? 'pointer' : 'default' }}>
            <div className="text-2xl font-bold text-gray-800 mb-1">{isAuthenticated ? '1830' : '-'}</div>
            <div className="text-xs text-gray-600">粉丝</div>
          </div>
        </div>
        
        <div className="space-y-2 mb-10">
          <div 
            className="flex items-center gap-4 p-4 bg-white rounded-lg hover:bg-gray-50 transition-all duration-300 cursor-pointer"
            onClick={() => handleMenuClick('profile')}
            style={{ cursor: !isAuthenticated ? 'pointer' : 'default' }}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-gray-800">个人资料</span>
          </div>
          <div 
            className="flex items-center gap-4 p-4 bg-white rounded-lg hover:bg-gray-50 transition-all duration-300 cursor-pointer"
            onClick={() => handleMenuClick('articles')}
            style={{ cursor: !isAuthenticated ? 'pointer' : 'default' }}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="10 9 9 9 8 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-gray-800">我的文章</span>
          </div>
          <div 
            className="flex items-center gap-4 p-4 bg-white rounded-lg hover:bg-gray-50 transition-all duration-300 cursor-pointer"
            onClick={() => handleMenuClick('favorites')}
            style={{ cursor: !isAuthenticated ? 'pointer' : 'default' }}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-gray-800">我的收藏</span>
          </div>
          <div 
            className="flex items-center gap-4 p-4 bg-white rounded-lg hover:bg-gray-50 transition-all duration-300 cursor-pointer"
            onClick={() => handleMenuClick('likes')}
            style={{ cursor: !isAuthenticated ? 'pointer' : 'default' }}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-gray-800">我的点赞</span>
          </div>
          <div 
            className="flex items-center gap-4 p-4 bg-white rounded-lg hover:bg-gray-50 transition-all duration-300 cursor-pointer"
            onClick={() => handleMenuClick('history')}
            style={{ cursor: !isAuthenticated ? 'pointer' : 'default' }}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-gray-800">浏览历史</span>
          </div>
          <div
            className="flex items-center gap-4 p-4 bg-white rounded-lg hover:bg-gray-50 transition-all duration-300 cursor-pointer"
            onClick={() => handleMenuClick('drafts')}
            style={{ cursor: !isAuthenticated ? 'pointer' : 'default' }}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-gray-800">我的草稿</span>
          </div>
        </div>
        
        {isAuthenticated && (
          <button 
            className="w-full py-3 bg-primary/10 text-primary rounded-lg font-medium transition-all duration-300 hover:bg-primary/20 mb-20"
            onClick={handleLogout}
          >
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
    </div>
  );
};

export default Profile;