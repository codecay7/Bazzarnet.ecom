import React from 'react';
import { MessageSquareText, User, Mail, Tag, Calendar, ChevronRight } from 'lucide-react';

const MySupportTicketCard = ({ ticket, onClick }) => {
  const getStatusClasses = (status) => {
    switch (status) {
      case 'Open': return 'bg-yellow-500/20 text-yellow-400';
      case 'Resolved': return 'bg-green-500/20 text-green-400';
      case 'Closed': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div 
      className="bg-black/10 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:bg-white/10 transition-colors duration-200"
      onClick={() => onClick(ticket)}
      role="listitem"
      aria-label={`Support ticket from ${ticket.name} with subject ${ticket.subject}`}
    >
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Tag size={16} className="text-[var(--accent)]" />
          <span className="font-semibold truncate">{ticket.subject}</span>
        </div>
        <p className="text-sm opacity-70 line-clamp-2">{ticket.message}</p>
      </div>
      <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-2">
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClasses(ticket.status)}`}>
          {ticket.status}
        </span>
        <div className="flex items-center gap-1 text-xs opacity-60">
          <Calendar size={14} />
          <span>{formatDate(ticket.createdAt)}</span>
        </div>
        <button 
          className="text-[var(--accent)] hover:underline flex items-center gap-1 text-sm mt-2"
          aria-label={`View details for ticket ${ticket._id}`}
        >
          View Details <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default MySupportTicketCard;