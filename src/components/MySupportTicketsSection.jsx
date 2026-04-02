import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquareText, Search, Filter, Loader2, ChevronDown, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import * as api from '../services/api';
import MySupportTicketCard from './MySupportTicketCard'; // NEW: Import MySupportTicketCard
import MySupportTicketDetailModal from './MySupportTicketDetailModal';
import SkeletonText from './SkeletonText';
import CreateSupportTicketModal from './CreateSupportTicketModal';
import useMySupportTickets from '../hooks/useMySupportTickets';

const MySupportTicketsSection = () => {
  const { myTickets, loadingMyTickets, errorMyTickets, fetchMySupportTickets, updateMyTicketInList } = useMySupportTickets();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'Open', 'Resolved', 'Closed'
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // Renamed for clarity
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // NEW: State for create modal

  useEffect(() => {
    // Refetch tickets when filters change
    fetchMySupportTickets();
  }, [searchTerm, filterStatus, fetchMySupportTickets]);

  const handleCardClick = (ticket) => {
    setSelectedTicket(ticket);
    setIsDetailModalOpen(true);
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
    setSelectedTicket(null);
  };

  const handleCreateModalOpen = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
  };

  const handleNewTicketCreated = () => {
    fetchMySupportTickets(); // Refresh the list of tickets
    handleCreateModalClose(); // Close the modal
  };

  const filteredTickets = myTickets.filter(ticket => {
    const matchesSearch = searchTerm
      ? ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.message.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesStatus = filterStatus === 'all' ? true : ticket.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4"> {/* NEW: Flex container for title and button */}
        <h3 className="text-2xl font-bold flex items-center gap-3">
          <MessageSquareText className="text-[var(--accent)]" /> My Support Tickets
        </h3>
        <button
          onClick={handleCreateModalOpen}
          className="bg-[var(--accent)] text-white py-2 px-4 rounded-lg flex items-center gap-2 font-medium hover:bg-[var(--accent-dark)] transition-colors"
          aria-label="Create new support ticket"
        >
          <PlusCircle size={20} /> Create Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text)] opacity-50" size={20} />
          <input
            type="text"
            placeholder="Search by subject or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 border border-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] pl-10 text-[var(--text)]"
            aria-label="Search your support tickets"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text)] opacity-50" size={20} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full appearance-none p-3 rounded-lg bg-white/10 border border-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] pl-10 pr-8 text-[var(--text)]"
            aria-label="Filter your tickets by status"
          >
            <option value="all">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 top-1/2 -translate-y-1/2 flex items-center px-2 text-[var(--text)]" aria-hidden="true"><ChevronDown size={20} /></div>
        </div>
      </div>

      {loadingMyTickets ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-black/10 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-pulse">
              <div className="flex-1 flex flex-col gap-2">
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
      ) : errorMyTickets ? (
        <p className="text-center text-red-400 text-lg py-10">{errorMyTickets}</p>
      ) : filteredTickets.length > 0 ? (
        <div className="space-y-4" role="list">
          {filteredTickets.map(ticket => (
            <MySupportTicketCard key={ticket._id} ticket={ticket} onClick={handleCardClick} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <MessageSquareText size={64} className="text-[var(--accent)] mx-auto mb-4" />
          <p className="text-lg opacity-80">No support tickets found.</p>
        </div>
      )}

      {selectedTicket && (
        <MySupportTicketDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleDetailModalClose}
          ticket={selectedTicket}
        />
      )}

      {/* NEW: Create Support Ticket Modal */}
      <CreateSupportTicketModal
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
        onTicketCreated={handleNewTicketCreated}
      />
    </div>
  );
};

export default MySupportTicketsSection;