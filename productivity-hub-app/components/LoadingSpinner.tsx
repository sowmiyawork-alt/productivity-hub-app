
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-600 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
