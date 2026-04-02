import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col items-center">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;