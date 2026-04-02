import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import * as api from '../services/api';

const useCart = (isLoggedIn, user, isVendor, isAdmin) => {
  const [cart, setCart] = useState([]);

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn || !user?._id || isVendor || isAdmin) {
      console.log('fetchCart: Clearing cart due to user status (not logged in, or is vendor/admin).');
      setCart([]); // Clear cart if not logged in or not a customer
      return;
    }
    try {
      const userCart = await api.customer.getCart();
      console.log('fetchCart: Successfully fetched cart:', userCart.items);
      setCart(userCart.items);
    } catch (error) {
      console.error('fetchCart: Failed to load cart:', error);
      toast.error(`Failed to load cart: ${error.message}`);
      setCart([]); // Clear cart on error
    }
  }, [isLoggedIn, user?._id, isVendor, isAdmin]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(async (product) => {
    if (!isLoggedIn || !user?._id) {
      toast.error('Please log in to add items to your cart.');
      return;
    }
    try {
      // Determine the actual product ID and unit.
      // If 'product' is a wishlist item (which has a nested 'product' object), use item.product._id and item.product.unit
      // Otherwise, assume 'product' is a direct product object.
      const actualProductId = product.product?._id || product._id;
      const actualUnit = product.product?.unit || product.unit;

      const response = await api.customer.addToCart(actualProductId, 1, actualUnit);
      setCart(response.items);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error(`Error adding to cart: ${error.message}`);
    }
  }, [isLoggedIn, user?._id]);

  const removeFromCart = useCallback(async (productId) => {
    if (!isLoggedIn || !user?._id) return;
    console.log('useCart: removeFromCart called with productId:', productId); // NEW LOG
    try {
      const response = await api.customer.removeFromCart(productId);
      setCart(response.items);
      toast.error(`Item removed from cart.`);
    } catch (error) {
      toast.error(`Error removing from cart: ${error.message}`);
    }
  }, [isLoggedIn, user?._id]);
  
  const updateCartQuantity = useCallback(async (productId, quantity) => {
    if (!isLoggedIn || !user?._id) return;
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    try {
      const response = await api.customer.updateCartItem(productId, quantity);
      setCart(response.items);
    } catch (error) {
      toast.error(`Error updating cart quantity: ${error.message}`);
    }
  }, [isLoggedIn, user?._id, removeFromCart]);

  const checkout = useCallback(async (orderDetails) => {
    if (!isLoggedIn || !user?._id) {
      toast.error('Please log in to place an order.');
      return null;
    }

    // Client-side stock validation before proceeding to backend
    for (const item of cart) {
      if (item.product.stock < item.quantity) {
        toast.error(`"${item.name}" is out of stock or does not have enough quantity available. Please adjust your cart.`);
        return null; // Prevent checkout
      }
    }

    console.log('useCart: Sending orderDetails to API:', orderDetails);
    console.log('useCart: Items in orderDetails:', orderDetails.items);

    try {
      const newOrder = await api.customer.placeOrder(orderDetails);
      setCart([]); // Clear cart after successful order
      toast.success('Order placed successfully!');
      return newOrder;
    } catch (error) {
      toast.error(`Error placing order: ${error.message}`);
      return null;
    }
  }, [isLoggedIn, user?._id, cart]); // Added cart to dependencies

  return {
    cart,
    fetchCart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    checkout,
    setCart // Expose setCart for external updates if needed (e.g., after login)
  };
};

export default useCart;