// src/services/api.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL; // Replace with your actual base URL

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token and handle content type
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Don't set Content-Type for FormData, let the browser handle it with the correct boundary
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    } else {
      // Remove any default Content-Type header for FormData
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${BASE_URL}api/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        console.error(refreshError);
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to handle API errors consistently
const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('API Error - Response:', {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data,
    });
    
    // Return a consistent error object
    return {
      error: true,
      status: error.response.status,
      message: error.response.data?.detail || error.response.statusText || 'An error occurred',
      data: error.response.data,
    };
  } else if (error.request) {
    // The request was made but no response was received
    console.error('API Error - No Response:', error.request);
    return {
      error: true,
      message: 'No response from server. Please check your connection.',
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('API Error - Request Setup:', error.message);
    return {
      error: true,
      message: error.message || 'Error setting up request',
    };
  }
};

// Helper function to make API requests with consistent error handling
const apiRequest = async (method, url, data = null, config = {}) => {
  try {
    const response = await api({
      method,
      url,
      data,
      ...config,
    });
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: handleApiError(error) };
  }
};

// Export both the raw axios instance and our helper function
export { api as default, apiRequest };

