import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleApi } from '../../services/api';
import type { Article } from '../../types/index';
import ConfirmDialog from '../../components/ConfirmDialog';
import ArticleCard from '../../components/ArticleCard';
import RecommendedArticles from '../../components/RecommendedArticles';
import PopularArticles from '../../components/PopularArticles';

interface ArticleListProps {
  searchTerm: string;
}

const ArticleList: React.FC<ArticleListProps> = ({ searchTerm }) => {
  const navigate = useNavigate();
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    articleId: number | null;
  }>({
    isOpen: false,
    articleId: null,
  });
  const [sortBy, setSortBy] = useState<'createdAt' | 'views'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const data = await articleApi.getAll();
      setAllArticles(data);
      
      // 过滤文章
      let processedArticles = data;
      if (searchTerm) {
        processedArticles = data.filter(article => 
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.author.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // 排序文章
      processedArticles.sort((a, b) => {
        if (sortBy === 'createdAt') {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        } else {
          // 按阅读量排序
          return sortOrder === 'asc' ? a.views - b.views : b.views - a.views;
        }
      });
      
      setFilteredArticles(processedArticles);
      // 重置到第一页
      setCurrentPage(1);
    } catch (err) {
      setError('Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [searchTerm, sortBy, sortOrder]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">文章列表</h2>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">加载失败</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            className="px-8 py-3 bg-primary/10 text-primary rounded-lg font-medium transition-all duration-300 hover:bg-primary/20"
            onClick={() => window.location.reload()}
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  // 计算当前页显示的文章
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstItem, indexOfLastItem);
  
  // 计算总页数
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);

  return (
    <div className="py-8">
      {/* 为你推荐模块 */}
      <RecommendedArticles articles={allArticles.slice(0, 6)} />
      
      {/* 热门文章模块 */}
      <PopularArticles articles={[...allArticles].sort((a, b) => b.views - a.views)} />
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl fo-bold text-gray-800">文章列表</h2>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'views')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-gray-600 bg-white"
          >
            <option value="createdAt">按发布时间</option>
            <option value="views">按阅读量</option>
          </select>
          <button 
            className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all duration-300"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
      
      {filteredArticles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">暂无文章</h3>
          <p className="text-gray-600 mb-6">还没有发布任何文章，快来添加第一篇文章吧！</p>
          <button 
            className="px-8 py-3 bg-primary/10 text-primary rounded-lg font-medium transition-all duration-300 hover:bg-primary/20"
            onClick={() => navigate('/create')}
          >
            创建第一篇文章
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onEdit={(id) => navigate(`/edit/${id}`)}
                onDelete={(id) => setConfirmDialog({
                  isOpen: true,
                  articleId: id,
                })}
                showActions={false}
              />
            ))}
          </div>
          
          {/* 分页控件 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-6">
              <button 
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                上一页
              </button>
              <div className="text-sm text-gray-600">
                第 {currentPage} / {totalPages} 页
              </div>
              <button 
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                下一页
              </button>
            </div>
          )}
        </div>
      )}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="确认删除"
        message="确定要删除这篇文章吗？此操作不可撤销。"
        onConfirm={() => {
          if (confirmDialog.articleId) {
            articleApi.delete(confirmDialog.articleId)
              .then(() => {
                // 重新获取文章列表
                fetchArticles();
                // 关闭确认对话框
                setConfirmDialog({
                  isOpen: false,
                  articleId: null,
                });
              })
              .catch((err) => {
                console.error('删除文章失败:', err);
                // 关闭确认对话框
                setConfirmDialog({
                  isOpen: false,
                  articleId: null,
                });
                // 显示错误提示
                if ((window as any).toast) {
                  (window as any).toast.error('删除文章失败，请重试');
                }
              });
          }
        }}
        onCancel={() => {
          setConfirmDialog({
            isOpen: false,
            articleId: null,
          });
        }}
      />
    </div>
  );
};

export default ArticleList;
