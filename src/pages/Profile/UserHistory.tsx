import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleApi } from '../../services/api';
import ConfirmDialog from '../../components/ConfirmDialog';
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

  const handleArticleClick = (id: number) => {
    navigate(`/article/${id}`);
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
                    <span>{formatTime(article.viewTime)}</span>
                  </div>
                  <div className="flex gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">👁 {article.views}</span>
                    <span className="flex items-center gap-1">👍 {article.likes}</span>
                    <span className="flex items-center gap-1">⭐ {article.favorites}</span>
                  </div>
                </div>
              </div>
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
