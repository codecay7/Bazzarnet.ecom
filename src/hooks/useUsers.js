import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import * as api from '../services/api';

const useUsers = (isLoggedIn, isAdmin, fetchAllProducts, fetchAppStores) => {
  const [allAppUsers, setAllAppUsers] = useState([]);
  const [allAppUsersMeta, setAllAppUsersMeta] = useState({ page: 1, pages: 1, count: 0 });

  const fetchAllUsers = useCallback(async (params = {}) => {
    if (!isLoggedIn || !isAdmin) {
      setAllAppUsers([]);
      setAllAppUsersMeta({ page: 1, pages: 1, count: 0 });
      return;
    }
    try {
      const { users, page, pages, count } = await api.admin.getUsers(params);
      setAllAppUsers(users);
      setAllAppUsersMeta({ page, pages, count });
    } catch (error) {
      toast.error(`Failed to load users: ${error.message}`);
      setAllAppUsers([]);
      setAllAppUsersMeta({ page: 1, pages: 1, count: 0 });
    }
  }, [isLoggedIn, isAdmin]);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const deleteUser = useCallback(async (userId, userName) => {
    if (!isLoggedIn || !isAdmin) {
      toast.error('You must be an admin to delete users.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }
    try {
      const response = await api.admin.deleteUser(userId);
      fetchAllUsers({ page: allAppUsersMeta.page, limit: 8 }); // Re-fetch users
      fetchAllProducts(); // Re-fetch products and stores to reflect cascading deletions
      fetchAppStores();
      toast.success(response.message);
    } catch (error) {
      toast.error(`Error deleting user: ${error.message}`);
    }
  }, [isLoggedIn, isAdmin, fetchAllUsers, allAppUsersMeta.page, fetchAllProducts, fetchAppStores]);

  const updateUserStatus = useCallback(async (userId, newStatus) => {
    if (!isLoggedIn || !isAdmin) {
      toast.error('You must be an admin to update user status.');
      return;
    }
    try {
      const response = await api.admin.updateUserStatus(userId, newStatus);
      fetchAllUsers({ page: allAppUsersMeta.page, limit: 8 }); // Re-fetch users
      toast.success(response.message);
    } catch (error) {
      toast.error(`Error updating user status: ${error.message}`);
    }
  }, [isLoggedIn, isAdmin, fetchAllUsers, allAppUsersMeta.page]);

  return {
    allAppUsers,
    allAppUsersMeta,
    fetchAllUsers,
    deleteUser,
    updateUserStatus,
    setAllAppUsers,
    setAllAppUsersMeta, // Explicitly return the setter for meta data
  };
};

export default useUsers;