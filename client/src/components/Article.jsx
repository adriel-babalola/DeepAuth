import { ExternalLink } from 'lucide-react';

const Article = ({ article }) => {
  const handleClick = () => {
    if (article.url && article.url !== 'N/A') {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };

  const sourceName = typeof article.source === 'string' 
    ? article.source 
    : article.source?.name || 'Unknown Source';

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return null;
    }
  };

  const formattedDate = formatDate(article.publishedAt);

  return (
    <div 
      className={`card bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-lg transition-all duration-200 shrink-0 ${
        article.url && article.url !== 'N/A' 
          ? 'cursor-pointer' 
          : 'cursor-default'
      }`}
      onClick={handleClick}
    >
      <div className="flex flex-col h-full">
        <h3 className="font-semibold text-xs sm:text-sm mb-2 line-clamp-2 text-gray-900 hover:text-blue-600 transition-colors">
          {article.title}
        </h3>
        
        <p className="text-xs text-gray-600 line-clamp-2 sm:line-clamp-3 mb-2 flex-grow">
          {article.description}
        </p>
        
        <div className="flex items-center justify-between text-xs gap-2 shrink-0">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="font-medium text-gray-700 truncate">{sourceName}</span>
            {formattedDate && (
              <span className="text-gray-400 text-xs">{formattedDate}</span>
            )}
          </div>
          
          {article.url && article.url !== 'N/A' && (
            <div className="flex items-center gap-1 text-blue-500 hover:text-blue-600 font-medium shrink-0">
              <ExternalLink size={12} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Article;