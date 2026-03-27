import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import type { Article } from '../../types/index';
import '../../styles/pages/user-pages.css';

const UserLikes: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLikedArticles();
  }, []);

  const fetchLikedArticles = async () => {
    try {
      setLoading(true);
      // 从后端API获取用户的点赞列表
      const likes = await articleApi.getUserLikes();
      
      if (likes.length === 0) {
        setArticles([]);
        setLoading(false);
        return;
      }

      // 提取文章数据
      const likedArticles = likes.map((like: any) => like.article);
      setArticles(likedArticles);
    } catch (err) {
      setError('获取点赞失败');
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = (id: number) => {
    navigate(`/article/${id}`);
  };

  const handleRemoveLike = async (e: React.MouseEvent, articleId: number) => {
    e.stopPropagation();
    try {
      // 使用API取消点赞
      await articleApi.toggleLike(articleId);
      
      // 更新界面
      setArticles(articles.filter(article => article.id !== articleId));
    } catch (err) {
      alert('取消点赞失败');
    }
  };

  if (loading) {
    return (
      <div className="user-likes-container">
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
        <h1>我的点赞</h1>
        <div className="placeholder"></div>
      </div>

      {error ? (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchLikedArticles}>重试</button>
        </div>
      ) : articles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👍</div>
          <p>还没有点赞文章</p>
          <button className="action-btn" onClick={() => navigate('/')}>
            去浏览文章
          </button>
        </div>
      ) : (
        <div className="articles-list">
          {articles.map(article => (
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
                  <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="article-stats">
                  <span>👁 {article.views}</span>
                  <span>👍 {article.likes}</span>
                  <span>⭐ {article.favorites}</span>
                </div>
              </div>
              <button 
                className="remove-like-btn"
                onClick={(e) => handleRemoveLike(e, article.id)}
              >
                取消点赞
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserLikes;
