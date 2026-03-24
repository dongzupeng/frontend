import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articleApi } from '../../services/api';
import type { Article } from '../../types/index';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
          await articleApi.update(parseInt(id), { views: (data.views || 0) + 1 } as any);
        } catch (err) {
          console.error('增加阅读量失败:', err);
        }
      } catch (err) {
        setError('加载文章失败');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    );
  }

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
        <button className="action-button back-button" onClick={() => navigate('/')}>
          返回列表
        </button>
      </div>
    </div>
  );
};

export default ArticleDetail;
