import React, { useContext, useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faTruck, faHome, faUndoAlt, faSpinner } from '@fortawesome/free-solid-svg-icons'; // Added faSpinner for loading
import placeholderImage from '../assets/placeholder.png'; // Import placeholder image
import { getFullImageUrl } from '../utils/imageUtils'; // Import utility
import QRCode from 'react-qr-code'; // Ensure QRCode is imported
import * as api from '../services/api'; // Import API service
import toast from 'react-hot-toast'; // Import toast for error messages

// Helper function to format ISO timestamp
const formatTimestamp = (isoString) => {
  const date = new Date(isoString);
  const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
  const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true };
  const formattedDate = date.toLocaleDateString(undefined, optionsDate);
  const formattedTime = date.toLocaleTimeString(undefined, optionsTime);
  return `${formattedDate} at ${formattedTime}`;
};

const CustomerOrderDetails = () => {
  const { orderId } = useParams();
  const { orders } = useContext(AppContext); // Keep orders from context for initial check
  const [localOrder, setLocalOrder] = useState(null); // Local state for the specific order
  const [loadingLocalOrder, setLoadingLocalOrder] = useState(true); // Loading state for local fetch

  // Determine which order object to use: localOrder if fetched, otherwise from context
  const currentOrder = localOrder || orders.find(o => o._id === orderId);

  // Move useMemo here, before any conditional returns
  const steps = useMemo(() => {
    const currentStatus = currentOrder?.orderStatus || ''; // Use currentOrder
    return [
      { name: 'Ordered', completed: true, icon: faBox },
      { name: 'Processing', completed: ['Processing', 'Shipped', 'Delivered', 'Refunded'].includes(currentStatus), icon: faBox },
      { name: 'Shipped', completed: ['Shipped', 'Delivered', 'Refunded'].includes(currentStatus), icon: faTruck },
      { name: 'Delivered', completed: currentStatus === 'Delivered', icon: faHome },
    ];
  }, [currentOrder?.orderStatus]); // Dependency on currentOrder.orderStatus

  useEffect(() => {
    console.log(`Frontend: CustomerOrderDetails mounted for orderId: ${orderId}`);
    const fetchSpecificOrder = async () => {
      setLoadingLocalOrder(true);
      try {
        console.log(`Frontend: Attempting to fetch order ${orderId} via API.`);
        const fetchedOrder = await api.customer.getOrderById(orderId);
        console.log(`Frontend: Successfully fetched order ${orderId}:`, fetchedOrder);
        setLocalOrder(fetchedOrder);
      } catch (error) {
        console.error(`Frontend: Failed to fetch specific order details for ${orderId}:`, error);
        toast.error(`Failed to load order details: ${error.message}`);
        setLocalOrder(null); // Ensure localOrder is null on error
      } finally {
        setLoadingLocalOrder(false);
      }
    };

    // Fetch the specific order if it's not available in the context's orders array
    // or if the context's orders array is empty (e.g., direct navigation)
    if (!currentOrder) {
      console.log(`Frontend: Order ${orderId} not found in context, fetching directly.`);
      fetchSpecificOrder();
    } else {
      console.log(`Frontend: Order ${orderId} found in context, using it.`);
      setLoadingLocalOrder(false); // If found in context, no need to fetch, and not loading
    }
  }, [orderId, orders, currentOrder]); // Added currentOrder to dependencies to avoid infinite loop if it's null initially

  if (loadingLocalOrder) {
    return (
      <section className="w-full max-w-[1200px] my-10 text-center">
        <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-8 mx-4 flex flex-col items-center justify-center min-h-[300px]">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-[var(--accent)] mb-4" aria-hidden="true" />
          <h2 className="text-2xl font-bold">Loading Order Details...</h2>
        </div>
      </section>
    );
  }

  if (!currentOrder) {
    return (
      <section className="w-full max-w-[1200px] my-10 text-center">
        <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-8 mx-4">
          <h2 className="text-2xl font-bold mb-4">Order not found.</h2>
          <Link to="/orders" className="text-[var(--accent)] hover:underline">Back to Your Orders</Link>
        </div>
      </section>
    );
  }

  const getStatusClasses = (status) => {
    switch (status) {
      case 'Pending': return 'text-yellow-400';
      case 'Processing': return 'text-orange-400';
      case 'Shipped': return 'text-blue-400';
      case 'Delivered': return 'text-green-400';
      case 'Cancelled': return 'text-red-400';
      case 'Refunded': return 'text-purple-400';
      default: return 'text-[var(--accent)]';
    }
  };

  const isRefunded = currentOrder.orderStatus === 'Refunded';
  const isCancelled = currentOrder.orderStatus === 'Cancelled';

  return (
    <section className="w-full max-w-[1200px] my-10">
      <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-8 mx-4">
        <h2 className="text-3xl font-bold mb-2">Order Details</h2>
        <p className="text-lg text-[var(--text)] opacity-80 mb-2">Order ID: {currentOrder._id}</p>
        <p className="text-lg text-[var(--text)] opacity-80 mb-8">Order Placed: {formatTimestamp(currentOrder.createdAt)}</p>

        {/* Order Status & Tracker */}
        <div className="bg-black/10 p-6 rounded-xl mb-8">
          <h3 className="text-xl font-semibold mb-6">
            Order Status: <span className={`font-bold ${getStatusClasses(currentOrder.orderStatus)}`}>{currentOrder.orderStatus}</span>
          </h3>

          {isRefunded ? (
            <div className="text-center py-4">
              <FontAwesomeIcon icon={faUndoAlt} className="text-6xl text-purple-400 mb-4" aria-hidden="true" />
              <p className="text-2xl font-bold text-purple-400">This order has been refunded.</p>
              <p className="text-lg opacity-80 mt-2">The total amount of ₹{currentOrder.totalPrice.toFixed(2)} has been processed for refund.</p>
            </div>
          ) : isCancelled ? (
            <div className="text-center py-4">
              <FontAwesomeIcon icon={faUndoAlt} className="text-6xl text-red-400 mb-4" aria-hidden="true" />
              <p className="text-2xl font-bold text-red-400">This order has been cancelled.</p>
            </div>
          ) : (
            steps && steps.length > 0 && (
              <div className="flex items-center" role="progressbar" aria-valuenow={steps.filter(s => s.completed).length} aria-valuemin="0" aria-valuemax={steps.length} aria-label={`Order ${currentOrder._id} progress`}>
                {steps.map((step, index) => (
                  <React.Fragment key={step.name}>
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${step.completed ? 'bg-[var(--accent)] border-[var(--accent)] text-white' : 'bg-transparent border-gray-500 text-gray-500'}`} aria-hidden="true">
                        <FontAwesomeIcon icon={step.icon} size="lg" />
                      </div>
                      <p className={`text-sm mt-2 text-center ${step.completed ? 'font-semibold' : 'opacity-70'}`}>{step.name}</p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-1 mx-2 ${step.completed ? 'bg-[var(--accent)]' : 'bg-gray-500'}`} aria-hidden="true"></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )
          )}
        </div>

        {/* Payment & Transaction Details */}
        <div className="bg-black/10 p-6 rounded-xl mb-8">
          <h3 className="text-xl font-semibold mb-4">Payment Information</h3>
          <p className="mb-2"><strong>Payment Method:</strong> {currentOrder.paymentMethod}</p>
          <p><strong>Transaction ID:</strong> {currentOrder.transactionId || 'N/A'}</p>
        </div>

        {/* Shipping Address Display */}
        <div className="bg-black/10 p-6 rounded-xl mb-8">
            <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>
            <p>{currentOrder.shippingAddress.houseNo}, {currentOrder.shippingAddress.landmark ? currentOrder.shippingAddress.landmark + ', ' : ''}{currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} - {currentOrder.shippingAddress.pinCode}</p>
            <p>Mobile: {currentOrder.shippingAddress.mobile}</p> {/* NEW: Display mobile */}
        </div>

        {/* Items List */}
        <div className="bg-black/10 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Items in Your Order</h3>
          <div className="space-y-4" role="list">
            {(currentOrder.items || []).map(item => (
              <div key={item.product} className="flex items-center gap-4 bg-black/10 p-3 rounded-lg" role="listitem" aria-label={`Item: ${item.name}, Quantity: ${item.quantity}, Price: ₹{(item.price * item.quantity).toFixed(2)}`}>
                <img 
                  src={getFullImageUrl(item.image)} 
                  alt={item.name} 
                  className="w-16 h-16 object-cover rounded-md" 
                  onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }} // Fallback image
                />
                <div className="flex-grow">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm opacity-80">Quantity: {item.quantity} {item.unit}</p>
                </div>
                <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="text-right mt-4 pt-4 border-t border-white/20">
            <p className="text-xl font-bold">Total: ₹{currentOrder.totalPrice.toFixed(2)}</p>
          </div>
        </div>
        
        {/* OTP and QR Code Section (only for non-refunded/cancelled orders) */}
        {!isRefunded && !isCancelled && currentOrder.deliveryOtp && (
          <div className="bg-black/10 p-6 rounded-lg max-w-md mx-auto mt-8">
              <h3 className="text-xl font-semibold mb-4">Delivery Confirmation</h3>
              <p className="mb-4">Please show this QR code to the delivery person to confirm your order.</p>
              <div className="flex justify-center mb-4 p-2 bg-white rounded-lg">
                  <QRCode value={JSON.stringify({ orderId: currentOrder._id, deliveryOtp: currentOrder.deliveryOtp || 'N/A' })} size={180} level="H" className="rounded-lg" aria-label={`QR code for order ${currentOrder._id} with OTP ${currentOrder.deliveryOtp || 'N/A'}`} />
              </div>
              <p className="text-lg font-bold">OTP: <span className="text-[var(--accent)]">{currentOrder.deliveryOtp || 'N/A'}</span></p>
              <p className="text-sm opacity-80 mt-2">The delivery person will scan this QR or ask for the OTP.</p>
          </div>
        )}

        <div className="text-center mt-8">
            <Link to="/orders" className="bg-[var(--accent)] text-white py-2 px-6 rounded-lg font-medium hover:bg-[var(--accent-dark)] transition-all duration-300">
                Back to All Orders
            </Link>
        </div>
      </div>
    </section>
  );
};

export default CustomerOrderDetails;