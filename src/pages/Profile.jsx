import React, { useContext, useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { AppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import * as api from '../services/api';
import useFormValidation from '../hooks/useFormValidation';
import { useSearchParams } from 'react-router-dom'; // NEW: Import useSearchParams

// Import modular components
import CustomerProfileForm from '../components/profile/CustomerProfileForm';
import VendorProfileForm from '../components/profile/VendorProfileForm';
import MySupportTicketsSection from '../components/MySupportTicketsSection';

const Profile = () => {
  const { user, isVendor, updateUserInContext } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams(); // NEW: Initialize useSearchParams
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile'); // NEW: Set initial activeTab from URL or default to 'profile'

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    store: user?.store || '', // Only for vendors
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || { 
      houseNo: '',
      landmark: '',
      city: '',
      state: '',
      pinCode: '',
      mobile: '',
    },
    pan: user?.pan || '', // Only for vendors
    gst: user?.gst || '', // Only for vendors
    category: user?.category || '', // Only for vendors
    description: user?.description || '', // Only for vendors
    bankAccount: user?.bankAccount || '', // Only for vendors
    bankName: user?.bankName || '', // Only for vendors
    ifsc: user?.ifsc || '', // Only for vendors
    upiId: user?.upiId || '', // Added for customer
    cardDetails: user?.cardDetails || {
      cardNumber: '',
      expiry: '',
      cardHolder: ''
    },
    profileImage: user?.profileImage || null,
  });
  const [originalProfileData, setOriginalProfileData] = useState(null);

  // Define validation logic based on user role
  const profileValidationLogic = useCallback((data) => {
    let newErrors = {};

    if (!data.name.trim()) {
      newErrors.name = 'Name is required.';
    } else if (data.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters long.';
    }

    if (data.phone && !/^\+?\d{10,15}$/.test(data.phone)) {
      newErrors.phone = 'Phone number is invalid.';
    }

    // Address validation
    if (data.address) {
      if (!data.address.houseNo.trim()) {
        newErrors.address = { ...newErrors.address, houseNo: 'House No. is required.' };
      }
      if (!data.address.city.trim()) {
        newErrors.address = { ...newErrors.address, city: 'City is required.' };
      }
      if (!data.address.state.trim()) {
        newErrors.address = { ...newErrors.address, state: 'State is required.' };
      }
      if (!data.address.pinCode.trim()) {
        newErrors.address = { ...newErrors.address, pinCode: 'Pin Code is required.' };
      } else if (!/^\d{6}$/.test(data.address.pinCode)) {
        newErrors.address = { ...newErrors.address, pinCode: 'Pin Code must be 6 digits.' };
      }
      if (!data.address.mobile.trim()) {
        newErrors.address = { ...newErrors.address, mobile: 'Mobile number is required.' };
      } else if (!/^\+?\d{10,15}$/.test(data.address.mobile)) {
        newErrors.address = { ...newErrors.address, mobile: 'Mobile number is invalid.' };
      }
    }

    if (isVendor) {
      if (!data.description.trim()) {
        newErrors.description = 'Business Description is required.';
      } else if (data.description.trim().length < 10) {
        newErrors.description = 'Description must be at least 10 characters long.';
      }
      if (!data.category) {
        newErrors.category = 'Category is required.';
      }
      if (data.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.pan)) {
        newErrors.pan = 'Invalid PAN format.';
      }
      if (data.gst && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(data.gst)) {
        newErrors.gst = 'Invalid GST format.';
      }
    } else {
      if (data.cardDetails) {
        if (data.cardDetails.cardNumber && !/^\d{16}$/.test(data.cardDetails.cardNumber.replace(/\s/g, ''))) {
          newErrors.cardDetails = { ...newErrors.cardDetails, cardNumber: 'Card Number must be 16 digits.' };
        }
        if (data.cardDetails.expiry && !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(data.cardDetails.expiry)) {
          newErrors.cardDetails = { ...newErrors.cardDetails, expiry: 'Invalid Expiry Date (MM/YY).' };
        }
      }
      if (data.upiId && !/^[a-zA-Z0-9.\-]+@[a-zA-Z0-9.\-]+$/.test(data.upiId)) {
        newErrors.upiId = 'Invalid UPI ID format.';
      }
    }

    return newErrors;
  }, [isVendor]);

  const { errors, validate, resetErrors } = useFormValidation(profileData, profileValidationLogic);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const fetchedUser = await api.userProfile.getMe();
        const initialData = {
          name: fetchedUser.name || '',
          store: fetchedUser.store || '',
          email: fetchedUser.email || '',
          phone: fetchedUser.phone || '',
          address: fetchedUser.address || { houseNo: '', landmark: '', city: '', state: '', pinCode: '', mobile: '' },
          pan: fetchedUser.pan || '',
          gst: fetchedUser.gst || '',
          category: fetchedUser.category || '',
          description: fetchedUser.description || '',
          bankAccount: fetchedUser.bankAccount || '',
          bankName: fetchedUser.bankName || '',
          ifsc: fetchedUser.ifsc || '',
          upiId: fetchedUser.upiId || '',
          cardDetails: fetchedUser.cardDetails || { cardNumber: '', expiry: '', cardHolder: '' },
          profileImage: fetchedUser.profileImage || null,
        };
        setProfileData(initialData);
      } catch (error) {
        toast.error(`Failed to load profile: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  // NEW: Effect to update activeTab when URL search params change
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['profile', 'tickets'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    } else {
      setActiveTab('profile'); // Default if invalid or no tab param
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }));
    } else if (name.startsWith('cardDetails.')) {
      const field = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        cardDetails: {
          ...prev.cardDetails,
          [field]: value
        }
      }));
    } else if (type === 'checkbox') {
      setProfileData(prev => ({ ...prev, [name]: checked }));
    }
    else {
      setProfileData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditClick = () => {
    setOriginalProfileData(profileData);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setProfileData(originalProfileData);
    setIsEditing(false);
    resetErrors();
    setOriginalProfileData(null);
  };

  const handleSaveChanges = async () => {
    if (!validate(profileData)) {
      toast.error('Please correct the errors in the form.');
      return false;
    }

    try {
      const dataToUpdate = { ...profileData };
      const updatedUser = await api.userProfile.updateProfile(dataToUpdate);
      updateUserInContext(updatedUser);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      resetErrors();
      setOriginalProfileData(null);
      return true;
    } catch (error) {
      toast.error(`Failed to update profile: ${error.message}`);
      return false;
    }
  };

  if (loading) {
    return (
      <section className="w-full max-w-[1200px] my-10">
        <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-8 mx-4 animate-pulse">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gray-700 flex-shrink-0"></div>
              <div>
                <div className="h-8 bg-gray-700 rounded w-48 mb-2"></div>
                <div className="h-6 bg-gray-700 rounded w-32"></div>
              </div>
            </div>
            <div className="h-10 bg-gray-700 rounded-lg w-32 mt-4 md:mt-0"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-black/10 p-6 rounded-xl h-48"></div>
              <div className="bg-black/10 p-6 rounded-xl h-32"></div>
              <div className="bg-black/10 p-6 rounded-xl h-48"></div>
            </div>
            <div className="bg-black/10 p-6 rounded-xl h-96"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-[1200px] my-10">
      <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-8 mx-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold md:text-4xl">My Profile</h2>
          <div className="flex gap-4">
            {!isEditing && activeTab === 'profile' && (
              <button
                className="bg-[var(--accent)] w-full md:w-fit text-white border-none py-2 px-6 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-[var(--accent-dark)] transition-all duration-300"
                onClick={handleEditClick}
                aria-label="Edit profile"
              >
                <FontAwesomeIcon icon={faPen} aria-hidden="true" /> Edit Profile
              </button>
            )}
            {isEditing && activeTab === 'profile' && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-white/10 text-[var(--text)] border-none py-2 px-6 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-white/20 transition-all duration-300"
                aria-label="Cancel editing"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-center bg-black/10 rounded-lg p-1 mb-6 max-w-md mx-auto" role="tablist">
          <button
            onClick={() => {
              setActiveTab('profile');
              setSearchParams({ tab: 'profile' }); // NEW: Update URL param
            }}
            className={`w-1/2 py-2 rounded-md font-semibold transition-colors duration-300 ${activeTab === 'profile' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text)]'}`}
            role="tab"
            aria-selected={activeTab === 'profile'}
            aria-controls="profile-content-panel"
            id="profile-tab"
          >
            Profile Details
          </button>
          <button
            onClick={() => {
              setActiveTab('tickets');
              setSearchParams({ tab: 'tickets' }); // NEW: Update URL param
            }}
            className={`w-1/2 py-2 rounded-md font-semibold transition-colors duration-300 ${activeTab === 'tickets' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text)]'}`}
            role="tab"
            aria-selected={activeTab === 'tickets'}
            aria-controls="tickets-content-panel"
            id="tickets-tab"
          >
            My Tickets
          </button>
        </div>

        <div className="mt-8">
          {activeTab === 'profile' && (
            <div role="tabpanel" id="profile-content-panel" aria-labelledby="profile-tab">
              {isVendor ? (
                <VendorProfileForm
                  profileData={profileData}
                  setProfileData={setProfileData}
                  isEditing={isEditing}
                  handleSaveChanges={handleSaveChanges}
                  errors={errors}
                  handleInputChange={handleInputChange}
                  originalProfileData={originalProfileData}
                  setIsEditing={setIsEditing}
                  resetErrors={resetErrors}
                />
              ) : (
                <CustomerProfileForm
                  profileData={profileData}
                  setProfileData={setProfileData}
                  isEditing={isEditing}
                  handleSaveChanges={handleSaveChanges}
                  errors={errors}
                  handleInputChange={handleInputChange}
                  originalProfileData={originalProfileData}
                  setIsEditing={setIsEditing}
                  resetErrors={resetErrors}
                />
              )}
            </div>
          )}

          {activeTab === 'tickets' && (
            <div role="tabpanel" id="tickets-content-panel" aria-labelledby="tickets-tab">
              <MySupportTicketsSection />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Profile;