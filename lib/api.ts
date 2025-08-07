import axios from 'axios';
import Cookies from 'js-cookie';

function getBaseURL() {
  if (typeof window !== 'undefined' && window.env?.NEXT_PUBLIC_API_URL) {
    return window.env.NEXT_PUBLIC_API_URL;
  }
  return 'http://localhost:8080'; // fallback
}

const api = axios.create({
  // baseURL: "http://finsage-api:8080", // Docker service name
  // baseURL: getBaseURL(), // Uncomment this line if you want to use the
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = Cookies.get('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Remove token from cookies
      Cookies.remove('jwt');
      
      // Clear localStorage if there are any tokens stored there
      if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt');
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        
        // Redirect to login page
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
