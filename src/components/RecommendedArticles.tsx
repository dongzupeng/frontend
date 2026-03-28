import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Article } from '../types/index';

interface RecommendedArticlesProps {
  articles: Article[];
}

const RecommendedArticles: React.FC<RecommendedArticlesProps> = ({ articles }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2 text-left">为你推荐</h2>
        <p className="text-gray-500 text-sm text-left">让我们看看推荐文章</p>
      </div>
      <div className="flex overflow-x-auto space-x-4 pb-2">
        {articles.map((article) => (
          <div 
            key={article.id} 
            className="flex-shrink-0 w-56 cursor-pointer group"
            onClick={() => navigate(`/article/${article.id}`)}
          >
            <div className="rounded-lg overflow-hidden bg-white relative">
              {article.coverImage && (
                <div className="w-full h-36 relative">
                  <img 
                    src={article.coverImage} 
                    alt={article.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-white/90">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedArticles;