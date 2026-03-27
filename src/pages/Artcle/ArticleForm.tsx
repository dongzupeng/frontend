import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { articleApi } from '../../services/api';
import type { CreateArticleDto } from '../../types/index';
import Upload from '../../components/Upload';

interface ArticleFormProps {
  isEdit?: boolean;
  articleId?: number;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ isEdit = false, articleId }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [author, setAuthor] = useState<string>(user?.username || '');
  const [coverImage, setCoverImage] = useState<string>('');
  const [isPublished, setIsPublished] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 监听用户变化，更新作者
  useEffect(() => {
    if (user && !isEdit) {
      setAuthor(user.username);
    }
  }, [user, isEdit]);

  // 加载文章数据（编辑模式）
  useEffect(() => {
    if (isEdit && articleId) {
      const fetchArticle = async () => {
        try {
          setLoading(true);
          const article = await articleApi.getOne(articleId);
          setTitle(article.title);
          setContent(article.content);
          setAuthor(article.author);
          setCoverImage(article.coverImage);
          setIsPublished(article.isPublished);
        } catch (err) {
          setError('加载文章失败');
        } finally {
          setLoading(false);
        }
      };

      fetchArticle();
    }
  }, [isEdit, articleId]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title || !content || !author || !coverImage) {
      setError('请填写所有必填字段');
      return;
    }

    const articleData: CreateArticleDto = {
      title,
      content,
      author,
      coverImage,
      isPublished,
    };

    try {
      setLoading(true);
      console.log('更新文章:', { articleId, articleData });
      if (isEdit && articleId) {
        await articleApi.update(articleId, articleData);
        setSuccess('文章更新成功');
      } else {
        await articleApi.create(articleData);
        setSuccess('文章创建成功');
        // 重置表单
        setTitle('');
        setContent('');
        setAuthor('');
        setCoverImage('');
        setIsPublished(true);
      }
      // 3秒后跳转到文章列表
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      console.error('更新文章失败:', err);
      setError(isEdit ? '更新文章失败' : '创建文章失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">加载中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <button 
          className="w-10 h-10 rounded-full flex items-center justify-center mb-10"
          onClick={() => navigate('/')}
        >
          ←
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{isEdit ? '编辑文章' : '创建文章'}</h1>
        <p className="text-gray-500 mb-10">鱼塘博客，文化传承新力量</p>
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 p-3 bg-green-50 text-green-600 rounded-lg flex items-center gap-2">
            <span>✅</span>
            <span>{success}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="mb-2 text-sm text-gray-500">标题</div>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入文章标题"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-600 bg-transparent placeholder-gray-400"
            />
          </div>
          <div className="mb-6">
            <div className="mb-2 text-sm text-gray-500">内容</div>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="请输入文章内容"
              rows={10}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical text-gray-600 bg-transparent placeholder-gray-400"
            />
          </div>
          <div className="mb-6">
            <div className="mb-2 text-sm text-gray-500">封面图片</div>
            <Upload
              value={coverImage}
              onChange={setCoverImage}
              placeholder="请输入封面图片的 URL 或上传图片"
            />
          </div>

          <div className="flex gap-4 justify-end mt-10">
            <button 
              type="button" 
              className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg font-medium transition-all duration-300 hover:bg-gray-200"
              onClick={() => navigate('/')}
            >
              取消
            </button>
            <button 
              type="submit" 
              className="px-6 py-3 bg-primary/10 text-primary rounded-lg font-medium transition-all duration-300 hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? '处理中...' : isEdit ? '更新文章' : '创建文章'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleForm;
