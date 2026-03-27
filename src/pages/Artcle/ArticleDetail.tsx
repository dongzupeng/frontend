import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articleApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import type { Article } from '../../types/index';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) {
        setError('文章ID不存在');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await articleApi.getOne(parseInt(id));
        setArticle(data);
        
        // 增加阅读量
        try {
          await articleApi.incrementViews(parseInt(id));
        } catch (err) {
          console.error('增加阅读量失败:', err);
        }
        
        // 记录浏览历史
        if (user) {
          try {
            await articleApi.addHistory(parseInt(id));
          } catch (err) {
            console.error('记录浏览历史失败:', err);
          }
        }
        
        // 从后端获取点赞和收藏状态
        if (user) {
          try {
            const likeStatus = await articleApi.checkLike(parseInt(id));
            const favoriteStatus = await articleApi.checkFavorite(parseInt(id));
            setIsLiked(likeStatus.isLiked);
            setIsFavorited(favoriteStatus.isFavorited);
          } catch (err) {
            console.error('获取点赞收藏状态失败:', err);
          }
        }
      } catch (err) {
        setError('加载文章失败');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, user]);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    );
  }

  // 处理点赞
  const handleLike = async () => {
    if (!id || !user) return;
    
    try {
      const updatedArticle = await articleApi.toggleLike(parseInt(id));
      setArticle(updatedArticle);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('操作失败:', err);
    }
  };

  // 处理收藏
  const handleFavorite = async () => {
    if (!id || !user) return;
    
    try {
      const updatedArticle = await articleApi.toggleFavorite(parseInt(id));
      setArticle(updatedArticle);
      setIsFavorited(!isFavorited);
    } catch (err) {
      console.error('操作失败:', err);
    }
  };

  if (error || !article) {
    return (
      <div className="empty-state">
        <div className="empty-icon">⚠️</div>
        <h3>加载失败</h3>
        <p>{error || '文章不存在'}</p>
        <button className="retry-button" onClick={() => navigate('/')}>返回列表</button>
      </div>
    );
  }

  return (
    <div className="article-detail">
      <div className="article-header">
        <h1 className="article-title">{article.title}</h1>
        <div className="article-meta">
          <span className="article-author">作者：{article.author}</span>
          <span className="article-date">发布时间：{new Date(article.createdAt).toLocaleString()}</span>
          <span className="article-views">阅读 {article.views}</span>
        </div>
      </div>
      {article.coverImage && (
        <div className="article-cover">
          <img src={article.coverImage || undefined} alt={article.title} />
        </div>
      )}
      <div className="article-content">
        <p>{article.content}</p>
      </div>
      <div className="article-actions">
        <button onClick={() => navigate('/')}>
          ←
        </button>
        <div className="action-buttons-container">
          <button 
            className={`action-button like-button ${isLiked ? 'active' : ''}`}
            onClick={handleLike}
            title={isLiked ? '取消点赞' : '点赞'}
          >
            {isLiked ? '👍' : '👍'}
            <span className="action-count">{article.likes}</span>
          </button>
          <button 
            className={`action-button favorite-button ${isFavorited ? 'active' : ''}`}
            onClick={handleFavorite}
            title={isFavorited ? '取消收藏' : '收藏'}
          >
            {isFavorited ? '⭐' : '☆'}
            <span className="action-count">{article.favorites}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
