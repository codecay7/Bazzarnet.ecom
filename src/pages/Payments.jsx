import React, { useState, useMemo, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { AppContext } from '../context/AppContext';
import * as api from '../services/api';
import SkeletonText from '../components/SkeletonText'; // Assuming you might need a skeleton for loading

const Payments = () => {
  const { user } = useContext(AppContext); // Removed simulateLoading
  const [activeTab, setActiveTab] = useState('all');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPayments = async () => {
    // Ensure user and user._id exist before attempting to fetch
    if (!user || !user._id) {
      setPayments([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // Corrected: Pass user._id as vendorId to the API
      const fetchedPayments = await api.vendor.getPayments(user._id, { status: activeTab === 'all' ? undefined : activeTab, search: searchTerm });
      setPayments(fetchedPayments);
    } catch (error) {
      toast.error(`Failed to load payments: ${error.message}`);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [activeTab, user, searchTerm]); // Re-fetch when tab, user, or search term changes

  const getStatusClasses = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-500/20 text-green-400';
      case 'Pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'Failed':
        return 'bg-red-500/20 text-red-400';
      case 'Refunded':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const handleReportIssue = async (paymentId) => {
    try {
      const response = await api.vendor.reportPaymentIssue(paymentId);
      toast.success(response.message);
      // Re-fetch payments to update the status if needed
      fetchPayments();
    } catch (error) {
      toast.error(`Error reporting issue: ${error.message}`);
    }
  };

  return (
    <section className="w-full max-w-[1200px] my-10">
      <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-8 mx-4">
        <h2 className="text-3xl font-bold mb-6 md:text-4xl">Payments Overview</h2>

        <div className="flex justify-center bg-black/10 rounded-lg p-1 mb-8 max-w-md mx-auto" role="tablist">
          <button
            onClick={() => setActiveTab('all')}
            className={`w-1/3 py-2 rounded-md font-semibold transition-colors duration-300 ${activeTab === 'all' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text)]'}`}
            role="tab"
            aria-selected={activeTab === 'all'}
            aria-controls="all-payments-panel"
            id="all-payments-tab"
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('Paid')}
            className={`w-1/3 py-2 rounded-md font-semibold transition-colors duration-300 ${activeTab === 'Paid' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text)]'}`}
            role="tab"
            aria-selected={activeTab === 'Paid'}
            aria-controls="paid-payments-panel"
            id="paid-payments-tab"
          >
            Paid
          </button>
          <button
            onClick={() => setActiveTab('Pending')}
            className={`w-1/3 py-2 rounded-md font-semibold transition-colors duration-300 ${activeTab === 'Pending' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text)]'}`}
            role="tab"
            aria-selected={activeTab === 'Pending'}
            aria-controls="pending-payments-panel"
            id="pending-payments-tab"
          >
            Pending
          </button>
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 border border-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--text)]"
            aria-label="Search payments"
          />
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-black/10 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-pulse">
                <div className="flex-1">
                  <SkeletonText width="100px" height="1.5rem" className="mb-1" />
                  <SkeletonText width="150px" height="1rem" />
                </div>
                <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-2">
                  <SkeletonText width="80px" height="1rem" />
                  <SkeletonText width="100px" height="1.5rem" />
                </div>
              </div>
            ))}
          </div>
        ) : payments.length > 0 ? (
          <div className="space-y-4" role="tabpanel" id={`${activeTab}-payments-panel`} aria-labelledby={`${activeTab}-payments-tab`}>
            {payments.map((payment) => (
              <div key={payment._id} className="bg-black/10 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4" role="listitem" aria-label={`Payment ${payment._id} for order ${payment.order?._id}, amount ₹${payment.amount.toFixed(2)}, status ${payment.status}`}>
                <div className="flex-1 text-center md:text-left">
                  <p className="font-bold text-lg">₹{payment.amount.toFixed(2)}</p>
                  <p className="text-sm opacity-70">Order: {payment.order?._id.substring(0, 8)}...</p>
                  <p className="text-xs opacity-60">Trans ID: {payment.transactionId.substring(0, 8)}...</p>
                </div>
                <div className="text-center">
                  <p className="text-sm opacity-70">Date</p>
                  <p>{new Date(payment.paymentDate).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClasses(payment.status)}`}>
                    {payment.status}
                  </span>
                  {payment.status === 'Pending' || payment.status === 'Failed' ? (
                    <button
                      onClick={() => handleReportIssue(payment._id)}
                      className="bg-red-500/20 text-red-400 py-2 px-4 rounded-lg font-medium hover:bg-red-500/40 transition-colors flex items-center justify-center gap-2"
                      title="Report Issue"
                      aria-label={`Report issue for payment ${payment._id}`}
                    >
                      <FontAwesomeIcon icon={faExclamationCircle} aria-hidden="true" />
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg opacity-80 py-10">No {activeTab} payments found.</p>
        )}
      </div>
    </section>
  );
};

export default Payments;