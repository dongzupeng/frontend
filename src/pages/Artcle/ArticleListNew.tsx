import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleApi } from '../../services/api';
import type { Article } from '../../types/index';

import CustomSelect from '../../components/CustomSelect';

interface ArticleListProps {
  searchTerm: string;
}

const ArticleList: React.FC<ArticleListProps> = ({ searchTerm }) => {
  const navigate = useNavigate();
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'createdAt' | 'views'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);

  // 首次加载时获取所有文章数据
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const data = await articleApi.getAll();
      setAllArticles(data);
    } catch (err) {
      setError('Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  // 当搜索词、排序方式或排序顺序变化时，在前端进行过滤和排序
  useEffect(() => {
    // 过滤文章
    let processedArticles = allArticles;
    if (searchTerm) {
      processedArticles = allArticles.filter(article => 
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
  }, [searchTerm, sortBy, sortOrder, allArticles]);

  // 只在组件首次加载时获取数据
  useEffect(() => {
    fetchArticles();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-left">文章列表</h2>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">加载失败</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button className="px-8 py-3 bg-gray-100 text-gray-800 rounded-full font-medium transition-all duration-300 hover:bg-gray-200 hover:shadow-md">重试</button>
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
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-gray-800 text-left">文章列表</h2>
          <div className="flex items-center gap-2">
            <CustomSelect
              options={[
                { value: 'createdAt', label: '按发布时间' },
                { value: 'views', label: '按阅读量' },
              ]}
              value={sortBy}
              onChange={(value) => setSortBy(value as 'createdAt' | 'views')}
            />
            <button 
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 hover:border-primary transition-all duration-300"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>
      {filteredArticles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">暂无文章</h3>
          <p className="text-gray-600">还没有发布任何文章</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-6">
            {currentArticles.map((article) => (
              <div key={article.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => navigate(`/article/${article.id}`)}
                >
                  {article.coverImage && (
                    <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
                      <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 hover:text-primary transition-colors duration-300">{article.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100">
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="text-sm text-gray-600 font-medium">{article.author}</span>
                        <span className="text-sm text-gray-500">{new Date(article.createdAt).toLocaleDateString()}</span>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          👁️ {article.views}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-200">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                上一页
              </button>
              <div className="text-sm text-gray-600 font-medium">
                第 {currentPage} / {totalPages} 页
              </div>
              <button 
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                下一页
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default ArticleList;