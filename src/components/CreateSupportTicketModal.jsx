import React from 'react';
import Modal from './Modal';
import SupportForm from './SupportForm';

const CreateSupportTicketModal = ({ isOpen, onClose, onTicketCreated }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit a New Support Request">
      <SupportForm onClose={onClose} onSuccess={onTicketCreated} />
    </Modal>
  );
};

export default CreateSupportTicketModal;