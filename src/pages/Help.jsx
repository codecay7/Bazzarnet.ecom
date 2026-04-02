import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Modal from '../components/Modal'; // Import the Modal component
import SupportForm from '../components/SupportForm'; // Import the new SupportForm

const Help = () => {
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const handleOpenSupportModal = () => {
    setIsSupportModalOpen(true);
  };

  const handleCloseSupportModal = () => {
    setIsSupportModalOpen(false);
  };

  return (
    <section className="w-full max-w-[1200px] my-10">
      <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-8 mx-4">
        <h2 className="text-3xl font-bold mb-6 md:text-4xl text-center">How Can We Help You?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-black/10 p-6 rounded-xl flex flex-col items-center text-center shadow-lg hover:-translate-y-1 transition-transform duration-300">
            <FontAwesomeIcon icon={faQuestionCircle} className="text-5xl text-[var(--accent)] mb-4" aria-hidden="true" />
            <h3 className="text-xl font-semibold mb-2">Visit our FAQ</h3>
            <p className="text-base opacity-80 mb-4">Find answers to common questions about BazzarNet.</p>
            <a href="/faq" className="bg-[var(--accent)] text-white py-2 px-6 rounded-lg font-medium hover:bg-[var(--accent-dark)] transition-colors" aria-label="Go to Frequently Asked Questions page">
              Go to FAQ
            </a>
          </div>

          <div className="bg-black/10 p-6 rounded-xl flex flex-col items-center text-center shadow-lg hover:-translate-y-1 transition-transform duration-300">
            <FontAwesomeIcon icon={faEnvelope} className="text-5xl text-[var(--accent)] mb-4" aria-hidden="true" />
            <h3 className="text-xl font-semibold mb-2">Email Support</h3>
            <p className="text-base opacity-80 mb-4">Send us an email and we'll get back to you within 24 hours.</p>
            <button 
              onClick={handleOpenSupportModal} 
              className="bg-[var(--accent)] text-white py-2 px-6 rounded-lg font-medium hover:bg-[var(--accent-dark)] transition-colors" 
              aria-label="Open email support form"
            >
              Send Email
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={isSupportModalOpen} onClose={handleCloseSupportModal} title="Submit a Support Request">
        <SupportForm onClose={handleCloseSupportModal} />
      </Modal>
    </section>
  );
};

export default Help;