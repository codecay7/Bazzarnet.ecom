import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ChevronDown, Eye, EyeOff } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

// Removed indianStates and categories as they are no longer needed in this initial form

const VendorRegistrationForm = () => {
  const { registerVendor } = useContext(AppContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    phone: '', // Personal phone for the vendor
    password: '',
    // Removed pan, gst, address, description, category from initial state
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    console.log(`handleChange: name=${name}, value=${value}, newFormData=${JSON.stringify({ ...formData, [name]: value })}`); // NEW LOG: Check state update
  };

  const validateForm = (dataToValidate) => { // Changed to accept dataToValidate
    console.log('Validating with data:', dataToValidate); // Debug log
    let newErrors = {};
    if (!dataToValidate.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    } else if (dataToValidate.fullName.trim().length < 3) {
      newErrors.fullName = 'Full Name must be at least 3 characters long.';
    } else if (dataToValidate.fullName.trim().length > 50) {
      newErrors.fullName = 'Full Name cannot exceed 50 characters.';
    }
    if (!dataToValidate.businessName.trim()) {
      newErrors.businessName = 'Business Name is required.';
    } else if (dataToValidate.businessName.trim().length < 3) {
      newErrors.businessName = 'Business Name must be at least 3 characters long.';
    } else if (dataToValidate.businessName.trim().length > 100) {
      newErrors.businessName = 'Business Name cannot exceed 100 characters.';
    }
    if (!dataToValidate.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(dataToValidate.email)) {
      newErrors.email = 'Email address is invalid.';
    }
    if (!dataToValidate.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\+?\d{10,15}$/.test(dataToValidate.phone)) {
      newErrors.phone = 'Phone number is invalid.';
    }
    if (!dataToValidate.password) {
      newErrors.password = 'Password is required.';
    } else if (dataToValidate.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }
    // Removed validation for pan, gst, address, description, category
    setErrors(newErrors);
    console.log('Validation errors:', newErrors); // Debug log
    return Object.keys(newErrors).length === 0;
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    console.log('handleRegistration: formData before validation:', formData); // Debug log
    if (validateForm(formData)) { // Pass formData explicitly
      setIsLoading(true);
      try {
        const vendorData = {
          fullName: formData.fullName, // CORRECTED: Use fullName as key
          email: formData.email,
          password: formData.password,
          businessName: formData.businessName, // CORRECTED: Use businessName as key
          phone: formData.phone,
          // These fields are now optional and will be collected later
          businessDescription: '', 
          category: 'Other', // Default category
          pan: '',
          gst: '',
          address: {
            houseNo: '',
            landmark: '',
            city: '',
            state: '',
            pinCode: '',
            mobile: '',
          },
        };
        console.log('handleRegistration: vendorData sent to API:', vendorData); // NEW LOG: Check data before API call
        if (await registerVendor(vendorData)) {
          toast.success('Registration successful! Please complete your store profile with business details, address, and payment info before adding products.', { duration: 6000 });
          navigate('/dashboard');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error('Please correct the errors in the form.');
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const inputClasses = "w-full p-2 text-[var(--text)] border border-white/30 rounded-lg bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]";

  return (
    <motion.form
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onSubmit={handleRegistration}
      className="flex flex-col text-left gap-2"
      aria-label="Vendor Registration Form"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="vendorFullName" className="text-sm font-medium">Full Name</label>
          <input 
            type="text" 
            id="vendorFullName"
            name="fullName" 
            value={formData.fullName} 
            onChange={handleChange} 
            className={inputClasses} 
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "vendorFullName-error" : undefined}
            disabled={isLoading}
          />
          {errors.fullName && <p id="vendorFullName-error" className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
        </div>
        <div>
          <label htmlFor="businessName" className="text-sm font-medium">Business Name</label>
          <input 
            type="text" 
            id="businessName"
            name="businessName" 
            value={formData.businessName} 
            onChange={handleChange} 
            className={inputClasses} 
            aria-invalid={!!errors.businessName}
            aria-describedby={errors.businessName ? "businessName-error" : undefined}
            disabled={isLoading}
          />
          {errors.businessName && <p id="businessName-error" className="text-red-400 text-xs mt-1">{errors.businessName}</p>}
        </div>
        <div>
          <label htmlFor="vendorEmail" className="text-sm font-medium">Email</label>
          <input 
            type="email" 
            id="vendorEmail"
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            className={inputClasses} 
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "vendorEmail-error" : undefined}
            disabled={isLoading}
          />
          {errors.email && <p id="vendorEmail-error" className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="vendorPhone" className="text-sm font-medium">Phone</label>
          <input 
            type="tel" 
            id="vendorPhone"
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            className={inputClasses} 
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "vendorPhone-error" : undefined}
            disabled={isLoading}
          />
          {errors.phone && <p id="vendorPhone-error" className="text-red-400 text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>
      {/* Removed PAN, GST, Address, Description, Category fields */}
      <div>
        <label htmlFor="vendorPassword" className="text-sm font-medium">Password</label>
        <div className="relative w-full">
          <input 
            type={showPassword ? 'text' : 'password'}
            id="vendorPassword"
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            className={`${inputClasses} pr-10`} 
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "vendorPassword-error" : undefined}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text)] opacity-70 hover:opacity-100"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && <p id="vendorPassword-error" className="text-red-400 text-xs mt-1">{errors.password}</p>}
      </div>
      <button 
        type="submit" 
        className="bg-[var(--accent)] text-white border-none py-3 px-6 rounded-lg flex items-center justify-center w-full gap-2 font-medium hover:bg-[var(--accent-dark)] transition-all duration-300 mt-4"
        disabled={isLoading}
      >
        {isLoading ? <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> : 'Register Business'}
      </button>
      <p className="text-center text-sm mt-4">
        Already have an account? <Link to="/login" className="text-[var(--accent)] font-semibold">Login here.</Link>
      </p>
    </motion.form>
  );
};

export default VendorRegistrationForm;