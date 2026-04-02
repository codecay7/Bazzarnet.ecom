import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faHeart } from '@fortawesome/free-solid-svg-icons';
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import SkeletonCard from '../components/SkeletonCard';
import placeholderImage from '../assets/placeholder.png';
import { getFullImageUrl } from '../utils/imageUtils';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, moveToCart } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setLoading(false);
    };
    loadData();
  }, [wishlist.length]);

  return (
    <section className="w-full max-w-[1200px] my-10">
      <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-8 mx-4">
        <h2 className="text-3xl font-bold mb-5 md:text-4xl">Your Wishlist</h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <SkeletonCard key={index} className="w-full" />
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-10">
            <FontAwesomeIcon icon={faHeart} className="text-6xl text-[var(--accent)] mb-4" aria-hidden="true" />
            <p className="text-base md:text-lg mb-4">Your wishlist is empty.</p>
            <Link to="/products" className="bg-[var(--accent)] text-white border-none py-2 px-6 rounded-lg font-medium hover:bg-[var(--accent-dark)] transition-all duration-300" aria-label="Find Products to add to wishlist">
                Find Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4" role="list">
            {wishlist.map((item) => {
              const isOutOfStock = item.product.stock === 0;
              return (
                <div key={item.product._id} className={`bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${isOutOfStock ? 'grayscale' : ''}`} role="listitem" aria-label={`Wishlist item: ${item.name}, Price: ₹${item.price.toFixed(2)}`}>
                  <div className="flex items-center gap-4">
                    <img 
                      src={getFullImageUrl(item.image)} 
                      alt={item.name} 
                      className="w-20 h-20 object-cover rounded-lg" 
                      onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }}
                    />
                    <div>
                      <h3 className="text-xl font-semibold">{item.name}</h3>
                      <p className="text-base">₹{item.price.toFixed(2)}</p>
                      {isOutOfStock && (
                        <span className="text-red-500 text-sm font-bold mt-1">OUT OF STOCK</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <button
                      className="bg-[var(--accent)] text-white border-none py-2 px-4 rounded-lg flex items-center gap-2 font-medium hover:bg-[var(--accent-dark)] transition-all duration-300"
                      onClick={() => moveToCart(item)}
                      aria-label={`Move ${item.name} to cart`}
                      disabled={isOutOfStock}
                    >
                      <FontAwesomeIcon icon={faCartPlus} aria-hidden="true" /> Move to Cart
                    </button>
                    <button
                      className="bg-red-500 text-white border-none py-2 px-4 rounded-lg flex items-center gap-2 font-medium hover:bg-red-600 transition-all duration-300"
                      onClick={() => removeFromWishlist(item.product._id)}
                      aria-label={`Remove ${item.name} from wishlist`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Wishlist;