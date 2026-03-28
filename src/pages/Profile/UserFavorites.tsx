import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleApi } from '../../services/api';
import ConfirmDialog from '../../components/ConfirmDialog';
import ArticleCard from '../../components/ArticleCard';
import type { Article } from '../../types/index';

const UserFavorites: React.FC = () => {

  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    articleId: number | null;
  }>({
    isOpen: false,
    articleId: null,
  });

  useEffect(() => {
    fetchFavoriteArticles();
  }, []);

  const fetchFavoriteArticles = async () => {
    try {
      setLoading(true);
      // 从后端API获取用户的收藏列表
      const favorites = await articleApi.getUserFavorites();
      
      if (favorites.length === 0) {
        setArticles([]);
        setLoading(false);
        return;
      }

      // 提取文章数据
      const favoriteArticles = favorites.map((favorite: any) => favorite.article);
      setArticles(favoriteArticles);
    } catch (err) {
      setError('获取收藏失败');
    } finally {
      setLoading(false);
    }
  };

  const confirmRemoveFavorite = async () => {
    if (confirmDialog.articleId) {
      try {
        // 使用API取消收藏
        await articleApi.toggleFavorite(confirmDialog.articleId);
        
        // 更新界面
        setArticles(articles.filter(article => article.id !== confirmDialog.articleId));
      } catch (err) {
        if ((window as any).toast) {
          (window as any).toast.error('取消收藏失败');
        }
      } finally {
        setConfirmDialog({
          isOpen: false,
          articleId: null,
        });
      }
    }
  };

  const cancelRemoveFavorite = () => {
    setConfirmDialog({
      isOpen: false,
      articleId: null,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex items-center justify-center py-16">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-4 bg-white border-b border-gray-200">
        <button 
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300"
          onClick={() => navigate('/profile')}
        >
          ←
        </button>
        <h1 className="text-lg font-semibold text-gray-800">我的收藏</h1>
        <div className="w-10"></div>
      </div>

      <main className="flex-1 p-4">
        {error ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              className="px-6 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all duration-300"
              onClick={fetchFavoriteArticles}
            >
              重试
            </button>
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-4xl mb-4">⭐</div>
            <p className="text-gray-600 mb-6">还没有收藏文章</p>
            <button 
              className="px-8 py-3 bg-primary/10 text-primary rounded-lg font-medium transition-all duration-300 hover:bg-primary/20"
              onClick={() => navigate('/')}
            >
              去浏览文章
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.map(article => (
              <ArticleCard
                key={article.id}
                article={article}
                onRemoveFavorite={(id) => setConfirmDialog({
                  isOpen: true,
                  articleId: id,
                })}
                showActions={true}
              />
            ))}
          </div>
        )}
      </main>
      
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="确认取消收藏"
        message="确定要取消收藏这篇文章吗？"
        onConfirm={confirmRemoveFavorite}
        onCancel={cancelRemoveFavorite}
      />
    </div>
  );
};

export default UserFavorites;
