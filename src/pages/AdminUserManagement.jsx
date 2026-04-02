import React, { useContext, useState, useMemo, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { User, Store, Search, ToggleLeft, ToggleRight, Trash2, CheckCircle, XCircle } from 'lucide-react';
import SkeletonText from '../components/SkeletonText';
import Pagination from '../components/Pagination';
import toast from 'react-hot-toast';
import * as api from '../services/api'; // Import API service

const AdminUserManagement = () => {
  const { allAppUsers, allAppUsersMeta, fetchAllUsers, deleteUser, updateUserStatus } = useContext(AppContext); // Removed simulateLoading
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all'); // 'all', 'customer', 'vendor'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive'
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Removed await simulateLoading(800); // Simulate network delay - REMOVED
      
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        role: filterRole === 'all' ? undefined : filterRole,
        status: filterStatus === 'all' ? undefined : filterStatus,
      };
      await fetchAllUsers(params);
      setLoading(false);
    };
    loadData();
  }, [searchTerm, filterRole, filterStatus, currentPage, fetchAllUsers]); // Removed simulateLoading from dependencies

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setCurrentPage(1); // Reset page to 1 when filters change
  }, [searchTerm, filterRole, filterStatus]);

  return (
    <section className="w-full max-w-[1400px] my-10 mx-auto px-4 md:px-8">
      <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-8">
        <h2 className="text-3xl font-bold mb-6 md:text-4xl">User Management</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text)] opacity-50" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 border border-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] pl-10 text-[var(--text)]"
              aria-label="Search users"
            />
          </div>

          <div className="relative">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full appearance-none p-3 rounded-lg bg-white/10 border border-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] pr-8 text-[var(--text)]"
              aria-label="Filter by role"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="vendor">Vendors</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--text)]" aria-hidden="true"><User size={20} /></div>
          </div>

          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full appearance-none p-3 rounded-lg bg-white/10 border border-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] pr-8 text-[var(--text)]"
              aria-label="Filter by status"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--text)]" aria-hidden="true"><CheckCircle size={20} /></div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(itemsPerPage)].map((_, index) => (
              <div key={index} className="bg-black/10 p-4 rounded-xl flex items-center gap-4 animate-pulse">
                <SkeletonText width="50px" height="1.5rem" />
                <div className="flex-1">
                  <SkeletonText width="70%" height="1.2rem" className="mb-1" />
                  <SkeletonText width="50%" height="1rem" />
                </div>
                <SkeletonText width="80px" height="1.5rem" />
                <SkeletonText width="100px" height="2.5rem" />
                <SkeletonText width="40px" height="2.5rem" />
              </div>
            ))}
          </div>
        ) : allAppUsers.length > 0 ? (
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            <table className="min-w-full divide-y divide-white/10">
              <thead>
                <tr className="text-left text-sm font-medium text-gray-400">
                  <th scope="col" className="px-4 py-3">ID</th>
                  <th scope="col" className="px-4 py-3">Name</th>
                  <th scope="col" className="px-4 py-3">Email</th>
                  <th scope="col" className="px-4 py-3">Role</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {allAppUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-black/5 transition-colors duration-200">
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{user._id.substring(0, 6)}...</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">{user.name}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{user.email}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm capitalize">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'vendor' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => updateUserStatus(user._id, !user.isActive)}
                          className={`p-2 rounded-full transition-colors duration-200 ${
                            user.isActive ? 'bg-red-500/20 hover:bg-red-500/40 text-red-400' : 'bg-green-500/20 hover:bg-green-500/40 text-green-400'
                          }`}
                          title={user.isActive ? 'Deactivate User' : 'Activate User'}
                          aria-label={user.isActive ? `Deactivate ${user.name}` : `Activate ${user.name}`}
                        >
                          {user.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                        </button>
                        <button
                          onClick={() => deleteUser(user._id, user.name)}
                          className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors duration-200"
                          title="Delete User"
                          aria-label={`Delete ${user.name}`}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-lg opacity-80 py-10">No users found matching your criteria.</p>
        )}

        {!loading && allAppUsers.length > 0 && (
          <Pagination
            currentPage={allAppUsersMeta.page}
            totalPages={allAppUsersMeta.pages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </section>
  );
};

export default AdminUserManagement;