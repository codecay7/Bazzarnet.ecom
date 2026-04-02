import React, { useContext, useMemo, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import { Wallet, Package, Users, Tag, Search, Calendar as CalendarIcon } from 'lucide-react';
import StatCard from '../components/StatCard'; // Corrected import path
import { useNavigate } from 'react-router-dom';
import SkeletonText from '../components/SkeletonText';
import * as api from '../services/api'; // Import API service
import placeholderImage from '../assets/placeholder.png'; // Import placeholder image
import { getFullImageUrl } from '../utils/imageUtils'; // Import utility

const VendorDashboard = () => {
  const { user } = useContext(AppContext); // Removed simulateLoading
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchVendorDashboardStats = async () => {
    if (!user || !user.storeId) return;
    setLoading(true);
    try {
      const stats = await api.vendor.getDashboardStats(user._id); // Pass user._id as vendorId
      setDashboardData(stats);
    } catch (error) {
      toast.error(`Failed to load vendor dashboard stats: ${error.message}`);
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorDashboardStats();
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

  return (
    <div className="w-full max-w-[1400px] mx-auto my-10 px-4 md:px-8">
      {loading || !dashboardData ? (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <SkeletonText width="200px" height="2rem" className="mb-2" />
              <SkeletonText width="150px" height="1.2rem" />
            </div>
            <SkeletonText width="250px" height="2.5rem" />
          </div>

          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
              <SkeletonText width="200px" height="1.8rem" />
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <SkeletonText width="120px" height="2.5rem" />
                <SkeletonText width="120px" height="2.5rem" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-6 flex flex-col gap-4 animate-pulse">
                  <div className="flex items-center justify-between">
                    <SkeletonText width="80px" height="1rem" />
                    <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
                  </div>
                  <div>
                    <SkeletonText width="100px" height="2rem" className="mb-1" />
                    <SkeletonText width="60px" height="0.8rem" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SkeletonText width="150px" height="1.8rem" className="mb-4" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-6 animate-pulse">
                <SkeletonText width="50%" height="1.5rem" className="mb-4" />
                <div className="w-full h-300px bg-gray-700 rounded"></div>
              </div>
              <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-6 animate-pulse">
                <SkeletonText width="50%" height="1.5rem" className="mb-4" />
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
                      <div className="flex-1">
                        <SkeletonText width="80%" height="1rem" className="mb-1" />
                        <SkeletonText width="60%" height="0.8rem" />
                      </div>
                      <SkeletonText width="50px" height="1rem" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
              <p className="text-lg text-[var(--text)] opacity-80">Here's your store overview.</p>
            </div>
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text)] opacity-50" size={20} />
              <input type="text" placeholder="Search orders, products..." className="w-full md:w-64 bg-black/10 border border-white/10 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
            </div>
          </div>

          {/* Dashboard Overview */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Dashboard Overview</h2>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <div className="relative">
                  <select className="w-full appearance-none bg-black/10 border border-white/10 rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]">
                    <option>This Month</option>
                    <option>Last Month</option>
                    <option>This Year</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--text)] opacity-50"><Tag size={16} /></div>
                </div>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text)] opacity-50" size={20} />
                  <input type="text" placeholder="dd/mm/yyyy" className="w-36 bg-black/10 border border-white/10 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={<Wallet />} title="Total Revenue" value={`₹${dashboardData.totalRevenue.toLocaleString('en-IN')}`} change="+12% this month" />
              <div onClick={() => navigate('/orders')} className="cursor-pointer">
                <StatCard icon={<Package />} title="Total Orders" value={dashboardData.totalOrders} change="+5% this month" />
              </div>
              <StatCard icon={<Users />} title="Customers" value={dashboardData.uniqueCustomers} change="+8% this month" />
              <div onClick={() => navigate('/manage-products')} className="cursor-pointer">
                <StatCard icon={<Tag />} title="Products" value={dashboardData.totalProducts} change="+2 this month" />
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4">Sales Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboardData.salesTrend} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis dataKey="_id" stroke="var(--text)" /> {/* Use _id for date */}
                    <YAxis stroke="var(--text)" tickFormatter={(value) => `₹${value/100000}L`} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)' }} formatter={(value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value)} />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="var(--accent)" strokeWidth={2} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4">Fast Selling Items</h3>
                <div className="space-y-4">
                  {dashboardData.fastSellingItems.map(product => (
                    <div 
                      key={product._id} 
                      onClick={() => navigate('/manage-products')} 
                      className="flex items-center gap-4 cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-colors"
                    >
                      <img 
                        src={getFullImageUrl(product.image)} 
                        alt={product.name} 
                        className="w-12 h-12 object-cover rounded-lg" 
                        onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }} // Fallback image
                      />
                      <div className="flex-1">
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-sm opacity-70">{product.sales} units sold</p>
                      </div>
                      <p className="font-bold text-[var(--accent)]">₹{product.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VendorDashboard;