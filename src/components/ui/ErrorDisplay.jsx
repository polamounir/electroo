import React from 'react';

const ErrorDisplay = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center min-h-64 text-center">
    <div className="text-red-500 text-6xl mb-4">⚠️</div>
    <h3 className="text-xl font-semibold text-red-600 mb-2">حدث خطأ</h3>
    <p className="text-red-500 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        إعادة المحاولة
      </button>
    )}
  </div>
);

export default ErrorDisplay;