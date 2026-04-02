import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import CustomerDashboard from './CustomerDashboard'; // Updated import path
import VendorDashboard from './VendorDashboard';     // Updated import path
import LandingPage from './LandingPage';             // Updated import path

const Dashboard = () => {
  const { isLoggedIn, isVendor } = useContext(AppContext);

  if (isLoggedIn) {
    return isVendor ? <VendorDashboard /> : <CustomerDashboard />;
  }
  
  return <LandingPage />;
};

export default Dashboard;