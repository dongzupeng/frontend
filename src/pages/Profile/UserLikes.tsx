import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleApi } from '../../services/api';
import ConfirmDialog from '../../components/ConfirmDialog';
import type { Article } from '../../types/index';

const UserLikes: React.FC = () => {

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

  const handleRemoveLike = (e: React.MouseEvent, articleId: number) => {
    e.stopPropagation();
    setConfirmDialog({
      isOpen: true,
      articleId: articleId,
    });
  };

  const confirmRemoveLike = async () => {
    if (confirmDialog.articleId) {
      try {
        // 使用API取消点赞
        await articleApi.toggleLike(confirmDialog.articleId);
        
        // 更新界面
        setArticles(articles.filter(article => article.id !== confirmDialog.articleId));
      } catch (err) {
        if ((window as any).toast) {
          (window as any).toast.error('取消点赞失败');
        }
      } finally {
        setConfirmDialog({
          isOpen: false,
          articleId: null,
        });
      }
    }
  };

  const cancelRemoveLike = () => {
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
        <h1 className="text-lg font-semibold text-gray-800">我的点赞</h1>
        <div className="w-10"></div>
      </div>

      <main className="flex-1 p-4">
        {error ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              className="px-6 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all duration-300"
              onClick={fetchLikedArticles}
            >
              重试
            </button>
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-4xl mb-4">👍</div>
            <p className="text-gray-600 mb-6">还没有点赞文章</p>
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
              <div 
                key={article.id} 
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                onClick={() => handleArticleClick(article.id)}
              >
                {article.coverImage && (
                  <div className="w-full h-48 overflow-hidden">
                    <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {article.content.substring(0, 100)}...
                  </p>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
                    <span className="font-medium">{article.author}</span>
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-3 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">👁 {article.views}</span>
                    <span className="flex items-center gap-1">👍 {article.likes}</span>
                    <span className="flex items-center gap-1">⭐ {article.favorites}</span>
                  </div>
                  <button 
                    className="w-full px-3 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-all duration-300 text-sm"
                    onClick={(e) => handleRemoveLike(e, article.id)}
                  >
                    取消点赞
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="确认取消点赞"
        message="确定要取消点赞这篇文章吗？"
        onConfirm={confirmRemoveLike}
        onCancel={cancelRemoveLike}
      />
    </div>
  );
};

export default UserLikes;
