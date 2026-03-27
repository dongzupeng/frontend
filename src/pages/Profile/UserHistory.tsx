import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import type { Article } from '../../types/index';
import '../../styles/pages/user-pages.css';

interface HistoryItem {
  articleId: number;
  timestamp: string;
}

const UserHistory: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistoryArticles();
  }, []);

  const fetchHistoryArticles = async () => {
    try {
      setLoading(true);
      // 从后端API获取用户的浏览历史
      const history = await articleApi.getUserHistory(50);
      
      if (history.length === 0) {
        setArticles([]);
        setLoading(false);
        return;
      }

      // 提取文章数据，并添加浏览时间
      const historyArticles = history.map((item: any) => ({
        ...item.article,
        viewTime: item.createdAt
      }));
      
      setArticles(historyArticles);
    } catch (err) {
      setError('获取浏览历史失败');
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = (id: number) => {
    navigate(`/article/${id}`);
  };

  const handleClearHistory = async () => {
    if (window.confirm('确定要清空浏览历史吗？')) {
      try {
        await articleApi.clearHistory();
        setArticles([]);
      } catch (err) {
        alert('清空浏览历史失败');
      }
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // 小于1小时显示"X分钟前"
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000));
      return minutes < 1 ? '刚刚' : `${minutes}分钟前`;
    }
    
    // 小于24小时显示"X小时前"
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      return `${hours}小时前`;
    }
    
    // 小于7天显示"X天前"
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      return `${days}天前`;
    }
    
    // 否则显示具体日期
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="user-history-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-page-container">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/profile')}>
          ←
        </button>
        <h1>浏览历史</h1>
        {articles.length > 0 && (
          <button className="clear-btn" onClick={handleClearHistory}>
            清空
          </button>
        )}
        {articles.length === 0 && <div className="placeholder"></div>}
      </div>

      {error ? (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchHistoryArticles}>重试</button>
        </div>
      ) : articles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🕐</div>
          <p>还没有浏览记录</p>
          <button className="action-btn" onClick={() => navigate('/')}>
            去浏览文章
          </button>
        </div>
      ) : (
        <div className="articles-list">
          {articles.map((article: any) => (
            <div 
              key={article.id} 
              className="article-card"
              onClick={() => handleArticleClick(article.id)}
            >
              {article.coverImage && (
                <div className="article-image">
                  <img src={article.coverImage} alt={article.title} />
                </div>
              )}
              <div className="article-content">
                <h3 className="article-title">{article.title}</h3>
                <p className="article-excerpt">
                  {article.content.substring(0, 100)}...
                </p>
                <div className="article-meta">
                  <span className="article-author">{article.author}</span>
                  <span className="view-time">{formatTime(article.viewTime)}</span>
                </div>
                <div className="article-stats">
                  <span>👁 {article.views}</span>
                  <span>👍 {article.likes}</span>
                  <span>⭐ {article.favorites}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserHistory;
