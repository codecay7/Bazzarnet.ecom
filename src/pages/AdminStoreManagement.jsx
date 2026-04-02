import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Store, Search, Trash2, Edit, ToggleLeft, ToggleRight, Building2 } from 'lucide-react';
import SkeletonText from '../components/SkeletonText';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import StoreForm from '../components/StoreForm';
import toast from 'react-hot-toast';
import placeholderImage from '../assets/placeholder.png'; // Import placeholder image
import { getFullImageUrl } from '../utils/imageUtils'; // Import utility

const AdminStoreManagement = () => {
  const { appStores, appStoresMeta, fetchAppStores, adminUpdateStore, adminDeleteStore } = useContext(AppContext); // Removed simulateLoading
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive'
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const itemsPerPage = 8;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Removed await simulateLoading(800); // REMOVED
      
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: filterStatus === 'all' ? undefined : (filterStatus === 'active' ? true : false),
      };
      await fetchAppStores(params);
      setLoading(false);
    };
    loadData();
  }, [searchTerm, filterStatus, currentPage, fetchAppStores]); // Removed simulateLoading from dependencies

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const handleOpenModal = (store = null) => {
    setEditingStore(store);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStore(null);
  };

  const handleFormSubmit = async (storeData) => {
    if (editingStore) {
      await adminUpdateStore(editingStore._id, storeData);
    } else {
      // Admin adding a store would require assigning an owner (user ID)
      // For simplicity, this form is currently only for editing existing stores.
      toast.error("Admin can only edit existing stores in this demo. Adding new stores requires assigning an owner.");
    }
    handleCloseModal();
  };

  const getStatusClasses = (isActive) => {
    return isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400';
  };

  return (
    <>
      <section className="w-full max-w-[1400px] my-10 mx-auto px-4 md:px-8">
        <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-6 md:text-4xl">Store Management</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text)] opacity-50" size={20} />
              <input
                type="text"
                placeholder="Search by store name or owner email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/10 border border-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] pl-10 text-[var(--text)]"
                aria-label="Search stores"
              />
            </div>

            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full appearance-none p-3 rounded-lg bg-white/10 border border-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] pr-8 text-[var(--text)]"
                aria-label="Filter by store status"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--text)]" aria-hidden="true"><Building2 size={20} /></div>
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
          ) : appStores.length > 0 ? (
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
              <table className="min-w-full divide-y divide-white/10">
                <thead>
                  <tr className="text-left text-sm font-medium text-gray-400">
                    <th scope="col" className="px-4 py-3">Logo</th>
                    <th scope="col" className="px-4 py-3">Store Name</th>
                    <th scope="col" className="px-4 py-3">Owner</th>
                    <th scope="col" className="px-4 py-3">Category</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                    <th scope="col" className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {appStores.map((store) => (
                    <tr key={store._id} className="hover:bg-black/5 transition-colors duration-200">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <img 
                          src={getFullImageUrl(store.logo)} 
                          alt={`${store.name} logo`} 
                          className="w-10 h-10 rounded-full object-cover" 
                          onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }} // Fallback image
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">{store.name}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <p>{store.owner?.name || 'N/A'}</p>
                        <p className="text-xs opacity-70">{store.owner?.email || 'N/A'}</p>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">{store.category}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(store.isActive)}`}>
                          {store.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => adminUpdateStore(store._id, { isActive: !store.isActive })}
                            className={`p-2 rounded-full transition-colors duration-200 ${
                              store.isActive ? 'bg-red-500/20 hover:bg-red-500/40 text-red-400' : 'bg-green-500/20 hover:bg-green-500/40 text-green-400'
                            }`}
                            title={store.isActive ? 'Deactivate Store' : 'Activate Store'}
                            aria-label={store.isActive ? `Deactivate ${store.name}` : `Activate ${store.name}`}
                          >
                            {store.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                          </button>
                          <button
                            onClick={() => handleOpenModal(store)}
                            className="p-2 rounded-full bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 transition-colors duration-200"
                            title="Edit Store"
                            aria-label={`Edit ${store.name}`}
                          >
                            <Edit size={20} />
                          </button>
                          <button
                            onClick={() => adminDeleteStore(store._id, store.name)}
                            className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors duration-200"
                            title="Delete Store"
                            aria-label={`Delete ${store.name}`}
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
            <p className="text-center text-lg opacity-80 py-10">No stores found matching your criteria.</p>
          )}

          {!loading && appStores.length > 0 && (
            <Pagination
              currentPage={appStoresMeta.page}
              totalPages={appStoresMeta.pages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </section>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingStore ? 'Edit Store' : 'Add New Store'}>
        <StoreForm onSubmit={handleFormSubmit} initialData={editingStore} />
      </Modal>
    </>
  );
};

export default AdminStoreManagement;