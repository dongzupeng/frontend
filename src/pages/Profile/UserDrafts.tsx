import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { draftApi } from '../../services/api';
import ConfirmDialog from '../../components/ConfirmDialog';

interface Draft {
  title: string;
  content: string;
  author: string;
  coverImage: string;
  isPublished: boolean;
  savedAt: string;
  updatedAt: string;
  createdAt: string;
  id: string;
}

const UserDrafts: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadDrafts();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadDrafts = async () => {
    try {
      setLoading(true);
      const drafts = await draftApi.getAll();
      setDrafts(drafts);
    } catch (err) {
      setError('获取草稿失败');
    } finally {
      setLoading(false);
    }
  };

  const handleEditDraft = (_draft: Draft) => {
    navigate('/create');
  };

  const handleDeleteDraft = (draftId: string) => {
    setDraftToDelete(draftId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (draftToDelete) {
      try {
        await draftApi.delete(Number(draftToDelete));
        setDrafts(drafts.filter(draft => draft.id !== draftToDelete));
      } catch (err) {
        if ((window as any).toast) {
          (window as any).toast.error('删除失败');
        }
      } finally {
        setShowDeleteConfirm(false);
        setDraftToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDraftToDelete(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-4 bg-white border-b border-gray-200">
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300"
            onClick={() => navigate('/profile')}
          >
            ←
          </button>
          <h1 className="text-lg font-semibold text-gray-800">我的草稿</h1>
          <div className="w-10"></div>
        </div>
        <main className="flex-1 p-4">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-4xl mb-4">🔒</div>
            <p className="text-gray-600 mb-6">登录后查看你的草稿</p>
            <button
              className="px-8 py-3 bg-primary/10 text-primary rounded-lg font-medium transition-all duration-300 hover:bg-primary/20"
              onClick={() => navigate('/login')}
            >
              去登录
            </button>
          </div>
        </main>
      </div>
    );
  }

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
        <h1 className="text-lg font-semibold text-gray-800">我的草稿</h1>
        <div className="w-10"></div>
      </div>

      <main className="flex-1 p-4">
        {error ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              className="px-6 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all duration-300"
              onClick={loadDrafts}
            >
              重试
            </button>
          </div>
        ) : drafts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-4xl mb-4">📝</div>
            <p className="text-gray-600 mb-6">还没有草稿</p>
            <button
              className="px-8 py-3 bg-primary/10 text-primary rounded-lg font-medium transition-all duration-300 hover:bg-primary/20"
              onClick={() => navigate('/create')}
            >
              去写文章
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-1">
                  {draft.title || '无标题草稿'}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {draft.content || '无内容'}
                </p>
                <div className="pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500 block mb-3">
                    保存于: {new Date(draft.updatedAt || draft.createdAt).toLocaleString()}
                  </span>
                  <div className="flex gap-3">
                    <button
                      className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm transition-all duration-300 hover:bg-primary/20 flex-1"
                      onClick={() => handleEditDraft(draft)}
                    >
                      编辑
                    </button>
                    <button
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm transition-all duration-300 hover:bg-red-200 flex-1"
                      onClick={() => handleDeleteDraft(draft.id)}
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
        isOpen={showDeleteConfirm}
        title="确认删除"
        message="确定要删除这个草稿吗？删除后无法恢复。"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default UserDrafts;
