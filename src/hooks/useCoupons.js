import { useState, useEffect, useCallback } from "react";
import toast from 'react-hot-toast'; // Import toast
import * as api from "/src/services/api.js";

/**
 * Custom hook to fetch and manage coupons.
 * Handles filtering, validation, and error fallback.
 */
const useCoupons = ({ isLoggedIn = false, orders = [], user = null } = {}) => {
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Define refetch directly as a useCallback function
  const refetch = useCallback(async () => {
    if (!isLoggedIn) {
      setAvailableCoupons([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch all active coupons. Backend will handle isActive filtering.
      const coupons = await api.coupon.getAll();

      if (!Array.isArray(coupons)) {
        throw new Error("Invalid coupons response: expected an array");
      }

      // Basic client-side filtering for valid structure
      const filteredCoupons = coupons.filter((c) => {
        if (!c || typeof c !== "object") return false;
        if (!c.code || typeof c.code !== "string") return false;
        // Ensure discountValue exists and is a number for display purposes
        if (typeof c.discountValue !== "number") return false;
        return true;
      });

      setAvailableCoupons(filteredCoupons);
    } catch (err) {
      console.error("❌ Failed to fetch coupons:", err);
      setError(err.message || "Failed to load coupons");
      toast.error(err.message || "Failed to load coupons"); // Show toast for error
      setAvailableCoupons([]);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]); // Dependency array for useCallback

  const applyCoupon = useCallback(
    async (code, cartTotal) => {
      if (!isLoggedIn || !user?._id) {
        toast.error('Please log in to apply coupons.');
        return false;
      }
      if (cartTotal <= 0) {
        toast.error('Cannot apply coupon to an empty or zero-value cart.');
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await api.coupon.validate(code, cartTotal);
        // The backend's validate endpoint returns the coupon object with discountAmount
        setAppliedCoupon(response.coupon);
        setDiscountAmount(response.coupon.discountAmount);
        toast.success(response.message);
        return true;
      } catch (err) {
        console.error("❌ Failed to apply coupon:", err);
        setError(err.message || "Failed to apply coupon");
        toast.error(err.message || "Failed to apply coupon");
        setAppliedCoupon(null);
        setDiscountAmount(0);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [isLoggedIn, user?._id]
  );

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  }, []);

  useEffect(() => {
    refetch(); // Call refetch directly here
  }, [refetch]); // Dependency array for useEffect

  return {
    availableCoupons,
    appliedCoupon,
    discountAmount,
    loading,
    error,
    refetch, // Return refetch directly
    applyCoupon,
    removeCoupon,
    setAppliedCoupon, // Expose setter
    setDiscountAmount, // Expose setter
  };
};

export default useCoupons;