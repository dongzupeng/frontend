import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { articleApi, draftApi } from '../../services/api';
import type { CreateArticleDto } from '../../types/index';
import Upload from '../../components/Upload';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

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
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [draftSaved, setDraftSaved] = useState<boolean>(false);
  const [draftId, setDraftId] = useState<number | null>(null);

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
    } else {
      // 加载草稿
      loadDraft();
    }
  }, [isEdit, articleId]);

  // 自动保存草稿
  useEffect(() => {
    if (!isEdit) {
      const timer = setTimeout(() => {
        saveDraft();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [title, content, coverImage, author, isEdit]);

  // 保存草稿到数据库
  const saveDraft = async () => {
    if (!isEdit && (title || content || coverImage) && user) {
      try {
        const draft = {
          title,
          content,
          author,
          coverImage,
          isPublished,
        };
        if (draftId) {
          // 更新现有草稿
          await draftApi.update(draftId, draft);
        } else {
          // 创建新草稿
          const newDraft = await draftApi.create(draft);
          setDraftId(newDraft.id);
        }
        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 2000);
      } catch (err) {
        console.error('保存草稿失败:', err);
      }
    }
  };

  // 从数据库加载最新草稿
  const loadDraft = async () => {
    if (!isEdit && user) {
      try {
        const drafts = await draftApi.getAll();
        if (drafts && drafts.length > 0) {
          // 按更新时间排序，取最新的草稿
          const latestDraft = drafts.sort((a, b) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )[0];
          setDraftId(latestDraft.id);
          setTitle(latestDraft.title || '');
          setContent(latestDraft.content || '');
          setAuthor(latestDraft.author || (user?.username || ''));
          setCoverImage(latestDraft.coverImage || '');
          setIsPublished(latestDraft.isPublished || true);
        }
      } catch (err) {
        console.error('加载草稿失败:', err);
      }
    }
  };



  // 清除草稿
  const clearDraft = async () => {
    if (user) {
      try {
        if (draftId) {
          await draftApi.delete(draftId);
          setDraftId(null);
        }
      } catch (err) {
        console.error('清除草稿失败:', err);
      }
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
      // 清除草稿
      clearDraft();
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
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-bold text-gray-800">{isEdit ? '编辑文章' : '创建文章'}</h1>
          <button 
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm transition-all duration-300 hover:bg-gray-200"
            onClick={() => navigate('/profile/drafts')}
          >
            草稿箱
          </button>
        </div>
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
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500">内容 (支持 Markdown 语法)</div>
              <div className="flex items-center gap-2">
                <button 
                  type="button" 
                  className={`px-3 py-1 text-xs rounded-md ${showPreview ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? '编辑' : '预览'}
                </button>
              </div>
            </div>
            {showPreview ? (
              <div className="w-full p-6 border border-gray-200 rounded-lg bg-white min-h-[400px] overflow-auto shadow-sm">
                <div className="prose max-w-none break-words whitespace-pre-wrap text-gray-700">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      code: ({ inline, className, children, ...props }: any) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const [, language] = match || [];
                        const [copied, setCopied] = React.useState(false);
                        
                        const getCodeText = () => {
                          if (!children) return '';
                          if (typeof children === 'string') return children;
                          if (Array.isArray(children)) {
                            return children.map(child => {
                              if (typeof child === 'string') return child;
                              if (child && typeof child === 'object' && 'props' in child) {
                                return child.props.children || '';
                              }
                              return String(child);
                            }).join('');
                          }
                          return String(children);
                        };
                        
                        const handleCopy = async () => {
                          const text = getCodeText();
                          try {
                            await navigator.clipboard.writeText(text);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          } catch (err) {
                            console.error('复制失败:', err);
                          }
                        };
                        
                        return !inline && match ? (
                          <div className="relative my-4 rounded-md overflow-hidden border border-gray-200">
                            <div className="flex items-center justify-between bg-gray-100 px-4 py-1.5 border-b border-gray-200">
                              <span className="text-xs text-gray-600 font-mono">{language}</span>
                              <button 
                                className={`text-xs transition-colors ${copied ? 'text-green-600' : 'text-gray-600 hover:text-gray-900'}`}
                                onClick={handleCopy}
                              >
                                {copied ? '已复制' : '复制'}
                              </button>
                            </div>
                            <pre className="bg-gray-50 text-gray-800 p-4 overflow-x-auto font-mono text-sm leading-relaxed whitespace-pre">
                              <code className={`${className} whitespace-pre`} {...props}>
                                {children}
                              </code>
                            </pre>
                          </div>
                        ) : (
                          <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded font-mono text-sm" {...props}>
                            {children}
                          </code>
                        );
                      },
                      p: ({ children, ...props }: any) => (
                        <p className="mb-4 text-gray-700" {...props}>{children}</p>
                      ),
                      h1: ({ children, ...props }: any) => (
                        <h1 className="text-2xl font-bold mb-4 text-gray-900" {...props}>{children}</h1>
                      ),
                      h2: ({ children, ...props }: any) => (
                        <h2 className="text-xl font-bold mb-3 text-gray-800" {...props}>{children}</h2>
                      ),
                      h3: ({ children, ...props }: any) => (
                        <h3 className="text-lg font-bold mb-2 text-gray-800" {...props}>{children}</h3>
                      ),
                      a: ({ children, href, ...props }: any) => (
                        <a href={href} className="text-blue-600 hover:underline" {...props}>{children}</a>
                      ),
                      blockquote: ({ children, ...props }: any) => (
                        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-500 my-4" {...props}>
                          {children}
                        </blockquote>
                      ),
                      ul: ({ children, ...props }: any) => (
                        <ul className="list-disc pl-6 mb-4 text-gray-700" {...props}>{children}</ul>
                      ),
                      ol: ({ children, ...props }: any) => (
                        <ol className="list-decimal pl-6 mb-4 text-gray-700" {...props}>{children}</ol>
                      )
                    }}
                  >
                    {content || '# 预览模式\n\n请在编辑模式下输入内容'}
                  </ReactMarkdown>
                </div>
              </div>
            ) : (
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="请输入文章内容，支持 Markdown 语法"
                rows={10}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical text-gray-600 bg-transparent placeholder-gray-400 font-mono"
              />
            )}
          </div>
          <div className="mb-6">
            <div className="mb-2 text-sm text-gray-500">封面图片</div>
            <Upload
              value={coverImage}
              onChange={setCoverImage}
              placeholder="请输入封面图片的 URL 或上传图片"
            />
          </div>

          <div className="flex gap-4 justify-end mt-6 items-center">
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
          {!isEdit && draftSaved && (
            <div className="mt-2 text-right text-sm text-green-600 flex items-center justify-end gap-1">
              <span>✅</span>
              <span>草稿已保存</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ArticleForm;
