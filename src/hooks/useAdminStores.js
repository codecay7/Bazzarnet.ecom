import { useCallback } from 'react';
import toast from 'react-hot-toast';
import * as api from '../services/api';

const useAdminStores = (isLoggedIn, isAdmin, fetchAppStores, appStoresMeta, fetchAllProducts) => {
  const adminUpdateStore = useCallback(async (storeId, updatedStoreData) => {
    if (!isLoggedIn || !isAdmin) {
      toast.error('You must be an admin to update stores.');
      return;
    }
    try {
      await api.admin.updateStore(storeId, updatedStoreData);
      fetchAppStores({ page: appStoresMeta.page, limit: 8 }); // Re-fetch all stores
      toast.success('Store updated by Admin!');
    } catch (error) {
      toast.error(`Error updating store by Admin: ${error.message}`);
    }
  }, [isLoggedIn, isAdmin, fetchAppStores, appStoresMeta.page]);

  const adminDeleteStore = useCallback(async (storeId, storeName) => {
    if (!isLoggedIn || !isAdmin) {
      toast.error('You must be an admin to delete stores.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete the store "${storeName}"? This will also delete all associated products.`)) {
      return;
    }
    try {
      const response = await api.admin.deleteStore(storeId);
      fetchAppStores({ page: appStoresMeta.page, limit: 8 }); // Re-fetch all stores
      fetchAllProducts(); // Also re-fetch all products as store deletion cascades
      toast.success(response.message);
    } catch (error) {
      toast.error(`Error deleting store by Admin: ${error.message}`);
    }
  }, [isLoggedIn, isAdmin, fetchAppStores, appStoresMeta.page, fetchAllProducts]);

  return {
    adminUpdateStore,
    adminDeleteStore,
  };
};

export default useAdminStores;