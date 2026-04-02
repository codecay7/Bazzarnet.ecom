import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard'; // Import the new ProductCard component
import SkeletonCard from '../components/SkeletonCard'; // Import SkeletonCard

const StorePage = () => {
  const { allAppProducts, appStores } = useContext(AppContext);
  const { storeId } = useParams();
  const store = appStores.find(s => s._id === storeId);

  // Filter products for the current store
  const storeProducts = allAppProducts.filter(product => product.store._id === storeId);

  if (!store) {
    return (
      <section className="w-full max-w-[1200px] my-10">
        <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-8 mx-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Store Not Found</h2>
          <Link to="/stores" className="text-[var(--accent)] hover:underline">Back to All Stores</Link>
        </div>
      </section>
    );
  }

  // Assuming loading state for products is handled by allAppProducts loading,
  // or we could add a specific loading state for store products if needed.
  const loading = allAppProducts.length === 0; // Simple loading check

  return (
    <section className="w-full max-w-[1200px] my-10">
      <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-8 mx-4">
        <div className="mb-8 pb-6 border-b border-white/20">
          <h2 className="text-3xl md:text-4xl font-bold">{store.name}</h2>
          <p className="text-base md:text-lg mt-2 opacity-80">{store.description}</p>
        </div>
        
        <h3 className="text-2xl font-bold mb-6">Products</h3>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {[...Array(3)].map((_, index) => ( // Show a few skeleton cards
              <SkeletonCard key={index} className="w-full" />
            ))}
          </div>
        ) : storeProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center" role="list">
            {storeProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-lg opacity-80 py-10">No products available for this store.</p>
        )}
      </div>
    </section>
  );
};

export default StorePage;