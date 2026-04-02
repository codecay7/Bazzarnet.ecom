import { useState, useEffect, useCallback, useContext } from 'react';
import toast from 'react-hot-toast';
import * as api from '../services/api';
import { AppContext } from '../context/AppContext'; // Import AppContext to get user role

const useMySupportTickets = () => {
  const { isLoggedIn, user, isVendor, isAdmin } = useContext(AppContext);
  const [myTickets, setMyTickets] = useState([]);
  const [loadingMyTickets, setLoadingMyTickets] = useState(true);
  const [errorMyTickets, setErrorMyTickets] = useState(null);

  const fetchMySupportTickets = useCallback(async () => {
    if (!isLoggedIn || !user?._id || isAdmin) { // Admins don't use this hook
      setMyTickets([]);
      setLoadingMyTickets(false);
      return;
    }

    setLoadingMyTickets(true);
    setErrorMyTickets(null);

    try {
      let fetchedTickets;
      if (isVendor) {
        fetchedTickets = await api.vendor.getMySupportTickets();
      } else { // Customer
        fetchedTickets = await api.customer.getMySupportTickets();
      }
      setMyTickets(fetchedTickets);
    } catch (err) {
      console.error("❌ Failed to fetch my support tickets:", err);
      setErrorMyTickets(err.message || "Failed to load your support tickets.");
      toast.error(err.message || "Failed to load your support tickets.");
      setMyTickets([]);
    } finally {
      setLoadingMyTickets(false);
    }
  }, [isLoggedIn, user?._id, isVendor, isAdmin]);

  useEffect(() => {
    fetchMySupportTickets();
  }, [fetchMySupportTickets]);

  // Function to update a single ticket in the state after admin response
  const updateMyTicketInList = useCallback((updatedTicket) => {
    setMyTickets(prevTickets => 
      prevTickets.map(t => (t._id === updatedTicket._id ? updatedTicket : t))
    );
  }, []);

  return {
    myTickets,
    loadingMyTickets,
    errorMyTickets,
    fetchMySupportTickets, // Expose refetch function
    updateMyTicketInList,
  };
};

export default useMySupportTickets;