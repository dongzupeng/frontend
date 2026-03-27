import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmDialog from '../../components/ConfirmDialog';
import type { Article } from '../../types/index';

const UserArticles: React.FC = () => {
  const { user } = useAuth();
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

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setConfirmDialog({
      isOpen: true,
      articleId: id,
    });
  };

  const confirmDelete = async () => {
    if (confirmDialog.articleId) {
      try {
        await articleApi.delete(confirmDialog.articleId);
        setArticles(articles.filter(article => article.id !== confirmDialog.articleId));
      } catch (err) {
        alert('删除失败');
      } finally {
        setConfirmDialog({
          isOpen: false,
          articleId: null,
        });
      }
    }
  };

  const cancelDelete = () => {
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
        <h1 className="text-lg font-semibold text-gray-800">我的文章</h1>
        <div className="w-10"></div>
      </div>

      <main className="flex-1 p-4">
        {error ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              className="px-6 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all duration-300"
              onClick={fetchUserArticles}
            >
              重试
            </button>
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-4xl mb-4">📝</div>
            <p className="text-gray-600 mb-6">还没有发布文章</p>
            <button 
              className="px-8 py-3 bg-primary/10 text-primary rounded-lg font-medium transition-all duration-300 hover:bg-primary/20"
              onClick={() => navigate('/create')}
            >
              去写文章
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
                  <div className="flex flex-wrap justify-between items-center text-sm text-gray-500 mb-4">
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    <div className="flex gap-3">
                      <span className="flex items-center gap-1">👁 {article.views}</span>
                      <span className="flex items-center gap-1">👍 {article.likes}</span>
                      <span className="flex items-center gap-1">⭐ {article.favorites}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="flex-1 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all duration-300 text-sm"
                      onClick={(e) => handleEdit(e, article.id)}
                    >
                      编辑
                    </button>
                    <button 
                      className="flex-1 px-3 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-all duration-300 text-sm"
                      onClick={(e) => handleDelete(e, article.id)}
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="确认删除"
        message="确定要删除这篇文章吗？"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default UserArticles;
