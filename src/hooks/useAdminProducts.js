import { useCallback } from 'react';
import toast from 'react-hot-toast';
import * as api from '../services/api';

const useAdminProducts = (isLoggedIn, isAdmin, fetchAllProducts, allAppProductsMeta) => {
  const adminEditProduct = useCallback(async (productId, updatedProduct) => {
    if (!isLoggedIn || !isAdmin) {
      toast.error('You must be an admin to edit products.');
      return;
    }
    try {
      await api.admin.updateProduct(productId, updatedProduct);
      fetchAllProducts({ page: allAppProductsMeta.page, limit: 6 }); // Re-fetch all products
      toast.success('Product updated by Admin!');
    } catch (error) {
      toast.error(`Error updating product by Admin: ${error.message}`);
    }
  }, [isLoggedIn, isAdmin, fetchAllProducts, allAppProductsMeta.page]);

  const adminDeleteProduct = useCallback(async (productId) => {
    if (!isLoggedIn || !isAdmin) {
      toast.error('You must be an admin to delete products.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }
    try {
      await api.admin.deleteProduct(productId);
      fetchAllProducts({ page: allAppProductsMeta.page, limit: 6 }); // Re-fetch all products
      toast.error('Product deleted by Admin.');
    } catch (error) {
      toast.error(`Error deleting product by Admin: ${error.message}`);
    }
  }, [isLoggedIn, isAdmin, fetchAllProducts, allAppProductsMeta.page]);

  return {
    adminEditProduct,
    adminDeleteProduct,
  };
};

export default useAdminProducts;