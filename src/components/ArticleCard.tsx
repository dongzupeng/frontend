import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Article } from '../types/index';

interface ArticleCardProps {
  article: Article;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onRemoveFavorite?: (id: number) => void;
  onRemoveLike?: (id: number) => void;
  showActions?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onEdit,
  onDelete,
  onRemoveFavorite,
  onRemoveLike,
  showActions = true,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/article/${article.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(article.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(article.id);
    }
  };

  const handleRemoveFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemoveFavorite) {
      onRemoveFavorite(article.id);
    }
  };

  const handleRemoveLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemoveLike) {
      onRemoveLike(article.id);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      {article.coverImage && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={article.coverImage} 
            alt={article.title} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{article.title}</h3>
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-500">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-medium text-gray-700">{article.author}</span>
            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              {article.views}
            </span>
          </div>
          {showActions && (onEdit || onDelete || onRemoveFavorite || onRemoveLike) && (
            <div className="flex gap-2">
              {onEdit && (
                <button 
                  className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm transition-all duration-300 hover:bg-primary/20"
                  onClick={handleEdit}
                >
                  编辑
                </button>
              )}
              {onDelete && (
                <button 
                  className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-sm transition-all duration-300 hover:bg-red-200"
                  onClick={handleDelete}
                >
                  删除
                </button>
              )}
              {onRemoveFavorite && (
                <button 
                  className="w-full px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-sm transition-all duration-300 hover:bg-red-200"
                  onClick={handleRemoveFavorite}
                >
                  取消收藏
                </button>
              )}
              {onRemoveLike && (
                <button 
                  className="w-full px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-sm transition-all duration-300 hover:bg-red-200"
                  onClick={handleRemoveLike}
                >
                  取消点赞
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
