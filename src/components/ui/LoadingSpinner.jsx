import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center min-h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
    <p className="mt-4 text-teal-500 font-medium">{message}</p>
  </div>
);

export default LoadingSpinner;