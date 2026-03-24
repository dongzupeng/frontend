import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface TabBarProps {
  isAuthenticated: boolean;
}

const TabBar: React.FC<TabBarProps> = ({ isAuthenticated }) => {
  const location = useLocation();
  
  const getTabClass = (path: string) => {
    return location.pathname === path ? 'tab-item active' : 'tab-item';
  };

  return (
    <div className="tab-bar">
      <Link to="/" className={getTabClass('/')}>
        <span className="tab-icon">🏠</span>
        <span className="tab-label">首页</span>
      </Link>
      <Link to="/create" className="tab-item create-tab">
        <span className="create-icon">+</span>
      </Link>
      <Link to="/profile" className={getTabClass('/profile')}>
        <span className="tab-icon">👤</span>
        <span className="tab-label">我的</span>
      </Link>
    </div>
  );
};

export default TabBar;