import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// 1. Create the Axios Instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor (Adds Token)
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor (Handles Data & 401 Errors)
api.interceptors.response.use(
  (response) => {
    // Return data directly to avoid .data repetition
    return response.data;
  },
  (error) => {
    // Handle 401 Unauthorized (Global Auto-Logout)
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        // Only redirect if we are not already on login page
        if (!window.location.pathname.includes('/auth/login')) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userInfo');
          window.location.href = '/auth/login';
        }
      }
    }

    // Standardize error format
    const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject({ 
      status: error.response?.status,
      message: errorMessage, 
      original: error 
    });
  }
);

// 4. Export the Service Wrapper (THIS FIXES YOUR CRASH)
const apiService = {
  // Expose Axios methods
  get: (url, config) => api.get(url, config),
  post: (url, data, config) => api.post(url, data, config),
  put: (url, data, config) => api.put(url, data, config),
  patch: (url, data, config) => api.patch(url, data, config),
  delete: (url, config) => api.delete(url, config),

  // === CUSTOM HELPERS ===
  
  setToken: (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  },

  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  },

  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  },

  isAuthenticated: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      return !!token; // Returns true if token exists
    }
    return false;
  }
};

export default apiService;