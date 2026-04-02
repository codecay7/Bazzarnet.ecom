import React, { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSpinner, faSave } from '@fortawesome/free-solid-svg-icons'; // Added faSpinner, faSave
import { Mail, Phone, CreditCard, Landmark, ChevronDown, UploadCloud } from 'lucide-react';
import useFormValidation from '../../hooks/useFormValidation';
import * as api from '../../services/api';
import placeholderImage from '../../assets/placeholder.png';
import { getFullImageUrl } from '../../utils/imageUtils';

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const inputClasses = "w-full p-2 rounded-lg bg-white/10 border border-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--text)]";

const CustomerProfileForm = ({ profileData, setProfileData, isEditing, handleSaveChanges, errors, handleInputChange, originalProfileData, setIsEditing, resetErrors }) => {
  const [profileImageFile, setProfileImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false); // Local saving state for the form

  const handleProfileImageFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImageFile(e.target.files[0]);
      setProfileData(prev => ({ ...prev, profileImage: '' })); // Clear URL if new file selected
    } else {
      setProfileImageFile(null);
    }
  };

  const handleProfileImageUpload = async () => {
    if (!profileImageFile) return profileData.profileImage;

    const formData = new FormData();
    formData.append('image', profileImageFile);

    try {
      const response = await api.userProfile.uploadProfileImage(formData);
      toast.success('Profile image uploaded successfully!');
      return response.profileImage;
    } catch (error) {
      toast.error(`Profile image upload failed: ${error.message}`);
      throw error;
    }
  };

  const handleSubmitWrapper = async (e) => {
    e.preventDefault();
    setIsSaving(true); // Start local saving feedback

    try {
      // Check for changes before proceeding
      const hasFormDataChanged = JSON.stringify(profileData) !== JSON.stringify(originalProfileData);
      const hasImageFileChanged = !!profileImageFile;

      if (!hasFormDataChanged && !hasImageFileChanged) {
        toast('No changes detected.', { icon: 'ℹ️' });
        setIsEditing(false); // Exit edit mode
        resetErrors();
        return;
      }

      let imageUrl = profileData.profileImage;
      if (hasImageFileChanged) {
        imageUrl = await handleProfileImageUpload();
        // Update profileData with the new image URL before calling parent's save
        setProfileData(prev => ({ ...prev, profileImage: imageUrl }));
      }

      // Call parent's save function, which will perform API call and update context
      const success = await handleSaveChanges();
      if (success) {
        // Parent already handles setIsEditing(false) and resetErrors() on success
        setProfileImageFile(null); // Clear file input state
      }
    } catch (error) {
      console.error('Customer profile form submission error:', error);
      // Error toast already shown by handleProfileImageUpload or handleSaveChanges
    } finally {
      setIsSaving(false); // End local saving feedback
    }
  };

  const previewImageSrc = profileImageFile ? URL.createObjectURL(profileImageFile) : getFullImageUrl(profileData.profileImage);

  return (
    <form id="customer-profile-form" onSubmit={handleSubmitWrapper} className="space-y-6">
      <div className="flex flex-col items-center text-center max-w-lg mx-auto mb-8">
        <div className="relative w-24 h-24 mb-4">
          {(profileImageFile || profileData.profileImage) ? (
            <img 
              src={previewImageSrc} 
              alt="User Profile" 
              className="w-24 h-24 rounded-full object-cover border-4 border-white/30 shadow-lg" 
              onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }}
            />
          ) : (
            <div className="w-24 h-24 bg-[var(--accent)] rounded-full flex items-center justify-center border-4 border-white/30 shadow-lg" role="img" aria-label="Default user profile image">
              <FontAwesomeIcon icon={faUser} className="text-white text-4xl" aria-hidden="true" />
            </div>
          )}
          {isEditing && (
            <div className="absolute bottom-0 right-0 bg-white/80 rounded-full p-1.5 text-gray-800 hover:bg-white shadow-md cursor-pointer">
              <label htmlFor="profileImageFile" className="sr-only">Upload Profile Image</label>
              <input
                type="file"
                id="profileImageFile"
                ref={fileInputRef}
                onChange={handleProfileImageFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
                aria-label="Upload new profile image"
                disabled={isSaving}
              />
              <UploadCloud size={16} aria-hidden="true" />
            </div>
          )}
        </div>
        <h2 className="text-3xl font-bold mb-1">{profileData.name}</h2>
        <p className="text-lg text-[var(--text)] opacity-80 mb-6">{profileData.email}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-black/10 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Mail size={20} aria-hidden="true" /> Contact Information</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail size={20} className="mt-1 text-[var(--accent)]" aria-hidden="true" />
              <div>
                <p className="text-sm opacity-70">Email</p>
                <p className="font-medium break-all">{profileData.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={20} className="mt-1 text-[var(--accent)]" aria-hidden="true" />
              <div>
                <p className="text-sm opacity-70">Phone</p>
                {isEditing ? 
                  <input 
                    type="tel" 
                    name="phone" 
                    value={profileData.phone} 
                    onChange={handleInputChange} 
                    className={inputClasses} 
                    placeholder="Phone Number" 
                    aria-label="Phone Number"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    disabled={isSaving}
                  /> : 
                  <p className="font-medium">{profileData.phone}</p>
                }
                {errors.phone && <p id="phone-error" className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black/10 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Landmark size={20} aria-hidden="true" /> Shipping Address</h3>
          <div className="flex items-start gap-3">
            <Landmark size={20} className="mt-1 text-[var(--accent)]" aria-hidden="true" />
            <div>
              <p className="text-sm opacity-70">Address</p>
              {isEditing ? (
                <div className="space-y-2">
                  <label htmlFor="addressHouseNo" className="sr-only">House No., Street</label>
                  <input type="text" name="address.houseNo" id="addressHouseNo" value={profileData.address.houseNo} onChange={handleInputChange} className={inputClasses} placeholder="House No., Street" aria-label="House Number and Street" aria-invalid={!!errors.address?.houseNo} aria-describedby={errors.address?.houseNo ? "addressHouseNo-error" : undefined} disabled={isSaving} />
                  {errors.address?.houseNo && <p id="addressHouseNo-error" className="text-red-400 text-xs mt-1">{errors.address.houseNo}</p>}
                  
                  <label htmlFor="addressLandmark" className="sr-only">Landmark (Optional)</label>
                  <input type="text" name="address.landmark" id="addressLandmark" value={profileData.address.landmark} onChange={handleInputChange} className={inputClasses} placeholder="Landmark (Optional)" aria-label="Landmark" disabled={isSaving} />
                  
                  <label htmlFor="addressCity" className="sr-only">City</label>
                  <input type="text" name="address.city" id="addressCity" value={profileData.address.city} onChange={handleInputChange} className={inputClasses} placeholder="City" aria-label="City" aria-invalid={!!errors.address?.city} aria-describedby={errors.address?.city ? "addressCity-error" : undefined} disabled={isSaving} />
                  {errors.address?.city && <p id="addressCity-error" className="text-red-400 text-xs mt-1">{errors.address.city}</p>}
                  
                  <div className="relative">
                    <label htmlFor="addressState" className="sr-only">State</label>
                    <select name="address.state" id="addressState" value={profileData.address.state} onChange={handleInputChange} className={`${inputClasses} appearance-none pr-8`} aria-label="State" aria-invalid={!!errors.address?.state} aria-describedby={errors.address?.state ? "addressState-error" : undefined} disabled={isSaving}>
                      <option value="" disabled>Select State</option>
                      {indianStates.map(state => <option key={state} value={state}>{state}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 top-0 flex items-center px-2 text-[var(--text)]" aria-hidden="true"><ChevronDown size={20} /></div>
                  </div>
                  {errors.address?.state && <p id="addressState-error" className="text-red-400 text-xs mt-1">{errors.address.state}</p>}
                  
                  <label htmlFor="addressPinCode" className="sr-only">Pin Code</label>
                  <input type="text" name="address.pinCode" id="addressPinCode" value={profileData.address.pinCode} onChange={handleInputChange} className={inputClasses} placeholder="Pin Code" maxLength="6" aria-label="Pin Code" aria-invalid={!!errors.address?.pinCode} aria-describedby={errors.address?.pinCode ? "addressPinCode-error" : undefined} disabled={isSaving} />
                  {errors.address?.pinCode && <p id="addressPinCode-error" className="text-red-400 text-xs mt-1">{errors.address.pinCode}</p>}

                  <label htmlFor="addressMobile" className="sr-only">Mobile Number</label> {/* NEW: Mobile input */}
                  <input type="tel" name="address.mobile" id="addressMobile" value={profileData.address.mobile} onChange={handleInputChange} className={inputClasses} placeholder="Mobile Number" aria-label="Mobile Number" aria-invalid={!!errors.address?.mobile} aria-describedby={errors.address?.mobile ? "addressMobile-error" : undefined} disabled={isSaving} />
                  {errors.address?.mobile && <p id="addressMobile-error" className="text-red-400 text-xs mt-1">{errors.address.mobile}</p>}
                </div>
              ) : (
                <p className="font-medium">{profileData.address ? `${profileData.address.houseNo}, ${profileData.address.landmark ? profileData.address.landmark + ', ' : ''}${profileData.address.city}, ${profileData.address.state} - ${profileData.address.pinCode} (Mob: ${profileData.address.mobile})` : 'N/A'}</p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-black/10 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><CreditCard size={20} aria-hidden="true" /> Payment Methods</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CreditCard size={20} className="mt-1 text-[var(--accent)]" aria-hidden="true" />
              <div>
                <p className="text-sm opacity-70">Card Details</p>
                {isEditing ? (
                  <div className="space-y-2">
                    <label htmlFor="cardNumber" className="sr-only">Card Number</label>
                    <input type="text" name="cardDetails.cardNumber" id="cardNumber" value={profileData.cardDetails.cardNumber} onChange={handleInputChange} className={inputClasses} placeholder="Card Number" aria-label="Card Number" aria-invalid={!!errors.cardDetails?.cardNumber} aria-describedby={errors.cardDetails?.cardNumber ? "cardNumber-error" : undefined} disabled={isSaving} />
                    {errors.cardDetails?.cardNumber && <p id="cardNumber-error" className="text-red-400 text-xs mt-1">{errors.cardDetails.cardNumber}</p>}
                    
                    <label htmlFor="expiry" className="sr-only">Expiry Date (MM/YY)</label>
                    <input type="text" name="cardDetails.expiry" id="expiry" value={profileData.cardDetails.expiry} onChange={handleInputChange} className={inputClasses} placeholder="MM/YY" aria-label="Card Expiry Date" aria-invalid={!!errors.cardDetails?.expiry} aria-describedby={errors.cardDetails?.expiry ? "expiry-error" : undefined} disabled={isSaving} />
                    {errors.cardDetails?.expiry && <p id="expiry-error" className="text-red-400 text-xs mt-1">{errors.cardDetails.expiry}</p>}
                    
                    <label htmlFor="cardHolder" className="sr-only">Card Holder Name</label>
                    <input type="text" name="cardDetails.cardHolder" id="cardHolder" value={profileData.cardDetails.cardHolder} onChange={handleInputChange} className={inputClasses} placeholder="Card Holder Name" aria-label="Card Holder Name" disabled={isSaving} />
                  </div>
                ) : (
                  <>
                    <p className="font-medium">{profileData.cardDetails.cardNumber}</p>
                    <p className="text-sm opacity-80">Expires: {profileData.cardDetails.expiry}</p>
                    <p className="text-sm opacity-80">Holder: {profileData.cardDetails.cardHolder}</p>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Landmark size={20} className="mt-1 text-[var(--accent)]" aria-hidden="true" />
              <div>
                <p className="text-sm opacity-70">UPI ID</p>
                {isEditing ? 
                  <input 
                    type="text" 
                    name="upiId" 
                    value={profileData.upiId} 
                    onChange={handleInputChange} 
                    className={inputClasses} 
                    placeholder="UPI ID" 
                    aria-label="UPI ID"
                    aria-invalid={!!errors.upiId}
                    aria-describedby={errors.upiId ? "upiId-error" : undefined}
                    disabled={isSaving}
                  /> : 
                  <p className="font-medium">{profileData.upiId}</p>
                }
                {errors.upiId && <p id="upiId-error" className="text-red-400 text-xs mt-1">{errors.upiId}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isEditing && (
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="bg-[var(--accent)] text-white border-none py-2 px-6 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-[var(--accent-dark)] transition-all duration-300"
            disabled={isSaving}
            aria-label="Save changes to profile"
          >
            {isSaving ? <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> : <FontAwesomeIcon icon={faSave} aria-hidden="true" />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </form>
  );
};

export default CustomerProfileForm;