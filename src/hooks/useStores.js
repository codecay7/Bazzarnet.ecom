import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import * as api from '../services/api';

const useStores = () => {
  const [appStores, setAppStores] = useState([]);
  const [appStoresMeta, setAppStoresMeta] = useState({ page: 1, pages: 1, count: 0 });

  const fetchAppStores = useCallback(async (params = {}) => {
    try {
      const { stores, page, pages, count } = await api.stores.getAll(params);
      setAppStores(stores);
      setAppStoresMeta({ page, pages, count });
    } catch (error) {
      toast.error(`Failed to load stores: ${error.message}`);
      setAppStores([]);
      setAppStoresMeta({ page: 1, pages: 1, count: 0 });
    }
  }, []);

  useEffect(() => {
    fetchAppStores();
  }, [fetchAppStores]);

  return {
    appStores,
    appStoresMeta,
    fetchAppStores,
    setAppStores, // Expose for admin store updates
    setAppStoresMeta, // Explicitly return the setter for meta data
  };
};

export default useStores;