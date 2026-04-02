import React, { useContext, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faBoxOpen, faCheckCircle, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import Pagination from '../components/Pagination';

const Orders = () => {
  const { isVendor, orders, ordersMeta, fetchOrders, /* simulateLoading, */ user } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of orders per page
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Removed await simulateLoading(800); // Removed this line - REMOVED
      
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        // status: filterStatus, // Add status filter if needed
      };
      console.log('Orders Page: Fetching orders with params:', params); // ADDED LOG
      console.log('Orders Page: Current user for fetching orders:', user); // ADDED LOG
      if (user?._id && (isVendor ? user.storeId : true)) { // Only fetch if user is logged in and has relevant IDs
        await fetchOrders(params);
      } else {
        console.log('Orders Page: Not fetching orders because user is not logged in or missing storeId for vendor.'); // ADDED LOG
      }
      setLoading(false);
    };
    loadData();
  }, [searchTerm, currentPage, fetchOrders, user, isVendor]); // Removed simulateLoading from dependencies

  const getStatusInfo = (status) => {
    switch (status) {
      case 'Shipped':
        return { icon: faMapMarkerAlt, color: 'text-blue-400' };
      case 'Delivered':
        return { icon: faCheckCircle, color: 'text-green-400' };
      default:
        return { icon: faBoxOpen, color: 'text-gray-400' };
    }
  };

  const handleViewDetails = (orderId) => {
    if (isVendor) {
      navigate(`/orders/${orderId}`);
    } else {
      navigate(`/my-orders/${orderId}`);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  console.log('Orders Page: Current loading state:', loading); // ADDED LOG
  console.log('Orders Page: Current orders array:', orders); // ADDED LOG
  console.log('Orders Page: Current ordersMeta:', ordersMeta); // ADDED LOG

  return (
    <section className="w-full max-w-[1200px] my-10">
      <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-8 mx-4">
        <h2 className="text-3xl font-bold mb-5 md:text-4xl">{isVendor ? 'Store Orders' : 'Your Orders'}</h2>
        
        <div className="mb-8">
          <label htmlFor="orderSearch" className="sr-only">Search orders</label>
          <input
            type="text"
            id="orderSearch"
            placeholder="Search by Order ID or items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 border border-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--text)]"
            aria-label="Search orders by ID or item name"
          />
        </div>

        {loading ? (
          <div className="space-y-6">
            {[...Array(itemsPerPage)].map((_, index) => (
              <div key={index} className="bg-black/10 p-6 rounded-xl animate-pulse">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  </div>
                  <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-3">
                    <div className="h-5 bg-gray-700 rounded w-24"></div>
                    <div className="h-10 bg-gray-700 rounded-lg w-32"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6" role="list">
            {orders.map(order => {
              const statusInfo = getStatusInfo(order.orderStatus); // Use orderStatus
              return (
                <div key={order._id} className="bg-black/10 rounded-2xl p-6 transition-all duration-300" role="listitem" aria-label={`Order ${order._id}, total ₹${order.totalPrice.toFixed(2)}, status ${order.orderStatus}`}>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold md:text-2xl mb-2">Order {order._id.substring(0, 8)}...</h3>
                      <p className="text-base md:text-lg"><strong>Total:</strong> ₹{order.totalPrice.toFixed(2)}</p>
                    </div>
                    <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-3">
                      <div className={`flex items-center gap-2 font-semibold ${statusInfo.color}`}>
                        <FontAwesomeIcon icon={statusInfo.icon} aria-hidden="true" />
                        <span>{order.orderStatus}</span>
                      </div>
                      <button
                        className="bg-[var(--accent)] w-full md:w-fit text-white border-none py-2 px-6 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-[var(--accent-dark)] transition-all duration-300"
                        onClick={() => handleViewDetails(order._id)}
                        aria-label={`View details for order ${order._id}`}
                      >
                        View Details <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-lg opacity-80">No orders found matching your search.</p>
        )}

        {!loading && orders.length > 0 && (
          <Pagination
            currentPage={ordersMeta.page}
            totalPages={ordersMeta.pages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </section>
  );
};

export default Orders;