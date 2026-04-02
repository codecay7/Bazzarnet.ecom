import { API_BASE_URL } from '../services/api';

/**
 * Constructs a full absolute URL for an image, handling relative paths from the backend.
 * If the path is already absolute (starts with http/https), it returns it as is.
 * If the path starts with /uploads/, it prepends the API_BASE_URL.
 * Otherwise, it returns the path as is (e.g., for placeholder images).
 * @param {string} relativePath - The image path received from the backend.
 * @returns {string} The full absolute URL for the image.
 */
export const getFullImageUrl = (relativePath) => {
  if (!relativePath) {
    return ''; // Or a default placeholder if preferred
  }
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath; // Already an absolute URL
  }
  // Assuming API_BASE_URL is something like 'http://localhost:5000/api'
  // And image paths are like '/uploads/image.jpg'
  // We need 'http://localhost:5000/uploads/image.jpg'
  // So we strip '/api' from API_BASE_URL
  const backendBase = API_BASE_URL.replace('/api', '');
  return `${backendBase}${relativePath}`;
};