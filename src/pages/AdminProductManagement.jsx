import React, { useContext, useState, useMemo, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import Modal from '../components/Modal';
import ProductForm from '../components/ProductForm';
import SkeletonCard from '../components/SkeletonCard';
import Pagination from '../components/Pagination';
import { Search, Store, Tag, ChevronDown } from 'lucide-react';
import placeholderImage from '../assets/placeholder.png'; // Import placeholder image
import { getFullImageUrl } from '../utils/imageUtils'; // Import utility

const AdminProductManagement = () => {
  const { allAppProducts, allAppProductsMeta, fetchAllProducts, adminEditProduct, adminDeleteProduct, appStores } = useContext(AppContext); // Removed simulateLoading
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStore, setFilterStore] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = [
    'Groceries', 'Bakery', 'Butcher', 'Cafe', 'Electronics', 
    'Furniture', 'Decor', 'Clothing', 'Other'
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Removed await simulateLoading(800); // Simulate network delay
      
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        store: filterStore === 'all' ? undefined : filterStore,
        category: filterCategory === 'all' ? undefined : filterCategory,
      };
      await fetchAllProducts(params);
      setLoading(false);
    };
    loadData();
  }, [searchTerm, filterStore, filterCategory, currentPage, fetchAllProducts]); // Removed simulateLoading from dependencies

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleFormSubmit = (productData) => {
    if (editingProduct) {
      adminEditProduct(editingProduct._id, productData);
    } else {
      // Admin adding a product would need to assign a storeId,
      // For simplicity, we'll just edit existing products for now.
      // Or, if adding, it would need a store selection in the form.
      // For this demo, we'll focus on editing/deleting existing products.
      toast.error("Admin can only edit/delete existing products in this demo. Adding new products requires assigning a store.");
    }
    handleCloseModal();
  };

  const calculateDiscount = (price, originalPrice) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStore, filterCategory]);

  return (
    <>
      <section className="w-full max-w-[1400px] my-10 mx-auto px-4 md:px-8">
        <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-8">
          <h2 className="text-3xl font-bold md:text-4xl mb-6">All Products Management</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text)] opacity-50" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/10 border border-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] pl-10 text-[var(--text)]"
                aria-label="Search products"
              />
            </div>

            <div className="relative">
              <select
                value={filterStore}
                onChange={(e) => setFilterStore(e.target.value)}
                className="w-full appearance-none p-3 rounded-lg bg-white/10 border border-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] pr-8 text-[var(--text)]"
                aria-label="Filter by store"
              >
                <option value="all">All Stores</option>
                {appStores.map(store => (
                  <option key={store._id} value={store._id}>{store.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--text)]" aria-hidden="true"><Store size={20} /></div>
            </div>

            <div className="relative">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full appearance-none p-3 rounded-lg bg-white/10 border border-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] pr-8 text-[var(--text)]"
                aria-label="Filter by category"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--text)]" aria-hidden="true"><Tag size={20} /></div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(itemsPerPage)].map((_, index) => (
                <SkeletonCard key={index} className="w-full" />
              ))}
            </div>
          ) : allAppProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
              {allAppProducts.map((product) => {
                const discount = calculateDiscount(product.price, product.originalPrice);
                const storeName = appStores.find(s => s._id === product.store._id)?.name || 'N/A'; // Use product.store._id
                return (
                  <div key={product._id} className="bg-black/10 border border-white/10 rounded-2xl overflow-hidden shadow-lg flex flex-col" role="listitem" aria-label={`Product: ${product.name}`}>
                    <div className="relative">
                      <img 
                        src={getFullImageUrl(product.image)} 
                        alt={product.name} 
                        className="w-full h-48 object-cover" 
                        onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }} // Fallback image
                      />
                      {discount > 0 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded" aria-label={`${discount} percent off`}>{discount}% OFF</span>
                      )}
                    </div>
                    <div className="p-4 flex-grow flex-col">
                      <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                      <p className="text-sm opacity-80 mb-1">Store: {storeName}</p>
                      <div className="flex items-baseline gap-2 mb-2">
                        <p className="text-lg font-bold text-[var(--accent)]">₹{product.price.toFixed(2)}</p>
                        {product.originalPrice && (
                          <p className="text-sm text-gray-400 line-through">₹{product.originalPrice.toFixed(2)}</p>
                        )}
                      </div>
                      <p className="text-sm opacity-80 mb-1">Stock: {product.stock}</p>
                      <p className="text-sm opacity-80 mb-4">Category: {product.category}</p>
                      <div className="mt-auto flex gap-2">
                        <button onClick={() => handleOpenModal(product)} className="flex-1 bg-white/10 text-[var(--text)] py-2 px-4 rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2" aria-label={`Edit ${product.name}`}>
                          <FontAwesomeIcon icon={faEdit} aria-hidden="true" /> Edit
                        </button>
                        <button onClick={() => adminDeleteProduct(product._id)} className="bg-red-500/20 text-red-400 py-2 px-4 rounded-lg font-medium hover:bg-red-500/40 transition-colors flex items-center justify-center gap-2" aria-label={`Delete ${product.name}`}>
                          <FontAwesomeIcon icon={faTrash} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <FontAwesomeIcon icon={faBoxOpen} className="text-6xl text-[var(--accent)] mb-4" aria-hidden="true" />
              <h3 className="text-2xl font-bold mb-2">No products found</h3>
              <p className="text-lg opacity-80">Adjust your search or filters.</p>
            </div>
          )}

          {!loading && allAppProducts.length > 0 && (
            <Pagination
              currentPage={allAppProductsMeta.page}
              totalPages={allAppProductsMeta.pages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </section>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingProduct ? 'Edit Product' : 'Add New Product'}>
        <ProductForm onSubmit={handleFormSubmit} initialData={editingProduct} />
      </Modal>
    </>
  );
};

export default AdminProductManagement;