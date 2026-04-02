import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import * as api from '../services/api';

const useOrders = (isLoggedIn, user, isVendor, isAdmin) => {
  const [orders, setOrders] = useState([]);
  const [ordersMeta, setOrdersMeta] = useState({ page: 1, pages: 1, count: 0 });

  const fetchOrders = useCallback(async (params = {}) => {
    if (!isLoggedIn || !user?._id) {
      // console.log('useOrders: Not logged in or user ID missing. Skipping fetch.'); // Removed log
      setOrders([]);
      setOrdersMeta({ page: 1, pages: 1, count: 0 });
      return;
    }
    // console.log('useOrders: Attempting to fetch orders for user:', user._id, 'with role:', user.role, 'and params:', params); // Removed log
    try {
      let fetchedOrdersData;
      if (isAdmin) {
        fetchedOrdersData = await api.admin.getOrders(params);
        // console.log('useOrders: Admin orders fetched:', fetchedOrdersData); // Removed log
      } else if (isVendor) {
        fetchedOrdersData = await api.vendor.getOrders(user.storeId, params);
        // console.log('useOrders: Vendor orders fetched:', fetchedOrdersData); // Removed log
      } else { // Customer
        fetchedOrdersData = await api.customer.getOrders(user._id, params);
        // console.log('useOrders: Customer orders fetched:', fetchedOrdersData); // Removed log
      }
      setOrders(fetchedOrdersData.orders);
      setOrdersMeta({ page: fetchedOrdersData.page, pages: fetchedOrdersData.pages, count: fetchedOrdersData.count });
      // console.log('useOrders: Orders state updated. Orders:', fetchedOrdersData.orders, 'Meta:', fetchedOrdersData.pages); // Removed log
    } catch (error) {
      console.error('useOrders: Failed to load orders:', error);
      toast.error(`Failed to load orders: ${error.message}`);
      setOrders([]);
      setOrdersMeta({ page: 1, pages: 1, count: 0 });
    }
  }, [isLoggedIn, user?._id, isAdmin, isVendor, user?.storeId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    if (!isLoggedIn || (!isVendor && !isAdmin)) {
      toast.error('You are not authorized to update order status.');
      return;
    }
    try {
      await api.admin.updateOrderStatus(orderId, newStatus); // Admin API for now, can be split for vendor
      fetchOrders({ page: ordersMeta.page, limit: 5 }); // Re-fetch orders to update the list
      toast.success(`Order ${orderId} status updated to ${newStatus}.`);
    } catch (error) {
      toast.error(`Error updating order status: ${error.message}`);
    }
  }, [isLoggedIn, isVendor, isAdmin, fetchOrders, ordersMeta.page]);

  const confirmDeliveryWithOtp = useCallback(async (orderId, enteredOtp) => {
    if (!isLoggedIn || !isVendor) {
      toast.error('You must be a vendor to confirm delivery.');
      return false;
    }
    try {
      const response = await api.vendor.confirmDelivery(orderId, enteredOtp);
      fetchOrders({ page: ordersMeta.page, limit: 5 }); // Re-fetch orders to update the list
      toast.success(response.message);
      return true;
    } catch (error) {
      toast.error(`Error confirming delivery: ${error.message}`);
      return false;
    }
  }, [isLoggedIn, isVendor, fetchOrders, ordersMeta.page]);

  return {
    orders,
    ordersMeta,
    fetchOrders,
    updateOrderStatus,
    confirmDeliveryWithOtp,
    setOrders,
    setOrdersMeta, // Explicitly return the setter for meta data
  };
};

export default useOrders;