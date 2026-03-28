import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface TabBarProps {
  isAuthenticated: boolean;
}

const TabBar: React.FC<TabBarProps> = () => {
  const location = useLocation();
  
  const getTabClass = (path: string) => {
    return location.pathname === path 
      ? 'flex flex-col items-center gap-1 text-primary transition-all duration-300 flex-1' 
      : 'flex flex-col items-center gap-1 text-gray-500 transition-all duration-300 flex-1';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-around items-center bg-white py-2 shadow-[0_-1px_3px_rgba(0,0,0,0.1)] z-50">
      <Link to="/" className={getTabClass('/')}>
        <div className="w-6 h-6 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-xs">首页</span>
      </Link>
      <Link to="/following" className={getTabClass('/following')}>
        <div className="w-6 h-6 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-xs">关注</span>
      </Link>
      <Link to="/create" className="relative flex-1">
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold shadow-[0_2px_8px_rgba(96,165,250,0.3)] transition-all duration-300 hover:scale-110 hover:shadow-[0_4px_12px_rgba(96,165,250,0.4)]">+</div>
        </div>
      </Link>
      <Link to="/messages" className={getTabClass('/messages')}>
        <div className="w-6 h-6 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-xs">消息</span>
      </Link>
      <Link to="/profile" className={getTabClass('/profile')}>
        <div className="w-6 h-6 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-xs">我的</span>
      </Link>
    </div>
  );
};

export default TabBar;