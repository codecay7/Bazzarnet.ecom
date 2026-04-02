import React, { useContext, useState, useMemo, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import Modal from '../components/Modal';
import ProductForm from '../components/ProductForm';
import SkeletonCard from '../components/SkeletonCard';
import Pagination from '../components/Pagination';
import placeholderImage from '../assets/placeholder.png'; // Import placeholder image
import { getFullImageUrl } from '../utils/imageUtils'; // Import utility

const ManageProducts = () => {
  const { vendorProducts, vendorProductsMeta, fetchVendorProducts, addVendorProduct, editVendorProduct, deleteVendorProduct, user } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of products per page

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        store: user?.storeId, // Ensure products are filtered by the vendor's store
      };
      await fetchVendorProducts(params);
      setLoading(false);
    };
    if (user?.storeId) { // Only fetch if user is a vendor and has a storeId
      loadData();
    }
  }, [searchTerm, currentPage, fetchVendorProducts, user?.storeId]);

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
      editVendorProduct(editingProduct._id, productData); // Pass product _id for editing
    } else {
      addVendorProduct(productData);
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

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <>
      <section className="w-full max-w-[1200px] my-10">
        <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-8 mx-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-3xl font-bold md:text-4xl">Your Products</h2>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <label htmlFor="productSearch" className="sr-only">Search your products</label>
              <input
                type="text"
                id="productSearch"
                placeholder="Search your products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 p-2 rounded-lg bg-white/10 border border-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--text)]"
                aria-label="Search your products by name"
              />
              <button onClick={() => handleOpenModal()} className="bg-[var(--accent)] text-white py-2 px-6 rounded-lg font-medium flex items-center gap-2 hover:bg-[var(--accent-dark)] transition-colors" aria-label="Add new product">
                <FontAwesomeIcon icon={faPlus} aria-hidden="true" /> Add
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(itemsPerPage)].map((_, index) => (
                <SkeletonCard key={index} className="w-full" />
              ))}
            </div>
          ) : vendorProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
              {vendorProducts.map((product) => {
                const discount = calculateDiscount(product.price, product.originalPrice);
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
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded" aria-label={`${discount} percent off`}>{Math.round(discount)}% OFF</span>
                      )}
                    </div>
                    <div className="p-4 flex-grow flex-col">
                      <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
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
                        <button onClick={() => deleteVendorProduct(product._id)} className="bg-red-500/20 text-red-400 py-2 px-4 rounded-lg font-medium hover:bg-red-500/40 transition-colors flex items-center justify-center gap-2" aria-label={`Delete ${product.name}`}>
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
              <p className="text-lg opacity-80">Click "Add" to get started.</p>
            </div>
          )}

          {!loading && vendorProducts.length > 0 && (
            <Pagination
              currentPage={vendorProductsMeta.page}
              totalPages={vendorProductsMeta.pages}
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

export default ManageProducts;