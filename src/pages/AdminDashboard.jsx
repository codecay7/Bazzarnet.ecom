import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { Users, ShoppingBag, Package, Settings, Bell, Store } from 'lucide-react';
import SkeletonText from '../components/SkeletonText';
import * as api from '../services/api'; // Import API service

const AdminDashboard = () => {
  const { user } = useContext(AppContext); // Removed simulateLoading
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchAdminDashboardStats = async () => {
    setLoading(true);
    try {
      const stats = await api.admin.getDashboardStats();
      setDashboardData(stats);
    } catch (error) {
      toast.error(`Failed to load admin dashboard stats: ${error.message}`);
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminDashboardStats();
  }, [user]); // Re-fetch if user changes (e.g., login/logout)

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--tooltip-bg)] text-[var(--tooltip-text)] p-2 rounded-md shadow-lg border border-white/10 text-sm">
          <p className="font-bold">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const COLORS_VENDOR_STATUS = ['#4CAF50', '#FFC107', '#F44336']; // Green, Yellow, Red
  const COLORS_USER_STATUS = ['#2196F3', '#607D8B']; // Blue, Grey
  const COLORS_ORDER_COMPLETION = ['#FFC107', '#FFA500', '#2196F3', '#4CAF50', '#F44336']; // Yellow, Orange, Blue, Green, Red
  const COLORS_SALES_TREND = ['#00BCD4', '#2196F3']; // Cyan, Blue

  return (
    <div className="w-full max-w-[1400px] mx-auto my-10 px-4 md:px-8">
      {loading || !dashboardData ? (
        <>
          <SkeletonText width="250px" height="2.5rem" className="mb-2" />
          <SkeletonText width="200px" height="1.5rem" className="mb-8" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-6 animate-pulse">
              <SkeletonText width="60%" height="1.5rem" className="mb-2" />
              <SkeletonText width="40%" height="2rem" />
            </div>
            <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-6 animate-pulse">
              <SkeletonText width="60%" height="1.5rem" className="mb-2" />
              <SkeletonText width="40%" height="2rem" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-6 h-[350px] animate-pulse">
              <SkeletonText width="50%" height="1.5rem" className="mb-4" />
              <div className="w-full h-[250px] bg-gray-700 rounded"></div>
            </div>
            <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-6 h-[350px] animate-pulse">
              <SkeletonText width="50%" height="1.5rem" className="mb-4" />
              <div className="w-full h-[250px] bg-gray-700 rounded"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-6 h-[350px] animate-pulse">
              <SkeletonText width="50%" height="1.5rem" className="mb-4" />
              <div className="w-full h-[250px] bg-gray-700 rounded"></div>
            </div>
            <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-6 h-[350px] animate-pulse">
              <SkeletonText width="50%" height="1.5rem" className="mb-4" />
              <div className="w-full h-[250px] bg-gray-700 rounded"></div>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h1>
          <p className="text-lg text-[var(--text)] opacity-80 mb-8">Admin Overview</p>

          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-2">Total Revenue</h3>
              <p className="text-4xl font-bold text-[var(--accent)]">{formatCurrency(dashboardData.totalRevenue)}</p>
            </div>
            <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-2">Active Users</h3>
              <p className="text-4xl font-bold text-[var(--accent)]">{dashboardData.activeUsers}</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Vendor Status Chart */}
            <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4">Vendor Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.vendorStatus} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="name" stroke="var(--text)" />
                  <YAxis stroke="var(--text)" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Vendors">
                    {dashboardData.vendorStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_VENDOR_STATUS[index % COLORS_VENDOR_STATUS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* User Status Donut Chart */}
            <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4">User Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardData.userStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                  >
                    {dashboardData.userStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_USER_STATUS[index % COLORS_USER_STATUS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Completion Donut Chart */}
            <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4">Order Completion</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardData.orderCompletion}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                  >
                    {dashboardData.orderCompletion.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_ORDER_COMPLETION[index % COLORS_ORDER_COMPLETION.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Sales Trend Bar Chart */}
            <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4">Sales Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.salesTrend} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="name" stroke="var(--text)" />
                  <YAxis stroke="var(--text)" tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="sales" name="Sales">
                    {dashboardData.salesTrend.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_SALES_TREND[index % COLORS_SALES_TREND.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;