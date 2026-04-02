import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import placeholderImage from '../../assets/placeholder.png'; // Corrected import path
import { getFullImageUrl } from '../../utils/imageUtils'; // Import utility

const OrderSummary = ({ cart, subtotal, total, shippingAddress, appliedCoupon, discountAmount, onEditAddress, onNextStep, onPreviousStep }) => {
  const displayAddress = (address) => {
    if (!address) return 'N/A';
    const parts = [address.houseNo];
    if (address.landmark) parts.push(address.landmark);
    parts.push(address.city);
    parts.push(address.state);
    parts.push(address.pinCode);
    if (address.mobile) parts.push(`Mob: ${address.mobile}`); // NEW: Include mobile
    return parts.filter(Boolean).join(', ');
  };

  return (
    <div className="max-w-[600px] mx-auto" role="region" aria-labelledby="summary-heading">
      <h3 id="summary-heading" className="text-2xl font-bold mb-4 text-center">Order Summary</h3>
      <div className="bg-black/10 p-6 rounded-xl mb-6">
        <h4 className="font-semibold text-lg mb-3 border-b border-white/20 pb-2">Items in Cart</h4>
        <ul className="space-y-3" role="list">
          {cart.map(item => (
            <li key={item.product._id} className="flex justify-between items-center" role="listitem">
              <div className="flex items-center gap-3">
                <img 
                  src={getFullImageUrl(item.image)} 
                  alt={item.name} 
                  className="w-12 h-12 object-cover rounded-md" 
                  onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }} // Fallback image
                />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm opacity-70">Qty: {item.quantity} {item.unit}</p> {/* Display unit */}
                </div>
              </div>
              <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
            </li>
          ))}
        </ul>
        <div className="border-t border-white/20 pt-4 mt-4 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <p className="text-base font-medium">Subtotal:</p>
            <p className="text-base font-medium">₹{subtotal.toFixed(2)}</p>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between items-center text-green-400">
              <p className="text-base font-medium">Coupon ({appliedCoupon.code}):</p>
              <p className="text-base font-medium">- ₹{discountAmount.toFixed(2)}</p>
            </div>
          )}
          <div className="flex justify-between items-center pt-2 border-t border-white/10">
            <p className="text-xl font-bold">Total:</p>
            <p className="text-xl font-bold text-[var(--accent)]">₹{total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="bg-black/10 p-6 rounded-xl mb-6">
        <h4 className="font-semibold text-lg mb-3 border-b border-white/20 pb-2">Shipping Address</h4>
        <p className="opacity-80">
          {displayAddress(shippingAddress)}
        </p>
        <button
          type="button"
          onClick={onEditAddress}
          className="text-[var(--accent)] text-sm mt-2 hover:underline"
          aria-label="Edit shipping address"
        >
          Edit Address
        </button>
      </div>

      <div className="flex justify-between gap-4">
        <button
          type="button"
          onClick={onPreviousStep}
          className="bg-white/10 text-[var(--text)] border-none py-3 px-6 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-white/20 transition-all duration-300 flex-1"
          aria-label="Go back to Address step"
        >
          <FontAwesomeIcon icon={faChevronLeft} aria-hidden="true" /> Back
        </button>
        <button
          type="button"
          onClick={onNextStep}
          className="bg-[var(--accent)] text-white border-none py-3 px-6 rounded-lg flex items-center justify-center w-full gap-2 font-medium hover:bg-[var(--accent-dark)] transition-all duration-300 flex-1"
          aria-label="Proceed to Payment"
        >
          Proceed to Payment <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;