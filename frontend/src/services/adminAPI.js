import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/v1';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
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

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Admin API functions
export const adminAPI = {
  // Health check
  healthCheck: () => apiClient.get('/health'),
  
  // Dashboard stats
  getDashboardStats: () => apiClient.get('/admin/dashboard/stats'),
  
  // User management
  getAllUsers: () => apiClient.get('/admin/users'),
  getUserDetails: (userId) => apiClient.get(`/admin/users/${userId}`),
  toggleUserStatus: (userId, isActive) => apiClient.patch(`/admin/users/${userId}/status`, { isActive }),
  activateUser: (userId) => apiClient.patch(`/admin/users/${userId}/activate`),
  deactivateUser: (userId) => apiClient.patch(`/admin/users/${userId}/deactivate`),
  deleteUser: (userId) => apiClient.delete(`/admin/users/${userId}`),
  
  // Account management
  getAllAccounts: () => apiClient.get('/admin/accounts'),
  toggleAccountFreeze: (accountId, isFrozen) => apiClient.patch(`/admin/accounts/${accountId}/freeze`, { isFrozen }),
  updateAccount: (accountId, data) => apiClient.patch(`/admin/accounts/${accountId}/update`, data),
  forceCloseAccount: (accountId) => apiClient.delete(`/admin/accounts/${accountId}/force-close`),
  manualDeposit: (accountId, amount) => apiClient.post(`/admin/accounts/${accountId}/deposit`, { amount }),
  manualWithdraw: (accountId, amount) => apiClient.post(`/admin/accounts/${accountId}/withdraw`, { amount }),
  
  // Transaction management
  getAllTransactions: () => apiClient.get('/admin/transactions'),
  getFilteredTransactions: (filters) => apiClient.get('/admin/transactions/filter', { params: filters }),
  reverseTransaction: (transactionId) => apiClient.patch(`/admin/transactions/${transactionId}/reverse`),
};

export default apiClient;
