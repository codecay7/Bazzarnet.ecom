import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UserSignupForm from '../components/UserSignupForm';
import VendorRegistrationForm from '../components/VendorRegistrationForm';

const Register = () => {
  const [activeTab, setActiveTab] = useState('user');

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[var(--bg-body)] p-4">
      <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl flex flex-col p-8 shadow-[0_8px_40px_var(--shadow)] w-full max-w-[500px] mx-4 text-center text-[var(--auth-text)]">
        <h2 className="text-3xl font-bold mb-6 text-[var(--accent)]">Create Your Account</h2>
        
        <div className="flex justify-center bg-black/10 rounded-lg p-1 mb-6" role="tablist">
          <button
            onClick={() => setActiveTab('user')}
            className={`w-1/2 py-2 rounded-md font-semibold transition-colors duration-300 ${activeTab === 'user' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text)]'}`}
            role="tab"
            aria-selected={activeTab === 'user'}
            aria-controls="user-signup-panel"
            id="user-signup-tab"
          >
            I'm a Customer
          </button>
          <button
            onClick={() => setActiveTab('vendor')}
            className={`w-1/2 py-2 rounded-md font-semibold transition-colors duration-300 ${activeTab === 'vendor' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text)]'}`}
            role="tab"
            aria-selected={activeTab === 'vendor'}
            aria-controls="vendor-signup-panel"
            id="vendor-signup-tab"
          >
            I'm a Vendor
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'user' ? (
            <div key="user" role="tabpanel" id="user-signup-panel" aria-labelledby="user-signup-tab">
              <UserSignupForm />
            </div>
          ) : (
            <div key="vendor" role="tabpanel" id="vendor-signup-panel" aria-labelledby="vendor-signup-tab">
              <VendorRegistrationForm />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Register;