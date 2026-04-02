import { useCallback } from 'react';

const useUtils = () => {
  // Generate a 6-digit OTP
  const generateOtp = useCallback(() => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }, []);

  return { generateOtp };
};

export default useUtils;