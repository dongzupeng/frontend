import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import type { Article } from '../../types/index';
import '../../styles/pages/user-pages.css';

const UserArticles: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserArticles();
  }, []);

  const fetchUserArticles = async () => {
    try {
      setLoading(true);
      // 获取所有文章，然后筛选出当前用户的文章
      const allArticles = await articleApi.getAll();
      const userArticles = allArticles.filter(article => article.author === user?.username);
      setArticles(userArticles);
    } catch (err) {
      setError('获取文章失败');
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = (id: number) => {
    navigate(`/article/${id}`);
  };

  const handleEdit = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    navigate(`/edit/${id}`);
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这篇文章吗？')) {
      try {
        await articleApi.delete(id);
        setArticles(articles.filter(article => article.id !== id));
      } catch (err) {
        alert('删除失败');
      }
    }
  };

  if (loading) {
    return (
      <div className="user-articles-container">
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
        <h1>我的文章</h1>
        <div className="placeholder"></div>
      </div>

      {error ? (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchUserArticles}>重试</button>
        </div>
      ) : articles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <p>还没有发布文章</p>
          <button className="action-btn" onClick={() => navigate('/create')}>
            去写文章
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
                  <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                  <div className="article-stats">
                    <span>👁 {article.views}</span>
                    <span>👍 {article.likes}</span>
                    <span>⭐ {article.favorites}</span>
                  </div>
                </div>
              </div>
              <div className="article-actions">
                <button 
                  className="edit-btn"
                  onClick={(e) => handleEdit(e, article.id)}
                >
                  编辑
                </button>
                <button 
                  className="delete-btn"
                  onClick={(e) => handleDelete(e, article.id)}
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserArticles;
