import React from 'react';
import Modal from './Modal';
import { User, Mail, Tag, MessageSquareText, Calendar, CheckCircle } from 'lucide-react';

const MySupportTicketDetailModal = ({ isOpen, onClose, ticket }) => {
  if (!ticket) return null;

  const getStatusClasses = (status) => {
    switch (status) {
      case 'Open': return 'bg-yellow-500/20 text-yellow-400';
      case 'Resolved': return 'bg-green-500/20 text-green-400';
      case 'Closed': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`My Ticket #${ticket._id.substring(0, 8)}...`}>
      <div className="space-y-6">
        <div className="bg-black/10 p-4 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 border-b border-white/20 pb-2">Your Details</h4>
          <div className="flex items-center gap-3 mb-2">
            <User size={20} className="text-[var(--accent)]" />
            <p className="font-medium">{ticket.name} <span className="opacity-70">({ticket.role})</span></p>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={20} className="text-[var(--accent)]" />
            <p className="opacity-80 break-all">{ticket.email}</p>
          </div>
        </div>

        <div className="bg-black/10 p-4 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 border-b border-white/20 pb-2">Ticket Information</h4>
          <div className="flex items-center gap-3 mb-2">
            <Tag size={20} className="text-[var(--accent)]" />
            <p className="font-medium">{ticket.subject}</p>
          </div>
          <div className="flex items-start gap-3 mb-2">
            <MessageSquareText size={20} className="text-[var(--accent)] flex-shrink-0 mt-1" />
            <p className="opacity-80 whitespace-pre-wrap">{ticket.message}</p>
          </div>
          <div className="flex items-center gap-3">
            <Calendar size={20} className="text-[var(--accent)]" />
            <p className="opacity-70">Submitted: {formatDate(ticket.createdAt)}</p>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <p className="font-medium">Status:</p>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClasses(ticket.status)}`}>
              {ticket.status}
            </span>
          </div>
          {ticket.status === 'Resolved' && ticket.resolvedAt && (
            <div className="flex items-center gap-3 mt-2 text-green-400">
              <CheckCircle size={20} />
              <p className="opacity-70">Resolved: {formatDate(ticket.resolvedAt)}</p>
            </div>
          )}
        </div>

        {ticket.adminNotes && (
          <div className="bg-black/10 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 border-b border-white/20 pb-2">Admin Response/Notes</h4>
            <p className="opacity-80 whitespace-pre-wrap">{ticket.adminNotes}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default MySupportTicketDetailModal;