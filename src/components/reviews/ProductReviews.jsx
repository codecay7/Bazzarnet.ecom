import React, { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import SkeletonText from '../SkeletonText';
import placeholderImage from '../../assets/placeholder.png';
import { getFullImageUrl } from '../../utils/imageUtils';
import * as api from '../../services/api';
import toast from 'react-hot-toast';

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push(<FontAwesomeIcon key={`full-${i}`} icon={solidStar} className="text-yellow-400" aria-hidden="true" />);
  }
  if (halfStar) {
    stars.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} className="text-yellow-400" aria-hidden="true" />);
  }
  // Fill remaining with regular stars
  for (let i = stars.length; i < 5; i++) {
    stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={regularStar} className="text-gray-400" aria-hidden="true" />);
  }
  return stars;
};

const ProductReviews = ({ productId, refreshTrigger }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedReviews = await api.customer.getProductReviews(productId);
      setReviews(fetchedReviews);
    } catch (error) {
      toast.error(`Failed to load reviews: ${error.message}`);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews, refreshTrigger]); // Re-fetch when refreshTrigger changes

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-black/10 p-4 rounded-xl animate-pulse">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gray-700"></div>
              <SkeletonText width="120px" height="1rem" />
            </div>
            <SkeletonText width="80%" height="0.8rem" className="mb-1" />
            <SkeletonText width="90%" height="0.8rem" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Customer Reviews ({reviews.length})</h3>
      {reviews.length === 0 ? (
        <p className="text-center opacity-80 py-4">No reviews yet. Be the first to review this product!</p>
      ) : (
        <div className="space-y-4" role="list">
          {reviews.map((review) => (
            <div key={review._id} className="bg-black/10 p-4 rounded-xl" role="listitem" aria-label={`Review by ${review.user.name}`}>
              <div className="flex items-center gap-3 mb-2">
                <img 
                  src={getFullImageUrl(review.user.profileImage)} 
                  alt={review.user.name} 
                  className="w-10 h-10 rounded-full object-cover" 
                  onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }}
                />
                <div>
                  <p className="font-semibold">{review.user.name}</p>
                  <div className="flex items-center gap-1 text-sm">
                    {renderStars(review.rating)}
                    <span className="opacity-70 ml-1">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm opacity-90">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;