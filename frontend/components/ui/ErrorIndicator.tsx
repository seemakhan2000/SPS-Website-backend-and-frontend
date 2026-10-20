// components/ui/ErrorIndicator.tsx
'use client';

import { useState } from 'react';

interface ErrorIndicatorProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorIndicator({ 
  message = 'Video Error - Click to retry',
  onRetry 
}: ErrorIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleRetry = () => {
    if (onRetry) onRetry();
    setIsVisible(false);
    setTimeout(() => setIsVisible(true), 100);
  };

  if (!isVisible) return null;

  return (
    <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-white text-xs error-indicator">
      <svg 
        className="w-4 h-4 text-red-500" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
        />
      </svg>
      <span>{message}</span>
      <button 
        onClick={handleRetry}
        className="ml-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
      >
        Retry
      </button>
    </div>
  );
}