import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleApi } from '../../services/api';
import ConfirmDialog from '../../components/ConfirmDialog';
import ArticleCard from '../../components/ArticleCard';
import type { Article } from '../../types/index';

const UserHistory: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
  }>({
    isOpen: false,
  });

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

  const handleClearHistory = () => {
    setConfirmDialog({
      isOpen: true,
    });
  };

  const confirmClearHistory = async () => {
    try {
      await articleApi.clearHistory();
      setArticles([]);
    } catch (err) {
      if ((window as any).toast) {
        (window as any).toast.error('清空浏览历史失败');
      }
    } finally {
      setConfirmDialog({
        isOpen: false,
      });
    }
  };

  const cancelClearHistory = () => {
    setConfirmDialog({
      isOpen: false,
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
        <h1 className="text-lg font-semibold text-gray-800">浏览历史</h1>
        {articles.length > 0 ? (
          <button 
            className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-all duration-300"
            onClick={handleClearHistory}
          >
            清空
          </button>
        ) : (
          <div className="w-10"></div>
        )}
      </div>

      <main className="flex-1 p-4">
        {error ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              className="px-6 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all duration-300"
              onClick={fetchHistoryArticles}
            >
              重试
            </button>
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-4xl mb-4">🕐</div>
            <p className="text-gray-600 mb-6">还没有浏览记录</p>
            <button 
              className="px-8 py-3 bg-primary/10 text-primary rounded-lg font-medium transition-all duration-300 hover:bg-primary/20"
              onClick={() => navigate('/')}
            >
              去浏览文章
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.map((article: any) => (
              <ArticleCard
                key={article.id}
                article={article}
                showActions={false}
              />
            ))}
          </div>
        )}
      </main>
      
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="确认清空浏览历史"
        message="确定要清空所有浏览历史吗？"
        onConfirm={confirmClearHistory}
        onCancel={cancelClearHistory}
      />
    </div>
  );
};

export default UserHistory;
