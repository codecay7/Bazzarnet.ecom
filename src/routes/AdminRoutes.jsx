import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';

// Lazy-loaded admin page components
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const AdminUserManagement = lazy(() => import('../pages/AdminUserManagement'));
const AdminProductManagement = lazy(() => import('../pages/AdminProductManagement'));
const AdminOrderManagement = lazy(() => import('../pages/AdminOrderManagement'));
const AdminStoreManagement = lazy(() => import('../pages/AdminStoreManagement'));
const AdminSupportTickets = lazy(() => import('../pages/AdminSupportTickets')); // NEW: Import AdminSupportTickets
const CustomerOrderDetails = lazy(() => import('../pages/CustomerOrderDetails')); // Re-use for admin order details

const AdminRoutes = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen text-2xl font-semibold text-[var(--accent)]">
        Loading...
      </div>
    }>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-users" element={<AdminUserManagement />} />
          <Route path="/admin-products" element={<AdminProductManagement />} />
          <Route path="/admin-orders" element={<AdminOrderManagement />} />
          <Route path="/admin-orders/:orderId" element={<CustomerOrderDetails />} />
          <Route path="/admin-stores" element={<AdminStoreManagement />} />
          <Route path="/admin-support-tickets" element={<AdminSupportTickets />} /> {/* NEW: Admin Support Tickets route */}
          {/* Redirect any other logged-in admin routes to admin dashboard */}
          <Route path="*" element={<Navigate to="/admin-dashboard" />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;