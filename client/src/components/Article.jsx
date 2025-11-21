import React from 'react'
import { ExternalLink } from 'lucide-react'

const Article = ({ article, index }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <article className="shrink-0 group bg-gray-100 rounded-2xl hover:bg-gray-50 transition-all duration-300 overflow-hidden">
      <div className="flex gap-3 p-3">
        {article.urlToImage && (
          <div className="shrink-0">
            <img
              src={article.urlToImage}
              className="w-20 h-full rounded-xl object-cover bg-gray-200"
              alt={article.title}
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-[#0D1828] leading-snug mb-1.5 line-clamp-2 group-hover:text-gray-700 transition-colors">
            {index !== undefined && `${index + 1}. `}{article.title}
          </h3>

          {article.description && (
            <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mb-2">
              {article.description}
            </p>
          )}

          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#0D1828]/10 text-[#0D1828] font-medium">
                {article.source}
              </span>
              <time className="text-gray-500">
                {formatDate(article.publishedAt)}
              </time>
            </div>

            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#0D1828] hover:text-gray-700 font-medium transition-colors"
            >
              Read
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

export default Article
