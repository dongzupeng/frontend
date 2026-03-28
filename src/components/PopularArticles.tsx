import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Article } from '../types/index';

interface PopularArticlesProps {
  articles: Article[];
}

const PopularArticles: React.FC<PopularArticlesProps> = ({ articles }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2 text-left">热门文章</h2>
      </div>
      <div className="space-y-3">
        {articles.slice(0, 5).map((article) => (
          <div 
            key={article.id} 
            className="flex items-center space-x-3 bg-white rounded-lg cursor-pointer"
            onClick={() => navigate(`/article/${article.id}`)}
          >
            {article.coverImage && (
              <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden flex items-center justify-center">
                <img 
                  src={article.coverImage} 
                  alt={article.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className="text-xs text-left text-gray-600 font-medium block mb-1">{article.author}</span>
              <h3 className="text-sm text-left font-semibold text-gray-800 mb-1 line-clamp-2">
                {article.title}
              </h3>
              <span className="text-xs text-gray-500 mt-auto text-left block">
                {new Date(article.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularArticles;