import React from 'react';

const SkeletonText = ({ width = '100%', height = '1rem', className = '' }) => {
  return (
    <div
      className={`bg-gray-700 rounded animate-pulse ${className}`}
      style={{ width, height }}
    ></div>
  );
};

export default SkeletonText;