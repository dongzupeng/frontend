import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleApi } from '../../services/api';
import type { Article } from '../../services/api';
import ConfirmDialog from '../../components/ConfirmDialog';
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
      <div className="article-list">
        <h2>文章列表</h2>
        <div className="empty-state">
          <div className="empty-icon">⚠️</div>
          <h3>加载失败</h3>
          <p>{error}</p>
          <button className="retry-button" onClick={() => window.location.reload()}>重试</button>
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
    <div className="article-list">
      <div className="article-list-header">
        <div className="header-left">
          <h2>文章列表</h2>
          <div className="sort-controls">
            <CustomSelect
              options={[
                { value: 'createdAt', label: '按发布时间' },
                { value: 'views', label: '按阅读量' },
              ]}
              value={sortBy}
              onChange={(value) => setSortBy(value as 'createdAt' | 'views')}
              className="sort-select"
            />
            <button 
              className="sort-button"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
        <button className="action-button create-button" onClick={() => navigate('/create')}>
          创建文章
        </button>
      </div>
      {filteredArticles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>暂无文章</h3>
          <p>还没有发布任何文章，快来添加第一篇文章吧！</p>
          <button className="action-button create-button" onClick={() => navigate('/create')}>
            创建第一篇文章
          </button>
        </div>
      ) : (
        <div className="article-list-content">
          <div className="articles">
            {currentArticles.map((article) => (
              <div key={article.id} className="article-card">
                <div 
                  className="article-card-content"
                  onClick={() => navigate(`/article/${article.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="article-image">
                    <img src={article.coverImage || undefined} alt={article.title} />
                  </div>
                  <div className="article-content">
                    <h3 className="article-title">{article.title}</h3>
                    <div className="article-meta">
                      <div className="article-meta-left">
                        <span className="article-author">{article.author}</span>
                        <span className="article-date">{new Date(article.createdAt).toLocaleDateString()}</span>
                        <span className="article-views">阅读 {article.views}</span>
                      </div>
                      <div className="article-meta-right">
                        <button 
                          className="action-button edit-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/edit/${article.id}`);
                          }}
                        >
                          编辑
                        </button>
                        <button 
                          className="action-button delete-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDialog({
                              isOpen: true,
                              articleId: article.id,
                            });
                          }}
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-button"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                上一页
              </button>
              <div className="pagination-info">
                第 {currentPage} / {totalPages} 页
              </div>
              <button 
                className="pagination-button"
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
                alert('删除文章失败，请重试');
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