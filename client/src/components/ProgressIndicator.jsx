import { useState, useEffect } from 'react';

const ProgressIndicator = ({ duration }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const elapsed = prev;
        const increase = (95 - elapsed) / (11000 / 300);
        return Math.min(prev + increase, 95);
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

 
  const estimatedSeconds = Math.max(1, Math.ceil((11 - (progress / 100) * 11)));

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 sm:gap-6 p-4 sm:p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-[#0D1828] mb-2">Verifying Claim</h3>
          <p className="text-xs sm:text-sm text-gray-500">
            {progress < 100 
              ? `Estimated time: ~${estimatedSeconds}s` 
              : `Completed in ${(duration / 1000).toFixed(2)}s`}
          </p>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden shadow-sm">
          <div
            className="bg-linear-to-r from-[#0D1828] to-[#1a2d3f] h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Progress Percentage */}
        <div className="text-center mt-2 sm:mt-3">
          <span className="text-xs sm:text-sm font-semibold text-[#0D1828]">{Math.round(progress)}%</span>
        </div>

        {/* Status Messages */}
        <div className="mt-4 sm:mt-6 space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-sm shrink-0">
              {progress >= 18 ? (
                <span className="text-[#0D1828] font-semibold">✓</span>
              ) : (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0D1828] opacity-40 animate-pulse"></span>
              )}
            </span>
            <span className={`text-xs transition-colors ${progress >= 18 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
              Initializing Gemini
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-sm shrink-0">
              {progress >= 38 ? (
                <span className="text-[#0D1828] font-semibold">✓</span>
              ) : (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0D1828] opacity-40 animate-pulse"></span>
              )}
            </span>
            <span className={`text-xs transition-colors ${progress >= 38 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
              Searching web and analyzing
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-sm shrink-0">
              {progress >= 58 ? (
                <span className="text-[#0D1828] font-semibold">✓</span>
              ) : (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0D1828] opacity-40 animate-pulse"></span>
              )}
            </span>
            <span className={`text-xs transition-colors ${progress >= 58 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
              Processing AI response
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-sm shrink-0">
              {progress >= 78 ? (
                <span className="text-[#0D1828] font-semibold">✓</span>
              ) : (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0D1828] opacity-40 animate-pulse"></span>
              )}
            </span>
            <span className={`text-xs transition-colors ${progress >= 78 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
              Extracting sources
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-sm shrink-0">
              {progress >= 100 ? (
                <span className="text-[#0D1828] font-semibold">✓</span>
              ) : (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0D1828] opacity-40 animate-pulse"></span>
              )}
            </span>
            <span className={`text-xs transition-colors ${progress >= 100 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
              Finalizing results
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;