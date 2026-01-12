import { X, Check, AlertTriangle} from 'lucide-react';

const AiResponse = ({ result }) => {
   if (!result) return null;

  const confidence = result.confidence || 0;
  const verdict = result.verdict || 'UNKNOWN';
  
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (confidence / 100) * circumference;

  const formatText = (text) => {
    if (!text) return '';
    
    return text.split('\n').map((paragraph, idx) => {
      if (!paragraph.trim()) return null;
      
      const parts = paragraph.split(/\*\*(.*?)\*\*/g);
      
      return (
        <p key={idx} className="mb-2">
          {parts.map((part, i) => {
            return i % 2 === 0 ? part : <strong key={i} className="font-semibold">{part}</strong>;
          })}
        </p>
      );
    }).filter(Boolean);
  };

  const verdictConfig = {
    'SUPPORTED': { icon: Check, color: 'text-green-500', label: 'Verified' },
    'CONTRADICTED': { icon: X, color: 'text-red-500', label: 'Contradicted' },
    'PARTIALLY_SUPPORTED': { icon: AlertTriangle, color: 'text-yellow-500', label: 'Partially Verified' }
  };

  const config = verdictConfig[verdict] || verdictConfig['CONTRADICTED'];
  const VerdictIcon = config.icon;

  return (
    <div className="relative h-full overflow-y-auto flex flex-col">
      <div className="actual-response mt-3 sm:mt-5 mx-3 sm:mx-5 flex-1 overflow-y-auto">
        <div className="card bg-gray-100 hidden sm:flex overflow-visible rounded-tr-xl rounded-bl-xl w-40 h-40 float-right ml-4 mb-4 flex-col items-center justify-center p-3 shrink-0">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-gray-300"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className={`${config.color} transition-all duration-1000`}
                strokeLinecap="round"
              />
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-black text-gray-900">{confidence}%</span>
            </div>
          </div>
          
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide mt-2">Confidence</span>
        </div>

        <h1 className={config ? `flex gap-2 text-xl sm:text-2xl font-medium ${config.color}` : `flex gap-2 text-xl sm:text-2xl font-medium`}>
          <VerdictIcon className="size-6 sm:size-7 shrink-0" /> {config.label}
        </h1>

        <div className="summary my-3">
          <h1 className="text-lg sm:text-xl font-semibold">Summary</h1>
          <div className="text-sm text-gray-700 leading-relaxed">
            {formatText(result.summary)}
          </div>
        </div>
        <div className="Analysis">
          <h1 className="text-lg sm:text-xl font-semibold">Analysis</h1>
          <div className="text-sm text-gray-700 leading-relaxed">
            {formatText(result.reasoning)}
          </div>
        </div>

        <div className="clear-both"></div>
      </div>
    </div>
  );
}

export default AiResponse



