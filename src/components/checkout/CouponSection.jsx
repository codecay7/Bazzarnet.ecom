import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Clipboard, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const inputClasses = "w-full p-2 rounded-lg bg-white/10 border border-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--text)] text-base md:text-lg";

const CouponSection = ({ currentTotalPrice, onNextStep, onPreviousStep }) => {
  const { availableCoupons, appliedCoupon, applyCoupon, removeCoupon } = useContext(AppContext);
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = async () => {
    if (couponInput.trim() === '') {
      toast.error('Please enter a coupon code.');
      return;
    }
    await applyCoupon(couponInput, currentTotalPrice);
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponInput('');
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code "${code}" copied!`);
  };

  return (
    <div className="max-w-[500px] mx-auto" role="region" aria-labelledby="coupon-heading">
      <h3 id="coupon-heading" className="text-2xl font-bold mb-4 text-center">Apply Coupon</h3>

      <div className="bg-black/10 p-6 rounded-xl mb-6">
        <h4 className="font-semibold text-lg mb-3 border-b border-white/20 pb-2">Enter Coupon Code</h4>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            className={inputClasses}
            aria-label="Coupon code input"
          />
          <button
            onClick={handleApplyCoupon}
            className="bg-[var(--accent)] text-white py-2 px-4 rounded-lg font-medium hover:bg-[var(--accent-dark)] transition-colors"
            aria-label="Apply coupon"
            disabled={!couponInput || (appliedCoupon && appliedCoupon.code === couponInput)}
          >
            Apply
          </button>
        </div>

        {appliedCoupon && (
          <div className="flex items-center justify-between bg-green-500/20 text-green-400 p-3 rounded-lg mb-4" role="status">
            <span className="font-medium flex items-center gap-2">
              <CheckCircle size={20} /> Coupon "{appliedCoupon.code}" Applied!
            </span>
            <button
              onClick={handleRemoveCoupon}
              className="text-red-400 hover:text-red-500 transition-colors"
              aria-label="Remove applied coupon"
            >
              <XCircle size={20} />
            </button>
          </div>
        )}

        <h4 className="font-semibold text-lg mb-3 border-b border-white/20 pb-2">Available Coupons</h4>
        {availableCoupons.length > 0 ? (
          <div className="space-y-3">
            {availableCoupons.map(coupon => (
              <div key={coupon._id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                <div>
                  <p className="font-semibold">{coupon.code}</p>
                  <p className="text-sm opacity-70">
                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}% off` : `₹${coupon.discountValue.toFixed(2)} off`}
                    {coupon.minOrderAmount > 0 && ` (Min. order ₹${coupon.minOrderAmount.toFixed(2)})`}
                    {coupon.isNewUserOnly && ` (New users only)`}
                  </p>
                </div>
                <button
                  onClick={() => handleCopyCode(coupon.code)}
                  className="text-[var(--accent)] hover:text-[var(--accent-dark)] transition-colors"
                  aria-label={`Copy coupon code ${coupon.code}`}
                >
                  <Clipboard size={20} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm opacity-70">No available coupons at the moment.</p>
        )}
      </div>
      <div className="flex justify-between gap-4">
        <button
          type="button"
          onClick={onPreviousStep}
          className="bg-white/10 text-[var(--text)] border-none py-3 px-6 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-white/20 transition-all duration-300 flex-1"
          aria-label="Go back to Address step"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNextStep}
          className="bg-[var(--accent)] text-white border-none py-3 px-6 rounded-lg flex items-center justify-center w-full gap-2 font-medium hover:bg-[var(--accent-dark)] transition-all duration-300 flex-1"
          aria-label="Proceed to Order Summary"
        >
          Proceed to Summary
        </button>
      </div>
    </div>
  );
};

export default CouponSection;