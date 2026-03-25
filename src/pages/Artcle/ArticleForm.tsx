import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { articleApi } from '../../services/api';
import type { CreateArticleDto } from '../../types/index';
import Upload from '../../components/Upload';
import '../../styles/components/upload.css';

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
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className="article-form">
      <h2>{isEdit ? '编辑文章' : '创建文章'}</h2>
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="success-message">
          <span className="success-icon">✅</span>
          <span>{success}</span>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">标题</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="请输入文章标题"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">内容</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="请输入文章内容"
            rows={10}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="coverImage">封面图片</label>
          <Upload
            value={coverImage}
            onChange={setCoverImage}
            placeholder="请输入封面图片的 URL 或上传图片"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="action-button cancel-button" onClick={() => navigate('/')}>
            取消
          </button>
          <button type="submit" className="action-button submit-button" disabled={loading}>
            {loading ? '处理中...' : isEdit ? '更新文章' : '创建文章'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;
