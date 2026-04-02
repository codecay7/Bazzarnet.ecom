import React from 'react';
import SkeletonText from './SkeletonText'; // Assuming SkeletonText is available for smaller text elements

const SkeletonStoreCard = () => {
  return (
    <div className="bg-black/10 border border-white/10 rounded-2xl p-6 flex flex-col shadow-lg animate-pulse">
      <div className="flex-grow">
        {/* Placeholder for icon */}
        <div className="w-10 h-10 bg-gray-700 rounded-full mb-4"></div>
        {/* Placeholder for store name */}
        <SkeletonText width="70%" height="1.8rem" className="mb-3" />
        {/* Placeholder for description */}
        <SkeletonText width="90%" height="1rem" className="mb-2" />
        <SkeletonText width="80%" height="1rem" />
      </div>
      {/* Placeholder for button */}
      <div className="mt-4 w-32 h-10 bg-gray-700 rounded-lg self-start"></div>
    </div>
  );
};

export default SkeletonStoreCard;