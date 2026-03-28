import React from 'react';
import { Link } from 'react-router-dom';
import type { Location } from 'react-router-dom';

interface NotLoggedInProps {
  from?: Location;
}

const NotLoggedIn: React.FC<NotLoggedInProps> = ({ from }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="w-32 h-32 mb-8 flex items-center justify-center rounded-full bg-primary/10">
        {/* 用户锁定图标 */}
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 20c0-3 3-5 8-5s8 2 8 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="14" y="13" width="6" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M17 13v-1.5a1.5 1.5 0 0 1 3 0V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <p className="text-lg text-gray-800 mb-8 text-center">
        登录后才能进行操作哦
      </p>
      <Link
        to="/login"
        state={{ from }}
        className="px-8 py-3 bg-primary/10 text-primary rounded-lg font-medium transition-all duration-300 hover:bg-primary/20"
      >
        登录/注册
      </Link>
    </div>
  );
};

export default NotLoggedIn;