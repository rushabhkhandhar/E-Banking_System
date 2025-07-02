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
    
    // Add cache-busting headers for all requests to prevent stale data
    config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    config.headers['Pragma'] = 'no-cache';
    config.headers['Expires'] = '0';
    
    // Add timestamp to GET requests for additional cache busting
    if (config.method === 'get') {
      const timestamp = new Date().getTime();
      const separator = config.url.includes('?') ? '&' : '?';
      config.url = `${config.url}${separator}_t=${timestamp}`;
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
      // Token expired or invalid - clear all stored data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      sessionStorage.clear();
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

  resendVerificationEmail: async (email) => {
    const response = await api.post('/auth/resend-verification', { email });
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

  getTransferableAccounts: async () => {
    const response = await api.get('/accounts/transfer/available');
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
    const response = await api.patch(`/accounts/${accountId}`, updateData);
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

  freezeAccount: async (accountId, freezeData) => {
    const response = await api.patch(`/accounts/${accountId}/freeze`, freezeData);
    return response.data;
  },

  unfreezeAccount: async (accountId) => {
    const response = await api.patch(`/accounts/${accountId}/unfreeze`);
    return response.data;
  },
};

// Transaction APIs
export const transactionAPI = {
  // Get user's transaction history
  getUserTransactions: async (params = {}) => {
    const response = await api.get('/users/transactions', { params });
    return response.data;
  },

  // Get account-specific transactions
  getAccountTransactions: async (accountId, params = {}) => {
    const response = await api.get(`/transactions/account/${accountId}`, { params });
    return response.data;
  },

  // Get all user transactions across accounts
  getAllUserTransactions: async (params = {}) => {
    const response = await api.get('/transactions/user/all', { params });
    return response.data;
  },

  // Get specific transaction by ID
  getTransactionById: async (transactionId) => {
    const response = await api.get(`/transactions/${transactionId}`);
    return response.data;
  },

  // Deposit money
  deposit: async (accountId, amount, description) => {
    const response = await api.post(`/transactions/deposit/${accountId}`, {
      amount,
      description
    });
    return response.data;
  },

  // Withdraw money
  withdraw: async (accountId, amount, description) => {
    const response = await api.post(`/transactions/withdraw/${accountId}`, {
      amount,
      description
    });
    return response.data;
  },

  // Transfer money
  transfer: async (fromAccountId, toAccountNumber, amount, description) => {
    const response = await api.post(`/transactions/transfer/${fromAccountId}`, {
      toAccountNumber,
      amount,
      description
    });
    return response.data;
  },
};

// User APIs
export const userAPI = {
  // Get user dashboard data
  getDashboard: async () => {
    const response = await api.get('/users/dashboard');
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.patch('/users/profile', userData);
    return response.data;
  },

  // Get account statement
  getAccountStatement: async (accountId, startDate, endDate) => {
    const response = await api.get(`/users/account-statement/${accountId}`, {
      params: { startDate, endDate }
    });
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
