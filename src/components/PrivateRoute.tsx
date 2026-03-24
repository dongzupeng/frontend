import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NotLoggedIn from './NotLoggedIn';

const PrivateRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // 可以添加一个加载状态的组件
    return <div>加载中...</div>;
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <NotLoggedIn from={location} />
  );
};

export default PrivateRoute;