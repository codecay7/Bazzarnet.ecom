import React, { useState, useContext } from 'react';
import Modal from './Modal';
import { User, Mail, Tag, MessageSquareText, Calendar, CheckCircle, XCircle, Edit, Save, Loader2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import * as api from '../services/api';
import { AppContext } from '../context/AppContext';

const inputClasses = "w-full p-2 rounded-lg bg-white/10 border border-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--text)]";

const SupportTicketDetailModal = ({ isOpen, onClose, ticket, onUpdate }) => {
  const { user } = useContext(AppContext);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState(ticket?.status || 'Open');
  const [adminNotes, setAdminNotes] = useState(ticket?.adminNotes || '');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (ticket) {
      setNewStatus(ticket.status);
      setAdminNotes(ticket.adminNotes || '');
      setIsEditingStatus(false); // Reset editing state when ticket changes
    }
  }, [ticket]);

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

  const handleStatusUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await api.admin.updateSupportTicketStatus(ticket._id, {
        status: newStatus,
        adminNotes: adminNotes,
      });
      toast.success(response.message);
      onUpdate(response.ticket); // Pass the updated ticket back to parent
      setIsEditingStatus(false);
    } catch (error) {
      toast.error(error.message || 'Failed to update ticket status.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Ticket #${ticket._id.substring(0, 8)}...`}>
      <div className="space-y-6">
        <div className="bg-black/10 p-4 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 border-b border-white/20 pb-2">Requester Details</h4>
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
          {ticket.status === 'Resolved' && ticket.resolvedAt && (
            <div className="flex items-center gap-3 mt-2 text-green-400">
              <CheckCircle size={20} />
              <p className="opacity-70">Resolved: {formatDate(ticket.resolvedAt)} by {ticket.resolvedBy?.name || 'Admin'}</p>
            </div>
          )}
        </div>

        <div className="bg-black/10 p-4 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 border-b border-white/20 pb-2">Admin Actions</h4>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <p className="font-medium">Current Status:</p>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClasses(ticket.status)}`}>
                {ticket.status}
              </span>
            </div>
            {!isEditingStatus ? (
              <button
                onClick={() => setIsEditingStatus(true)}
                className="bg-white/10 text-[var(--text)] py-1.5 px-4 rounded-lg flex items-center gap-2 font-medium hover:bg-white/20 transition-colors"
                aria-label="Edit ticket status"
              >
                <Edit size={16} /> Edit
              </button>
            ) : (
              <button
                onClick={() => setIsEditingStatus(false)}
                className="bg-red-500/20 text-red-400 py-1.5 px-4 rounded-lg flex items-center gap-2 font-medium hover:bg-red-500/40 transition-colors"
                aria-label="Cancel editing status"
              >
                <XCircle size={16} /> Cancel
              </button>
            )}
          </div>

          {isEditingStatus && (
            <div className="space-y-4">
              <div className="relative">
                <label htmlFor="newStatus" className="block text-sm font-medium mb-1">Update Status</label>
                <select
                  id="newStatus"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className={`${inputClasses} appearance-none pr-8`}
                  disabled={isLoading}
                >
                  <option value="Open">Open</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 top-8 flex items-center px-2 text-[var(--text)]" aria-hidden="true"><ChevronDown size={20} /></div>
              </div>
              <div>
                <label htmlFor="adminNotes" className="block text-sm font-medium mb-1">Admin Notes (Optional)</label>
                <textarea
                  id="adminNotes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows="3"
                  className={inputClasses}
                  placeholder="Add internal notes about this ticket..."
                  disabled={isLoading}
                ></textarea>
              </div>
              <button
                onClick={handleStatusUpdate}
                className="bg-[var(--accent)] text-white py-2 px-6 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-[var(--accent-dark)] transition-colors w-full"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                {isLoading ? 'Saving...' : 'Save Status'}
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SupportTicketDetailModal;