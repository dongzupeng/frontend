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
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">加载中...</p>
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
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">加载失败</h3>
        <p className="text-gray-600 mb-6">{error || '文章不存在'}</p>
        <button className="px-8 py-3 bg-gray-100 text-gray-800 rounded-full font-medium transition-all duration-300 hover:bg-gray-200 hover:shadow-md" onClick={() => navigate('/')}>返回列表</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{article.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span className="font-medium">作者：{article.author}</span>
          <span>发布时间：{new Date(article.createdAt).toLocaleString()}</span>
          <span className="flex items-center gap-1">阅读 {article.views}</span>
        </div>
      </div>
      {article.coverImage && (
        <div className="mb-8 rounded-lg overflow-hidden shadow-sm">
          <img src={article.coverImage} alt={article.title} className="w-full h-auto max-h-[400px] object-cover" />
        </div>
      )}
      <div className="mb-12 text-gray-700 leading-relaxed">
        <p>{article.content}</p>
      </div>
      <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap justify-center sm:justify-between">
        <button 
          className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all duration-300"
          onClick={() => navigate('/')}
        >
          ←
        </button>
        <div className="flex gap-4">
          <button 
            className={`relative w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-2xl hover:bg-gray-50 transition-all duration-300 ${isLiked ? 'text-primary' : 'text-gray-600'}`}
            onClick={handleLike}
            title={isLiked ? '取消点赞' : '点赞'}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className={`absolute top-1 right-1 min-w-5 h-5 px-1.5 rounded-full text-white text-xs font-semibold flex items-center justify-center ${isLiked ? 'bg-primary' : 'bg-gray-400'}`}>{article.likes}</span>
          </button>
          <button 
            className={`relative w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-2xl hover:bg-gray-50 transition-all duration-300 ${isFavorited ? 'text-yellow-500' : 'text-gray-600'}`}
            onClick={handleFavorite}
            title={isFavorited ? '取消收藏' : '收藏'}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill={isFavorited ? 'currentColor' : 'none'} xmlns="http://www.w3.org/2000/svg">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className={`absolute top-1 right-1 min-w-5 h-5 px-1.5 rounded-full text-white text-xs font-semibold flex items-center justify-center ${isFavorited ? 'bg-yellow-500' : 'bg-gray-400'}`}>{article.favorites}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
