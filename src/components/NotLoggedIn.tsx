import React from 'react';
import { Link } from 'react-router-dom';
import type { Location } from 'react-router-dom';

interface NotLoggedInProps {
  from?: Location;
}

const NotLoggedIn: React.FC<NotLoggedInProps> = ({ from }) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: '#f5f7fa'
    }}>
      <div style={{
        width: '200px',
        height: '200px',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* 简单的SVG图标 */}
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 40L60 20L100 40V90C100 95.5228 95.5228 100 90 100H30C24.4772 100 20 95.5228 20 90V40Z" fill="#E6F7FF" stroke="#1890FF" strokeWidth="2"/>
          <path d="M30 50H90" stroke="#1890FF" strokeWidth="2"/>
          <path d="M30 60H80" stroke="#1890FF" strokeWidth="2"/>
          <path d="M30 70H70" stroke="#1890FF" strokeWidth="2"/>
        </svg>
      </div>
      <p style={{
        fontSize: '16px',
        color: '#333',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        登录后才能进行操作哦
      </p>
      <Link
        to="/login"
        state={{ from }}
        style={{
          padding: '0.75rem 2rem',
          backgroundColor: '#1890FF',
          color: 'white',
          borderRadius: '24px',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: '500',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#40A9FF';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#1890FF';
        }}
      >
        登录/注册
      </Link>
    </div>
  );
};

export default NotLoggedIn;