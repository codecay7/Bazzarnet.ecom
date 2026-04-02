import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import * as api from '../services/api'; // Corrected import statement

const useVendorProducts = (isLoggedIn, isVendor, user) => {
  const [vendorProducts, setVendorProducts] = useState([]);
  const [vendorProductsMeta, setVendorProductsMeta] = useState({ page: 1, pages: 1, count: 0 });

  const fetchVendorProducts = useCallback(async (params = {}) => {
    if (!isLoggedIn || !isVendor || !user?.storeId) {
      setVendorProducts([]);
      setVendorProductsMeta({ page: 1, pages: 1, count: 0 });
      return;
    }
    try {
      const { products, page, pages, count } = await api.vendor.getProducts({ ...params, store: user.storeId });
      setVendorProducts(products);
      setVendorProductsMeta({ page, pages, count });
    } catch (error) {
      toast.error(`Failed to load vendor products: ${error.message}`);
      setVendorProducts([]);
      setVendorProductsMeta({ page: 1, pages: 1, count: 0 });
    }
  }, [isLoggedIn, isVendor, user?.storeId]);

  useEffect(() => {
    fetchVendorProducts();
  }, [fetchVendorProducts]);

  const addVendorProduct = useCallback(async (newProduct) => {
    if (!isLoggedIn || !isVendor || !user?.storeId) {
      toast.error('You must be a logged-in vendor to add products.');
      return;
    }
    try {
      await api.vendor.addProduct(newProduct);
      fetchVendorProducts({ page: vendorProductsMeta.page, limit: 6 }); // Re-fetch to update list
      toast.success(`${newProduct.name} added to your store!`);
    } catch (error) {
      toast.error(`Error adding product: ${error.message}`);
    }
  }, [isLoggedIn, isVendor, user?.storeId, fetchVendorProducts, vendorProductsMeta.page]);

  const editVendorProduct = useCallback(async (productId, updatedProduct) => {
    if (!isLoggedIn || !isVendor || !user?.storeId) {
      toast.error('You must be a logged-in vendor to edit products.');
      return;
    }
    try {
      await api.vendor.updateProduct(productId, updatedProduct);
      fetchVendorProducts({ page: vendorProductsMeta.page, limit: 6 }); // Re-fetch to update list
      toast.success('Product updated!');
    } catch (error) {
      toast.error(`Error updating product: ${error.message}`);
    }
  }, [isLoggedIn, isVendor, user?.storeId, fetchVendorProducts, vendorProductsMeta.page]);

  const deleteVendorProduct = useCallback(async (productId) => {
    if (!isLoggedIn || !isVendor || !user?.storeId) {
      toast.error('You must be a logged-in vendor to delete products.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    try {
      await api.vendor.deleteProduct(productId);
      fetchVendorProducts({ page: vendorProductsMeta.page, limit: 6 }); // Re-fetch to update list
      toast.error('Product deleted.');
    } catch (error) {
      toast.error(`Error deleting product: ${error.message}`);
    }
  }, [isLoggedIn, isVendor, user?.storeId, fetchVendorProducts, vendorProductsMeta.page]);

  return {
    vendorProducts,
    vendorProductsMeta,
    fetchVendorProducts,
    addVendorProduct,
    editVendorProduct,
    deleteVendorProduct,
    setVendorProducts,
    setVendorProductsMeta,
  };
};

export default useVendorProducts;