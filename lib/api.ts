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

api.interceptors.request.use((config) => {
  const token = Cookies.get('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
