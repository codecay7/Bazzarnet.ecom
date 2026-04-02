import React, { useState, useEffect, useCallback } from 'react';
import { Search, MessageSquareText, Filter, Loader2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import * as api from '../services/api';
import SupportTicketCard from '../components/SupportTicketCard';
import SupportTicketDetailModal from '../components/SupportTicketDetailModal';
import SkeletonText from '../components/SkeletonText';

const AdminSupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'Open', 'Resolved', 'Closed'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search: searchTerm,
        status: filterStatus === 'all' ? undefined : filterStatus,
      };
      const fetchedTickets = await api.admin.getSupportTickets(params);
      setTickets(fetchedTickets);
    } catch (error) {
      toast.error(`Failed to load support tickets: ${error.message}`);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterStatus]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleCardClick = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  const handleTicketUpdate = (updatedTicket) => {
    setTickets(prevTickets => 
      prevTickets.map(t => (t._id === updatedTicket._id ? updatedTicket : t))
    );
    setSelectedTicket(updatedTicket); // Update selected ticket in modal
  };

  return (
    <section className="w-full max-w-[1400px] my-10 mx-auto px-4 md:px-8">
      <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-8">
        <h2 className="text-3xl font-bold mb-6 md:text-4xl">Support Ticket Management</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text)] opacity-50" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 border border-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] pl-10 text-[var(--text)]"
              aria-label="Search support tickets"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text)] opacity-50" size={20} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full appearance-none p-3 rounded-lg bg-white/10 border border-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] pl-10 pr-8 text-[var(--text)]"
              aria-label="Filter by ticket status"
            >
              <option value="all">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--text)]" aria-hidden="true"><ChevronDown size={20} /></div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-black/10 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-pulse">
                <div className="flex-1 flex flex-col gap-2">
                  <SkeletonText width="150px" height="1rem" />
                  <SkeletonText width="200px" height="1rem" />
                  <SkeletonText width="80%" height="1.2rem" />
                  <SkeletonText width="90%" height="0.8rem" />
                </div>
                <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-2">
                  <SkeletonText width="80px" height="1.5rem" />
                  <SkeletonText width="120px" height="0.8rem" />
                </div>
              </div>
            ))}
          </div>
        ) : tickets.length > 0 ? (
          <div className="space-y-4" role="list">
            {tickets.map(ticket => (
              <SupportTicketCard key={ticket._id} ticket={ticket} onClick={handleCardClick} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <MessageSquareText size={64} className="text-[var(--accent)] mx-auto mb-4" />
            <p className="text-lg opacity-80">No support tickets found matching your criteria.</p>
          </div>
        )}
      </div>

      {selectedTicket && (
        <SupportTicketDetailModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          ticket={selectedTicket}
          onUpdate={handleTicketUpdate}
        />
      )}
    </section>
  );
};

export default AdminSupportTickets;