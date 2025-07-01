import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Tab,
  Tabs,
  Switch,
  FormControlLabel,
  Divider,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  alpha,
  Badge,
  Avatar,
  Tooltip,
  Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  AdminPanelSettings,
  People,
  AccountBalance,
  SwapHoriz,
  Refresh,
  Edit,
  Delete,
  Block,
  CheckCircle,
  Cancel,
  Add,
  FilterList,
  Download,
  Upload,
  Visibility,
  PersonAdd,
  AccountBalanceWallet,
  TrendingUp,
  Security,
  Warning,
  MonetizationOn,
  Assessment,
  Settings,
  ExitToApp,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/adminAPI';

const AdminCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  borderRadius: 16,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '12px 12px 0 0',
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    minWidth: 120,
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 600,
}));

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // State for different admin data
  const [dashboardStats, setDashboardStats] = useState({});
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  
  // Dialog states
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openAccountDialog, setOpenAccountDialog] = useState(false);
  const [openTransactionDialog, setOpenTransactionDialog] = useState(false);
  const [openManualTransactionDialog, setOpenManualTransactionDialog] = useState(false);
  const [openUserDetailsDialog, setOpenUserDetailsDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [manualTransactionData, setManualTransactionData] = useState({
    type: 'deposit',
    amount: '',
    accountId: ''
  });

  // Check if current user is admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      setDashboardStats(response.data.data || response.data);
    } catch (err) {
      console.error('Stats error:', err);
      // Don't show error for stats as it's not critical
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers();
      setUsers(response.data.data?.users || response.data.users || response.data || []);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Users error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get user details
  const getUserDetails = async (userId) => {
    try {
      const response = await adminAPI.getUserDetails(userId);
      setSelectedUser(response.data.data?.user || response.data.user || response.data);
      setOpenUserDetailsDialog(true);
    } catch (err) {
      setError('Failed to fetch user details');
    }
  };

  // Fetch all accounts
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllAccounts();
      setAccounts(response.data.data?.accounts || response.data.accounts || response.data || []);
    } catch (err) {
      setError('Failed to fetch accounts');
      console.error('Accounts error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllTransactions();
      setTransactions(response.data.data?.transactions || response.data.transactions || response.data || []);
    } catch (err) {
      setError('Failed to fetch transactions');
      console.error('Transactions error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle user status (activate/deactivate)
  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      setLoading(true);
      await adminAPI.toggleUserStatus(userId, !currentStatus);
      setSuccess('User status updated successfully');
      await fetchUsers();
    } catch (err) {
      setError('Failed to update user status');
    } finally {
      setLoading(false);
    }
  };

  // Activate user
  const activateUser = async (userId) => {
    try {
      setLoading(true);
      await adminAPI.activateUser(userId);
      setSuccess('User activated successfully');
      await fetchUsers();
    } catch (err) {
      setError('Failed to activate user');
    } finally {
      setLoading(false);
    }
  };

  // Deactivate user
  const deactivateUser = async (userId) => {
    try {
      setLoading(true);
      await adminAPI.deactivateUser(userId);
      setSuccess('User deactivated successfully');
      await fetchUsers();
    } catch (err) {
      setError('Failed to deactivate user');
    } finally {
      setLoading(false);
    }
  };

  // Delete user profile
  const deleteUserProfile = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        setLoading(true);
        await adminAPI.deleteUser(userId);
        setSuccess('User deleted successfully');
        await fetchUsers();
      } catch (err) {
        setError('Failed to delete user');
      } finally {
        setLoading(false);
      }
    }
  };

  // Toggle account freeze
  const toggleAccountFreeze = async (accountId, currentStatus) => {
    try {
      setLoading(true);
      await adminAPI.toggleAccountFreeze(accountId, !currentStatus);
      setSuccess('Account status updated successfully');
      await fetchAccounts();
    } catch (err) {
      setError('Failed to update account status');
    } finally {
      setLoading(false);
    }
  };

  // Update account
  const updateAccount = async (accountId, updateData) => {
    try {
      setLoading(true);
      await adminAPI.updateAccount(accountId, updateData);
      setSuccess('Account updated successfully');
      await fetchAccounts();
    } catch (err) {
      setError('Failed to update account');
    } finally {
      setLoading(false);
    }
  };

  // Force close account
  const forceCloseAccount = async (accountId) => {
    if (window.confirm('Are you sure you want to force close this account? This action cannot be undone.')) {
      try {
        setLoading(true);
        await adminAPI.forceCloseAccount(accountId);
        setSuccess('Account closed successfully');
        await fetchAccounts();
      } catch (err) {
        setError('Failed to close account');
      } finally {
        setLoading(false);
      }
    }
  };

  // Manual deposit/withdrawal
  const handleManualTransaction = async () => {
    try {
      setLoading(true);
      if (manualTransactionData.type === 'deposit') {
        await adminAPI.manualDeposit(manualTransactionData.accountId, parseFloat(manualTransactionData.amount));
      } else {
        await adminAPI.manualWithdraw(manualTransactionData.accountId, parseFloat(manualTransactionData.amount));
      }
      setSuccess(`Manual ${manualTransactionData.type} completed successfully`);
      setOpenManualTransactionDialog(false);
      setManualTransactionData({ type: 'deposit', amount: '', accountId: '' });
      await fetchAccounts();
      if (transactions.length > 0) await fetchTransactions();
    } catch (err) {
      setError(`Failed to process manual ${manualTransactionData.type}`);
    } finally {
      setLoading(false);
    }
  };

  // Reverse transaction
  const reverseTransaction = async (transactionId) => {
    if (window.confirm('Are you sure you want to reverse this transaction?')) {
      try {
        setLoading(true);
        await adminAPI.reverseTransaction(transactionId);
        setSuccess('Transaction reversed successfully');
        await fetchTransactions();
        if (accounts.length > 0) await fetchAccounts();
      } catch (err) {
        setError('Failed to reverse transaction');
      } finally {
        setLoading(false);
      }
    }
  };

  const openManualTransactionModal = (accountId, type) => {
    setManualTransactionData({ ...manualTransactionData, accountId, type });
    setOpenManualTransactionDialog(true);
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchUsers();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === 2 && accounts.length === 0) fetchAccounts();
    if (newValue === 3 && transactions.length === 0) fetchTransactions();
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <AdminCard elevation={0}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box>
            <Typography variant="h3" fontWeight={700} color={color} sx={{ mb: 0.5 }}>
              {value || '0'}
            </Typography>
            <Typography variant="h6" color="text.primary" fontWeight={600}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ 
            p: 2, 
            borderRadius: 3, 
            backgroundColor: alpha(color, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {React.cloneElement(icon, { sx: { fontSize: 40, color } })}
          </Box>
        </Box>
      </CardContent>
    </AdminCard>
  );

  const tabs = [
    { label: 'Dashboard Overview', icon: <DashboardIcon /> },
    { label: 'User Management', icon: <People /> },
    { label: 'Account Management', icon: <AccountBalance /> },
    { label: 'Transaction Management', icon: <SwapHoriz /> },
    { label: 'System Controls', icon: <Settings /> }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: `linear-gradient(135deg, 
        ${alpha('#1e3a8a', 0.05)} 0%, 
        ${alpha('#3b82f6', 0.03)} 50%,
        ${alpha('#e0e7ff', 0.05)} 100%)`,
    }}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header */}
        <Paper elevation={0} sx={{ 
          background: `linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)`,
          color: 'white',
          p: 4,
          borderRadius: 3,
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3,
          }
        }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" position="relative" zIndex={1}>
            <Box display="flex" alignItems="center" gap={3}>
              <Box sx={{ 
                p: 2, 
                borderRadius: 3, 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)'
              }}>
                <AdminPanelSettings sx={{ fontSize: 48 }} />
              </Box>
              <Box>
                <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
                  Admin Control Panel
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Welcome back, {user?.firstName || 'Administrator'}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8, mt: 0.5 }}>
                  Complete system administration and monitoring
                </Typography>
              </Box>
            </Box>
            <ActionButton
              variant="contained"
              onClick={handleLogout}
              startIcon={<ExitToApp />}
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }
              }}
            >
              Logout
            </ActionButton>
          </Box>
        </Paper>

        {/* Alerts */}
        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={() => setError('')}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity="error" onClose={() => setError('')} sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
        
        <Snackbar 
          open={!!success} 
          autoHideDuration={4000} 
          onClose={() => setSuccess('')}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity="success" onClose={() => setSuccess('')} sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>

        {/* Dashboard Stats - only show on overview tab */}
        {activeTab === 0 && (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={3}>
                <StatCard
                  title="Total Users"
                  value={dashboardStats.totalUsers || users.length}
                  icon={<People />}
                  color="#1e3a8a"
                  subtitle="Active system users"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <StatCard
                  title="Total Accounts"
                  value={dashboardStats.totalAccounts || accounts.length}
                  icon={<AccountBalance />}
                  color="#059669"
                  subtitle="Banking accounts"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <StatCard
                  title="Total Transactions"
                  value={dashboardStats.totalTransactions || transactions.length}
                  icon={<SwapHoriz />}
                  color="#7c3aed"
                  subtitle="All time transactions"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <StatCard
                  title="System Status"
                  value="Online"
                  icon={<CheckCircle />}
                  color="#10b981"
                  subtitle="All systems operational"
                />
              </Grid>
            </Grid>

            {/* Quick Actions */}
            <AdminCard sx={{ mb: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <ActionButton
                      fullWidth
                      variant="contained"
                      startIcon={<Refresh />}
                      onClick={() => {
                        fetchDashboardStats();
                        fetchUsers();
                        fetchAccounts();
                        fetchTransactions();
                      }}
                      sx={{ py: 1.5 }}
                    >
                      Refresh All Data
                    </ActionButton>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <ActionButton
                      fullWidth
                      variant="outlined"
                      startIcon={<People />}
                      onClick={() => setActiveTab(1)}
                      sx={{ py: 1.5 }}
                    >
                      Manage Users
                    </ActionButton>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <ActionButton
                      fullWidth
                      variant="outlined"
                      startIcon={<AccountBalance />}
                      onClick={() => setActiveTab(2)}
                      sx={{ py: 1.5 }}
                    >
                      Manage Accounts
                    </ActionButton>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <ActionButton
                      fullWidth
                      variant="outlined"
                      startIcon={<SwapHoriz />}
                      onClick={() => setActiveTab(3)}
                      sx={{ py: 1.5 }}
                    >
                      View Transactions
                    </ActionButton>
                  </Grid>
                </Grid>
              </CardContent>
            </AdminCard>
          </>
        )}

        {/* Main Content Tabs */}
        <AdminCard elevation={0}>
          <StyledTabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 2 }}
          >
            {tabs.map((tab, index) => (
              <Tab 
                key={index}
                label={tab.label} 
                icon={tab.icon}
                iconPosition="start"
              />
            ))}
          </StyledTabs>

          <Divider />

          {/* User Management Tab */}
          {activeTab === 1 && (
            <Box sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    User Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage all system users, view details, and control access
                  </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                  <ActionButton
                    startIcon={<Refresh />}
                    onClick={fetchUsers}
                    disabled={loading}
                    variant="outlined"
                  >
                    Refresh
                  </ActionButton>
                </Stack>
              </Box>

              {loading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #e5e7eb' }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Joined</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user._id} hover>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={2}>
                              <Avatar sx={{ 
                                backgroundColor: user.role === 'admin' ? '#f59e0b' : '#3b82f6',
                                width: 32,
                                height: 32,
                                fontSize: '0.875rem'
                              }}>
                                {user.firstName?.[0] || user.email?.[0] || 'U'}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight={600}>
                                  {user.firstName} {user.lastName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  ID: {user._id?.slice(-6)}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {user.email}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={user.role.toUpperCase()} 
                              color={user.role === 'admin' ? 'warning' : 'primary'}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={user.isActive ? 'Active' : 'Inactive'} 
                              color={user.isActive ? 'success' : 'error'}
                              size="small"
                              variant="filled"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() => getUserDetails(user._id)}
                                  color="primary"
                                >
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={user.isActive ? 'Deactivate User' : 'Activate User'}>
                                <IconButton
                                  size="small"
                                  onClick={() => toggleUserStatus(user._id, user.isActive)}
                                  color={user.isActive ? 'error' : 'success'}
                                >
                                  {user.isActive ? <Block /> : <CheckCircle />}
                                </IconButton>
                              </Tooltip>
                              {user.role !== 'admin' && (
                                <Tooltip title="Delete User">
                                  <IconButton
                                    size="small"
                                    onClick={() => deleteUserProfile(user._id)}
                                    color="error"
                                  >
                                    <Delete />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}

          {/* Account Management Tab */}
          {activeTab === 2 && (
            <Box sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    Account Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monitor and manage banking accounts, freeze/unfreeze, and perform manual transactions
                  </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                  <ActionButton
                    startIcon={<Refresh />}
                    onClick={fetchAccounts}
                    disabled={loading}
                    variant="outlined"
                  >
                    Refresh
                  </ActionButton>
                </Stack>
              </Box>

              {loading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #e5e7eb' }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Account Number</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Balance</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Owner</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {accounts.map((account) => (
                        <TableRow key={account._id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              {account.accountNumber}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {account._id?.slice(-6)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={account.accountType} 
                              size="small" 
                              variant="outlined"
                              color="primary"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600} color="primary.main">
                              ${account.balance?.toLocaleString() || '0.00'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={account.isFrozen ? 'Frozen' : 'Active'} 
                              color={account.isFrozen ? 'error' : 'success'}
                              size="small"
                              variant="filled"
                            />
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2">
                                {account.userId?.firstName} {account.userId?.lastName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {account.userId?.email}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Tooltip title={account.isFrozen ? 'Unfreeze Account' : 'Freeze Account'}>
                                <IconButton
                                  size="small"
                                  onClick={() => toggleAccountFreeze(account._id, account.isFrozen)}
                                  color={account.isFrozen ? 'success' : 'error'}
                                >
                                  {account.isFrozen ? <CheckCircle /> : <Block />}
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Manual Deposit">
                                <IconButton
                                  size="small"
                                  onClick={() => openManualTransactionModal(account._id, 'deposit')}
                                  color="success"
                                >
                                  <Add />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Manual Withdrawal">
                                <IconButton
                                  size="small"
                                  onClick={() => openManualTransactionModal(account._id, 'withdraw')}
                                  color="warning"
                                >
                                  <Download />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Force Close Account">
                                <IconButton
                                  size="small"
                                  onClick={() => forceCloseAccount(account._id)}
                                  color="error"
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}

          {/* Transaction Management Tab */}
          {activeTab === 3 && (
            <Box sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    Transaction Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    View all transactions, filter results, and reverse transactions when necessary
                  </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                  <ActionButton
                    startIcon={<Refresh />}
                    onClick={fetchTransactions}
                    disabled={loading}
                    variant="outlined"
                  >
                    Refresh
                  </ActionButton>
                </Stack>
              </Box>

              {loading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #e5e7eb' }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>From Account</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>To Account</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction._id} hover>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {new Date(transaction.createdAt).toLocaleDateString()}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(transaction.createdAt).toLocaleTimeString()}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={transaction.type} 
                              size="small" 
                              variant="outlined"
                              color={
                                transaction.type === 'transfer' ? 'primary' :
                                transaction.type === 'deposit' ? 'success' :
                                transaction.type === 'withdrawal' ? 'warning' : 'default'
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Typography 
                              variant="body2" 
                              fontWeight={600}
                              color={
                                transaction.type === 'deposit' ? 'success.main' :
                                transaction.type === 'withdrawal' ? 'error.main' : 'text.primary'
                              }
                            >
                              ${transaction.amount?.toLocaleString() || '0.00'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {transaction.fromAccount?.accountNumber || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {transaction.toAccount?.accountNumber || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={transaction.status} 
                              color={
                                transaction.status === 'completed' ? 'success' : 
                                transaction.status === 'pending' ? 'warning' :
                                transaction.status === 'failed' ? 'error' : 'default'
                              }
                              size="small"
                              variant="filled"
                            />
                          </TableCell>
                          <TableCell>
                            {transaction.status === 'completed' && (
                              <Tooltip title="Reverse Transaction">
                                <IconButton
                                  size="small"
                                  onClick={() => reverseTransaction(transaction._id)}
                                  color="error"
                                >
                                  <Cancel />
                                </IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}

          {/* System Controls Tab */}
          {activeTab === 4 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
                System Controls
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <AdminCard>
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" alignItems="center" gap={2} mb={3}>
                        <Security color="primary" />
                        <Typography variant="h6" fontWeight={600}>
                          Security Settings
                        </Typography>
                      </Box>
                      <Stack spacing={2}>
                        <ActionButton
                          fullWidth
                          variant="outlined"
                          startIcon={<Security />}
                          onClick={() => setSuccess('Security audit initiated')}
                        >
                          Run Security Audit
                        </ActionButton>
                        <ActionButton
                          fullWidth
                          variant="outlined"
                          startIcon={<Assessment />}
                          onClick={() => setSuccess('System report generated')}
                        >
                          Generate System Report
                        </ActionButton>
                      </Stack>
                    </CardContent>
                  </AdminCard>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <AdminCard>
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" alignItems="center" gap={2} mb={3}>
                        <MonetizationOn color="success" />
                        <Typography variant="h6" fontWeight={600}>
                          Financial Controls
                        </Typography>
                      </Box>
                      <Stack spacing={2}>
                        <ActionButton
                          fullWidth
                          variant="outlined"
                          startIcon={<TrendingUp />}
                          onClick={() => setSuccess('Financial summary generated')}
                        >
                          Generate Financial Summary
                        </ActionButton>
                        <ActionButton
                          fullWidth
                          variant="outlined"
                          startIcon={<Assessment />}
                          onClick={() => setSuccess('Audit trail exported')}
                        >
                          Export Audit Trail
                        </ActionButton>
                      </Stack>
                    </CardContent>
                  </AdminCard>
                </Grid>
              </Grid>
            </Box>
          )}
        </AdminCard>

        {loading && (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress size={60} />
          </Box>
        )}

        {/* User Details Dialog */}
        <Dialog 
          open={openUserDetailsDialog} 
          onClose={() => setOpenUserDetailsDialog(false)} 
          maxWidth="md" 
          fullWidth
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ backgroundColor: 'primary.main' }}>
                {selectedUser?.firstName?.[0] || 'U'}
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {selectedUser?.firstName} {selectedUser?.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  User Details & Information
                </Typography>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedUser && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Email Address
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedUser.email}
                  </Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    User Role
                  </Typography>
                  <Chip 
                    label={selectedUser.role.toUpperCase()} 
                    color={selectedUser.role === 'admin' ? 'warning' : 'primary'}
                    sx={{ mb: 2 }}
                  />
                  
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Account Status
                  </Typography>
                  <Chip 
                    label={selectedUser.isActive ? 'Active' : 'Inactive'} 
                    color={selectedUser.isActive ? 'success' : 'error'}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    User ID
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, fontFamily: 'monospace' }}>
                    {selectedUser._id}
                  </Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Join Date
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Last Updated
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedUser.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpenUserDetailsDialog(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Manual Transaction Dialog */}
        <Dialog 
          open={openManualTransactionDialog} 
          onClose={() => setOpenManualTransactionDialog(false)} 
          maxWidth="sm" 
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={2}>
              {manualTransactionData.type === 'deposit' ? 
                <MonetizationOn color="success" /> : 
                <Download color="warning" />
              }
              <Box>
                <Typography variant="h6">
                  Manual {manualTransactionData.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Process a manual transaction for this account
                </Typography>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <TextField
                autoFocus
                margin="dense"
                label="Amount"
                type="number"
                fullWidth
                variant="outlined"
                value={manualTransactionData.amount}
                onChange={(e) => setManualTransactionData({
                  ...manualTransactionData,
                  amount: e.target.value
                })}
                inputProps={{
                  min: 0,
                  step: 0.01
                }}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                }}
                sx={{ mb: 2 }}
              />
              <Alert 
                severity={manualTransactionData.type === 'deposit' ? 'info' : 'warning'}
                sx={{ mt: 2 }}
              >
                This action will {manualTransactionData.type === 'deposit' ? 'add funds to' : 'remove funds from'} the selected account immediately.
              </Alert>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpenManualTransactionDialog(false)}>
              Cancel
            </Button>
            <ActionButton 
              onClick={handleManualTransaction}
              variant="contained"
              disabled={!manualTransactionData.amount || parseFloat(manualTransactionData.amount) <= 0 || loading}
              color={manualTransactionData.type === 'deposit' ? 'success' : 'warning'}
              startIcon={manualTransactionData.type === 'deposit' ? <Add /> : <Download />}
            >
              Process {manualTransactionData.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
            </ActionButton>
          </DialogActions>
        </Dialog>

        {/* Global Loading Backdrop */}
        {loading && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}
          >
            <Box
              sx={{
                backgroundColor: 'white',
                padding: 4,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <CircularProgress size={50} />
              <Typography variant="h6">
                Processing...
              </Typography>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default AdminDashboard;
