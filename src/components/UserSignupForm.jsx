import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react'; // Import Lucide icons

const UserSignupForm = () => {
  const { registerUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState(''); // NEW: Mobile state
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state

  const validateForm = () => {
    let newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Full Name is required.';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Full Name must be at least 3 characters long.';
    } else if (name.trim().length > 50) {
      newErrors.name = 'Full Name cannot exceed 50 characters.';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid.';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }
    if (!mobile.trim()) { // NEW: Validate mobile
      newErrors.mobile = 'Mobile number is required.';
    } else if (!/^\+?\d{10,15}$/.test(mobile)) {
      newErrors.mobile = 'Mobile number is invalid.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const userData = {
          name,
          email,
          password,
          phone: '', // This is the user's contact phone, not shipping address mobile
          address: {
            houseNo: '',
            landmark: '',
            city: '',
            state: '',
            pinCode: '',
            mobile: mobile, // NEW: Pass mobile to address
          },
        };
        if (await registerUser(userData)) {
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

  return (
    <motion.form
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onSubmit={handleSignup}
      className="flex flex-col text-left"
      aria-label="Customer Signup Form"
    >
      <label htmlFor="fullName" className="mb-1 text-sm font-medium">Full Name</label>
      <input 
        type="text" 
        id="fullName"
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="e.g., John Doe" 
        className="w-full p-3 mb-1 text-[var(--text)] border border-white/30 rounded-lg bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" 
        aria-invalid={!!errors.name}
        aria-describedby={errors.name ? "fullName-error" : undefined}
        disabled={isLoading}
      />
      {errors.name && <p id="fullName-error" className="text-red-400 text-xs mb-3">{errors.name}</p>}
      
      <label htmlFor="email" className="mb-1 text-sm font-medium">Email</label>
      <input 
        type="email" 
        id="email"
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="e.g., johndoe@example.com" 
        className="w-full p-3 mb-1 text-[var(--text)] border border-white/30 rounded-lg bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" 
        aria-invalid={!!errors.email}
        aria-describedby={errors.email ? "email-error" : undefined}
        disabled={isLoading}
      />
      {errors.email && <p id="email-error" className="text-red-400 text-xs mb-3">{errors.email}</p>}

      <label htmlFor="mobile" className="mb-1 text-sm font-medium">Mobile Number</label> {/* NEW: Mobile input */}
      <input 
        type="tel" 
        id="mobile"
        value={mobile} 
        onChange={(e) => setMobile(e.target.value)} 
        placeholder="e.g., 9876543210" 
        className="w-full p-3 mb-1 text-[var(--text)] border border-white/30 rounded-lg bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" 
        aria-invalid={!!errors.mobile}
        aria-describedby={errors.mobile ? "mobile-error" : undefined}
        disabled={isLoading}
      />
      {errors.mobile && <p id="mobile-error" className="text-red-400 text-xs mb-3">{errors.mobile}</p>}
      
      <label htmlFor="password" className="mb-1 text-sm font-medium">Password</label>
      <div className="relative w-full">
        <input 
          type={showPassword ? 'text' : 'password'}
          id="password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="••••••••" 
          className="w-full p-3 mb-1 text-[var(--text)] border border-white/30 rounded-lg bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] pr-10" 
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
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
      {errors.password && <p id="password-error" className="text-red-400 text-xs mb-3">{errors.password}</p>}
      
      <button 
        type="submit" 
        className="bg-[var(--accent)] text-white border-none py-3 px-6 rounded-lg flex items-center justify-center w-full gap-2 font-medium hover:bg-[var(--accent-dark)] transition-all duration-300 mt-4"
        disabled={isLoading}
      >
        {isLoading ? <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> : <FontAwesomeIcon icon={faUserPlus} aria-hidden="true" />}
        {isLoading ? 'Signing Up...' : 'Sign Up'}
      </button>
      <p className="text-center text-sm mt-4">
        Already have an account? <Link to="/login" className="text-[var(--accent)] font-semibold">Login here.</Link>
      </p>
    </motion.form>
  );
};

export default UserSignupForm;