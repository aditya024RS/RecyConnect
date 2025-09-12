import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      <p className="ml-3 text-lg text-gray-700">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;