import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import * as api from '../services/api';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isVendor, setIsVendor] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Helper to set user state and local storage, optimized to prevent unnecessary re-renders
  const loginUserInState = useCallback((userData) => {
    setUser(prevUser => {
      // Perform a shallow comparison of critical user data to avoid unnecessary state updates
      if (prevUser && prevUser._id === userData._id && prevUser.token === userData.token && prevUser.role === userData.role) {
        return prevUser; // Return previous state if effectively no change
      }
      // If there's a significant change or no previous user, update state
      setIsLoggedIn(true);
      setIsVendor(userData.role === 'vendor');
      setIsAdmin(userData.role === 'admin');
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    });
  }, [setIsLoggedIn, setIsVendor, setIsAdmin]); // Dependencies are stable setters

  // Centralized login handler with role enforcement
  const handleLogin = useCallback(async (email, password, expectedRole) => {
    try {
      const response = await api.auth.login({ email, password });
      if (response) {
        if (response.role !== expectedRole) {
          toast.error(`Login failed: You are not authorized to log in as a ${expectedRole}. Your role is ${response.role}.`);
          return false;
        }
        loginUserInState(response);
        toast.success(`Welcome back, ${response.name}!`);
        return true;
      }
      return false;
    } catch (error) {
      toast.error(error.message || 'Login failed.');
      return false;
    }
  }, [loginUserInState]);

  // Login Functions (these will still be called directly by AppContext)
  const loginAsUser = useCallback(async (email, password) => handleLogin(email, password, 'customer'), [handleLogin]);
  const loginAsVendor = useCallback(async (email, password) => handleLogin(email, password, 'vendor'), [handleLogin]);
  const loginAsAdmin = useCallback(async (email, password) => handleLogin(email, password, 'admin'), [handleLogin]);

  const logout = useCallback(async () => {
    try {
      // In a real app, you might call a backend logout endpoint here
      // await api.auth.logout(); 
      localStorage.removeItem('user');
      setUser(null);
      setIsLoggedIn(false);
      setIsVendor(false);
      setIsAdmin(false);
      toast.success('You have been logged out.');
    } catch (error) {
      toast.error(`Logout error: ${error.message}`);
    }
  }, []);

  // Auto-login from localStorage and fetch user profile
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.token) {
      const fetchUserProfile = async () => {
        try {
          const fetchedUser = await api.userProfile.getMe();
          loginUserInState({ ...fetchedUser, token: storedUser.token }); // Keep the token from local storage
          // No toast here, as it's an auto-login, avoid spamming
        } catch (error) {
          console.error('Auto-login failed:', error);
          toast.error('Your session expired. Please log in again.');
          logout(); // Log out if token is invalid or expired
        }
      };
      fetchUserProfile();
    }
  }, [loginUserInState, logout]);

  return {
    isLoggedIn,
    user,
    isVendor,
    isAdmin,
    loginAsUser,
    loginAsVendor,
    loginAsAdmin,
    logout,
    setUser, // Expose setUser for AppContext to update user details
    loginUserInState, // Expose loginUserInState for AppContext to use after registration
  };
};

export default useAuth;