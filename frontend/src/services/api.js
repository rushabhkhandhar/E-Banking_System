import axios from 'axios';

// Base URL for your backend - matches the API collection
const BASE_URL = 'http://localhost:5000/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.patch('/users/profile', userData);
    return response.data;
  },

  changePassword: async (currentPassword, password, passwordConfirm) => {
    const response = await api.patch('/auth/update-password', {
      passwordCurrent: currentPassword,
      password,
      passwordConfirm,
    });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

// Account APIs
export const accountAPI = {
  getAccounts: async () => {
    const response = await api.get('/accounts');
    return response.data;
  },

  createAccount: async (accountData) => {
    const response = await api.post('/accounts', accountData);
    return response.data;
  },

  getAccountById: async (accountId) => {
    const response = await api.get(`/accounts/${accountId}`);
    return response.data;
  },

  updateAccount: async (accountId, updateData) => {
    const response = await api.put(`/accounts/${accountId}`, updateData);
    return response.data;
  },

  closeAccount: async (accountId) => {
    const response = await api.delete(`/accounts/${accountId}`);
    return response.data;
  },

  getAccountBalance: async (accountId) => {
    const response = await api.get(`/accounts/${accountId}/balance`);
    return response.data;
  },
};

// Transaction APIs
export const transactionAPI = {
  getTransactions: async (params = {}) => {
    const response = await api.get('/transactions', { params });
    return response.data;
  },

  getTransactionById: async (transactionId) => {
    const response = await api.get(`/transactions/${transactionId}`);
    return response.data;
  },

  createTransaction: async (transactionData) => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  },

  transferMoney: async (transferData) => {
    const response = await api.post('/transactions/transfer', transferData);
    return response.data;
  },

  getAccountTransactions: async (accountId, params = {}) => {
    const response = await api.get(`/accounts/${accountId}/transactions`, { params });
    return response.data;
  },
};

// Admin APIs
export const adminAPI = {
  getAllUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  getAllAccounts: async (params = {}) => {
    const response = await api.get('/admin/accounts', { params });
    return response.data;
  },

  getAllTransactions: async (params = {}) => {
    const response = await api.get('/admin/transactions', { params });
    return response.data;
  },

  getSystemStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
};

// Utility function to handle API errors
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data.message || 'An error occurred';
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error. Please check your connection.';
  } else {
    // Something else happened
    return 'An unexpected error occurred';
  }
};

export default api;
