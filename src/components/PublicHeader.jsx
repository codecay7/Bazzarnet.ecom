"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';

const PublicHeader = () => {
  const navigate = useNavigate();
  return (
    <header className="py-4 bg-[var(--bg)] sticky top-0 z-[1000] rounded-b-2xl shadow-[0_4px_20px_var(--shadow)]">
      <div className="container mx-auto px-5 flex items-center justify-between">
        <span className="text-2xl font-bold text-[var(--accent)] md:text-3xl" aria-label="BazzarNet Home">BazzarNet</span>
        <button
          onClick={() => navigate('/login')}
          className="bg-[var(--accent)] text-white py-2 px-6 rounded-lg font-medium hover:bg-[var(--accent-dark)] transition-all duration-300"
          aria-label="Login to your account"
        >
          Login
        </button>
      </div>
    </header>
  );
};

export default PublicHeader;