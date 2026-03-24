import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleApi } from '../../services/api';
import type { CreateArticleDto } from '../../types/index';

interface ArticleFormProps {
  isEdit?: boolean;
  articleId?: number;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ isEdit = false, articleId }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [coverImage, setCoverImage] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [isPublished, setIsPublished] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
          setImagePreview(article.coverImage);
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

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 限制文件大小为5MB
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError('图片大小不能超过5MB');
        return;
      }
      
      setUploading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setCoverImage(base64String);
        setImagePreview(base64String);
        setUploading(false);
      };
      reader.onerror = () => {
        setError('图片上传失败');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

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
          <label htmlFor="author">作者</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="请输入作者姓名"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="coverImage">封面图片</label>
          <input
            type="text"
            id="coverImage"
            value={coverImage}
            onChange={(e) => {
              setCoverImage(e.target.value);
              setImagePreview(e.target.value);
            }}
            placeholder="请输入封面图片的 URL 或上传图片"
            required
          />
          <div className="image-upload-container">
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
            <label htmlFor="imageUpload" className="image-upload-label">
              {uploading ? '上传中...' : '上传图片'}
            </label>
            <span className="image-upload-hint">（图片大小不超过5MB）</span>
          </div>
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview || undefined} alt="封面预览" />
              <button 
                type="button" 
                className="remove-image-button"
                onClick={() => {
                  setCoverImage('');
                  setImagePreview(null);
                }}
              >
                移除
              </button>
            </div>
          )}
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
