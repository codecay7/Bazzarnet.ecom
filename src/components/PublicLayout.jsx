"use client";

import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicHeader from './PublicHeader';
import Footer from './Footer';

const PublicLayout = () => {
  return (
    <>
      <PublicHeader />
      <main className="flex-1 flex flex-col items-center">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;