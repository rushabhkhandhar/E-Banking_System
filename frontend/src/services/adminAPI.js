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
    
    // Add cache-busting headers
    config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    config.headers['Pragma'] = 'no-cache';
    config.headers['Expires'] = '0';
    
    // Debug admin requests
    console.log('🔧 Admin API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      hasAuth: !!token
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Admin API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Admin API Response:', {
      status: response.status,
      url: response.config.url,
      method: response.config.method?.toUpperCase()
    });
    return response;
  },
  (error) => {
    console.error('❌ Admin API Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      message: error.response?.data?.message || error.message
    });
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      sessionStorage.clear();
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
  getAllUsers: (params) => apiClient.get('/admin/users', { params }),
  getUserDetails: (userId) => apiClient.get(`/admin/users/${userId}`),
  toggleUserStatus: (userId, isActive, reason) => apiClient.patch(`/admin/users/${userId}/status`, { isActive, reason }),
  activateUser: (userId) => apiClient.patch(`/admin/users/${userId}/activate`),
  deactivateUser: (userId, reason) => apiClient.patch(`/admin/users/${userId}/deactivate`, { reason }),
  deleteUser: (userId, reason) => apiClient.delete(`/admin/users/${userId}`, { data: { reason } }),
  
  // Account management
  getAllAccounts: () => apiClient.get('/admin/accounts'),
  toggleAccountFreeze: (accountId, freeze, reason) => apiClient.patch(`/admin/accounts/${accountId}/freeze`, { freeze, reason }),
  updateAccount: (accountId, data) => apiClient.patch(`/admin/accounts/${accountId}/update`, data),
  forceCloseAccount: (accountId, reason, forceClose = false) => apiClient.patch(`/admin/accounts/${accountId}/force-close`, { reason, forceClose }),
  manualDeposit: (accountId, amount, description, reason) => apiClient.post(`/admin/accounts/${accountId}/deposit`, { amount, description, reason }),
  manualWithdraw: (accountId, amount, description, reason) => apiClient.post(`/admin/accounts/${accountId}/withdraw`, { amount, description, reason }),
  
  // Transaction management
  getAllTransactions: () => apiClient.get('/admin/transactions'),
  getFilteredTransactions: (filters) => apiClient.get('/admin/transactions/filter', { params: filters }),
  reverseTransaction: (transactionId) => apiClient.patch(`/admin/transactions/${transactionId}/reverse`),
};

export default apiClient;
