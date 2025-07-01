import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  IconButton,
  Divider,
  Stack,
  alpha,
  Skeleton,
  Paper,
  Menu,
  ListItemIcon,
  ListItemText,
  useTheme,
  Tooltip,
  Avatar,
  FormControlLabel,
  Switch
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  AccountBalance,
  Add,
  Savings,
  AccountBalanceWallet,
  MoreVert,
  Visibility,
  VisibilityOff,
  TrendingUp,
  ArrowBack,
  CreditCard,
  Lock,
  LockOpen,
  Edit,
  Delete,
  History,
  Send,
  Settings,
  Info,
  Business,
  Close,
  CheckCircle,
  Error
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { accountAPI } from '../services/api';

// Keyframes for animations
const slideIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

// Main Container with consistent background
const AccountsContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: `
    linear-gradient(135deg, 
      ${alpha('#006CAE', 0.08)} 0%, 
      ${alpha('#005A8A', 0.1)} 25%,
      ${alpha('#004A7D', 0.12)} 50%,
      ${alpha('#2985D6', 0.08)} 75%,
      ${alpha('#0E7BB8', 0.1)} 100%
    )`,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 80%, ${alpha('#006CAE', 0.12)} 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, ${alpha('#005A8A', 0.15)} 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, ${alpha('#2985D6', 0.08)} 0%, transparent 50%)
    `,
    pointerEvents: 'none',
  },
  padding: theme.spacing(3, 0, 6),
}));

// Header Card
const HeaderCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    #006CAE 0%, 
    #005A8A 50%,
    #2985D6 100%
  )`,
  borderRadius: theme.spacing(4),
  border: 'none',
  boxShadow: `
    0 20px 40px ${alpha('#006CAE', 0.3)},
    0 0 0 1px ${alpha('#fff', 0.1)} inset
  `,
  color: 'white',
  marginBottom: theme.spacing(5),
  position: 'relative',
  overflow: 'hidden',
  animation: `${slideIn} 0.8s ease-out`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    right: '-20%',
    width: '300px',
    height: '300px',
    background: `radial-gradient(circle, ${alpha('#fff', 0.1)} 0%, transparent 60%)`,
    borderRadius: '50%',
    animation: `${float} 6s ease-in-out infinite`,
  },
}));

// Modern Account Cards with glassmorphism
const AccountCard = styled(Card)(({ theme, accountType }) => {
  const getGradient = () => {
    switch (accountType?.toLowerCase()) {
      case 'checking':
        return 'linear-gradient(135deg, #006CAE 0%, #005A8A 100%)';
      case 'savings':
        return 'linear-gradient(135deg, #2985D6 0%, #0E7BB8 100%)';
      case 'business':
        return 'linear-gradient(135deg, #004A7D 0%, #003A5D 100%)';
      default:
        return 'linear-gradient(135deg, #338FFF 0%, #66ABFF 100%)';
    }
  };

  return {
    borderRadius: theme.spacing(3),
    background: getGradient(),
    color: 'white',
    border: 'none',
    boxShadow: `0 12px 40px ${alpha('#000', 0.15)}, 0 0 0 1px ${alpha('#fff', 0.1)} inset`,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    height: '100%',
    animation: `${slideIn} 0.6s ease-out`,
    '&:hover': {
      transform: 'translateY(-6px) scale(1.02)',
      boxShadow: `0 25px 80px ${alpha('#000', 0.25)}, 0 0 0 1px ${alpha('#fff', 0.2)} inset`,
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-30%',
      right: '-20%',
      width: '150px',
      height: '150px',
      background: `radial-gradient(circle, ${alpha('#fff', 0.1)} 0%, transparent 70%)`,
      borderRadius: '50%',
      animation: `${float} 6s ease-in-out infinite`,
    },
  };
});

// Create Account Card
const CreateAccountCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  border: `2px dashed ${alpha('#006CAE', 0.5)}`,
  background: `rgba(255, 255, 255, 0.15)`,
  backdropFilter: 'blur(20px)',
  boxShadow: `0 8px 32px ${alpha('#000', 0.1)}, 0 0 0 1px ${alpha('#fff', 0.2)} inset`,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: `${slideIn} 0.6s ease-out`,
  '&:hover': {
    transform: 'translateY(-6px) scale(1.02)',
    border: `2px dashed ${alpha('#006CAE', 0.8)}`,
    background: `rgba(255, 255, 255, 0.25)`,
    boxShadow: `0 25px 80px ${alpha('#000', 0.15)}, 0 0 0 1px ${alpha('#fff', 0.3)} inset`,
  },
}));

// Stats Cards
const StatsCard = styled(Card)(({ theme, variant = 'default' }) => {
  const getGradient = () => {
    switch (variant) {
      case 'primary':
        return 'linear-gradient(135deg, #006CAE 0%, #005A8A 100%)';
      case 'success':
        return 'linear-gradient(135deg, #2985D6 0%, #0E7BB8 100%)';
      case 'info':
        return 'linear-gradient(135deg, #338FFF 0%, #66ABFF 100%)';
      default:
        return `rgba(255, 255, 255, 0.25)`;
    }
  };

  return {
    borderRadius: theme.spacing(3),
    border: 'none',
    background: variant === 'default' 
      ? `rgba(255, 255, 255, 0.25)`
      : getGradient(),
    backdropFilter: 'blur(20px)',
    boxShadow: variant === 'default'
      ? `0 8px 32px ${alpha('#000', 0.1)}, 0 0 0 1px ${alpha('#fff', 0.2)} inset`
      : `0 8px 32px ${alpha('#000', 0.15)}, 0 0 0 1px ${alpha('#fff', 0.1)} inset`,
    color: variant === 'default' ? theme.palette.text.primary : 'white',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    animation: `${slideIn} 0.6s ease-out`,
    '&:hover': {
      transform: 'translateY(-8px) scale(1.02)',
      boxShadow: variant === 'default'
        ? `0 20px 60px ${alpha('#000', 0.15)}, 0 0 0 1px ${alpha('#fff', 0.3)} inset`
        : `0 20px 60px ${alpha('#000', 0.25)}, 0 0 0 1px ${alpha('#fff', 0.2)} inset`,
    },
  };
});

const Accounts = () => {
  const { user } = useAuth();
  const { showError, showSuccess } = useNotification();
  const navigate = useNavigate();
  const theme = useTheme();

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [accountMenuAnchor, setAccountMenuAnchor] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [freezeDialogOpen, setFreezeDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Create Account Form State
  const [newAccount, setNewAccount] = useState({
    accountType: '',
    initialDeposit: '',
    description: ''
  });

  // Edit Account Form State
  const [editAccount, setEditAccount] = useState({
    overdraftLimit: '',
    interestRate: '',
    overdraftProtection: false,
    description: ''
  });

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const response = await accountAPI.getAccounts();
      setAccounts(response.data?.accounts || response.accounts || []);
    } catch (error) {
      console.error('Error loading accounts:', error);
      showError('Failed to load accounts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const formatAccountNumber = (accountNumber) => {
    if (!accountNumber) return 'N/A';
    return accountNumber.toString().replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const getAccountIcon = (accountType) => {
    switch (accountType?.toLowerCase()) {
      case 'savings':
        return <Savings sx={{ fontSize: 40, color: 'inherit' }} />;
      case 'checking':
        return <AccountBalanceWallet sx={{ fontSize: 40, color: 'inherit' }} />;
      case 'business':
        return <Business sx={{ fontSize: 40, color: 'inherit' }} />;
      default:
        return <AccountBalance sx={{ fontSize: 40, color: 'inherit' }} />;
    }
  };

  const handleCreateAccount = async () => {
    try {
      if (!newAccount.accountType) {
        showError('Please select an account type');
        return;
      }

      const response = await accountAPI.createAccount({
        accountType: newAccount.accountType,
        initialDeposit: parseFloat(newAccount.initialDeposit) || 0,
        description: newAccount.description
      });

      showSuccess('Account created successfully!');
      setCreateDialogOpen(false);
      setNewAccount({ accountType: '', initialDeposit: '', description: '' });
      loadAccounts(); // Reload accounts
    } catch (error) {
      console.error('Error creating account:', error);
      showError(error.response?.data?.message || 'Failed to create account');
    }
  };

  const handleFreezeAccount = async () => {
    try {
      await accountAPI.freezeAccount(selectedAccount._id, {
        reason: 'Account frozen by user request'
      });
      showSuccess('Account frozen successfully');
      setFreezeDialogOpen(false);
      setAccountMenuAnchor(null);
      loadAccounts();
    } catch (error) {
      console.error('Error freezing account:', error);
      showError(error.response?.data?.message || 'Failed to freeze account');
    }
  };

  const handleUnfreezeAccount = async (accountId) => {
    try {
      await accountAPI.unfreezeAccount(accountId);
      showSuccess('Account unfrozen successfully');
      setAccountMenuAnchor(null);
      loadAccounts();
    } catch (error) {
      console.error('Error unfreezing account:', error);
      showError(error.response?.data?.message || 'Failed to unfreeze account');
    }
  };

  const handleUpdateAccount = async () => {
    try {
      const updateData = {};
      if (editAccount.overdraftLimit) updateData.overdraftLimit = parseFloat(editAccount.overdraftLimit);
      if (editAccount.interestRate) updateData.interestRate = parseFloat(editAccount.interestRate);
      if (editAccount.description) updateData.description = editAccount.description;
      updateData.overdraftProtection = editAccount.overdraftProtection;

      await accountAPI.updateAccount(selectedAccount._id, updateData);
      showSuccess('Account updated successfully');
      setEditDialogOpen(false);
      setAccountMenuAnchor(null);
      loadAccounts();
    } catch (error) {
      console.error('Error updating account:', error);
      showError(error.response?.data?.message || 'Failed to update account');
    }
  };

  const handleAccountMenuClick = (event, account) => {
    setAccountMenuAnchor(event.currentTarget);
    setSelectedAccount(account);
  };

  const calculateTotalBalance = () => {
    return accounts.reduce((sum, account) => sum + (account.balance || 0), 0);
  };

  const getActiveAccounts = () => {
    return accounts.filter(account => account.isActive && !account.isFrozen).length;
  };

  const openEditDialog = () => {
    setEditAccount({
      overdraftLimit: selectedAccount.overdraftLimit || '',
      interestRate: selectedAccount.interestRate || '',
      overdraftProtection: selectedAccount.overdraftProtection || false,
      description: selectedAccount.description || ''
    });
    setEditDialogOpen(true);
    setAccountMenuAnchor(null);
  };

  if (loading) {
    return (
      <AccountsContainer>
        <Container maxWidth="xl">
          <Skeleton 
            variant="rounded" 
            width="100%" 
            height={200} 
            sx={{ mb: 4, borderRadius: 4, bgcolor: alpha('#fff', 0.1) }} 
          />
          <Grid container spacing={4} sx={{ mb: 4 }}>
            {[1, 2, 3].map((i) => (
              <Grid item xs={12} md={4} key={i}>
                <Skeleton 
                  variant="rounded" 
                  width="100%" 
                  height={120} 
                  sx={{ borderRadius: 3, bgcolor: alpha('#fff', 0.1) }} 
                />
              </Grid>
            ))}
          </Grid>
          <Grid container spacing={4}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} sm={6} lg={3} key={i}>
                <Skeleton 
                  variant="rounded" 
                  width="100%" 
                  height={300} 
                  sx={{ borderRadius: 3, bgcolor: alpha('#fff', 0.1) }} 
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </AccountsContainer>
    );
  };

  return (
    <AccountsContainer>
      <Container maxWidth="xl">
        {/* Header Section */}
        <HeaderCard>
          <CardContent sx={{ p: 5 }}>
            <Grid container alignItems="center" spacing={4}>
              <Grid item>
                <IconButton
                  onClick={() => navigate('/dashboard')}
                  sx={{ 
                    bgcolor: alpha('#fff', 0.15), 
                    color: 'white',
                    '&:hover': { bgcolor: alpha('#fff', 0.25), transform: 'scale(1.1)' }
                  }}
                >
                  <ArrowBack />
                </IconButton>
              </Grid>
              <Grid item xs>
                <Typography variant="h3" fontWeight={700} gutterBottom>
                  Your Accounts
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Manage your banking accounts and view account details
                </Typography>
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={2}>
                  <Tooltip title="Hide/Show Balances">
                    <IconButton
                      onClick={() => setShowBalance(!showBalance)}
                      sx={{ 
                        bgcolor: alpha('#fff', 0.15), 
                        color: 'white',
                        '&:hover': { bgcolor: alpha('#fff', 0.25), transform: 'scale(1.1)' }
                      }}
                    >
                      {showBalance ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </Tooltip>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Add />}
                    onClick={() => setCreateDialogOpen(true)}
                    sx={{
                      bgcolor: alpha('#fff', 0.2),
                      color: 'white',
                      borderRadius: 3,
                      '&:hover': {
                        bgcolor: alpha('#fff', 0.3),
                        transform: 'scale(1.05)',
                      }
                    }}
                  >
                    Add Account
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </HeaderCard>

        {/* Stats Section */}
        <Grid container spacing={4} sx={{ mb: 5 }}>
          <Grid item xs={12} md={4}>
            <StatsCard variant="primary">
              <CardContent sx={{ p: 4, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <Avatar sx={{ bgcolor: alpha('#fff', 0.2), mx: 'auto', mb: 2, width: 64, height: 64 }}>
                  <AccountBalance sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h3" fontWeight={700} gutterBottom>
                  {accounts.length}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Total Accounts
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StatsCard variant="success">
              <CardContent sx={{ p: 4, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <Avatar sx={{ bgcolor: alpha('#fff', 0.2), mx: 'auto', mb: 2, width: 64, height: 64 }}>
                  <TrendingUp sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h3" fontWeight={700} gutterBottom>
                  {showBalance ? formatCurrency(calculateTotalBalance()) : '****'}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Total Balance
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StatsCard variant="info">
              <CardContent sx={{ p: 4, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <Avatar sx={{ bgcolor: alpha('#fff', 0.2), mx: 'auto', mb: 2, width: 64, height: 64 }}>
                  <CheckCircle sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h3" fontWeight={700} gutterBottom>
                  {getActiveAccounts()}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Active Accounts
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>
        </Grid>

        {/* Accounts Grid */}
        <Grid container spacing={4}>
          {/* Create Account Card */}
          <Grid item xs={12} sm={6} lg={3}>
            <CreateAccountCard onClick={() => setCreateDialogOpen(true)}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Add sx={{ fontSize: 60, color: '#006CAE', mb: 2 }} />
                <Typography variant="h6" fontWeight={600} color="#006CAE" gutterBottom>
                  Open New Account
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create a checking, savings, or business account
                </Typography>
              </CardContent>
            </CreateAccountCard>
          </Grid>

          {/* Account Cards */}
          {accounts.map((account) => (
            <Grid item xs={12} sm={6} lg={3} key={account._id}>
              <AccountCard accountType={account.accountType}>
                <CardContent sx={{ p: 4, position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    {getAccountIcon(account.accountType)}
                    <IconButton
                      onClick={(event) => handleAccountMenuClick(event, account)}
                      sx={{ color: 'white', p: 1 }}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom sx={{ textTransform: 'capitalize' }}>
                      {account.accountType} Account
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
                      {formatAccountNumber(account.accountNumber)}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Available Balance
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
                      {showBalance ? formatCurrency(account.balance) : '****'}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Chip 
                      label={account.isActive ? 'Active' : 'Inactive'}
                      color={account.isActive ? 'success' : 'default'}
                      sx={{ bgcolor: alpha('#fff', 0.2), color: 'white' }}
                    />
                    {account.isFrozen && (
                      <Chip 
                        label="Frozen"
                        sx={{ bgcolor: alpha('#ff5722', 0.8), color: 'white' }}
                      />
                    )}
                  </Stack>
                </CardContent>
              </AccountCard>
            </Grid>
          ))}
        </Grid>

        {/* Account Menu */}
        <Menu
          anchorEl={accountMenuAnchor}
          open={Boolean(accountMenuAnchor)}
          onClose={() => setAccountMenuAnchor(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={openEditDialog}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Account</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => {
            if (selectedAccount?.isFrozen) {
              handleUnfreezeAccount(selectedAccount._id);
            } else {
              setFreezeDialogOpen(true);
            }
          }}>
            <ListItemIcon>
              {selectedAccount?.isFrozen ? <LockOpen fontSize="small" /> : <Lock fontSize="small" />}
            </ListItemIcon>
            <ListItemText>
              {selectedAccount?.isFrozen ? 'Unfreeze Account' : 'Freeze Account'}
            </ListItemText>
          </MenuItem>
          <MenuItem onClick={() => navigate(`/accounts/${selectedAccount?._id}/transactions`)}>
            <ListItemIcon>
              <History fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Transactions</ListItemText>
          </MenuItem>
        </Menu>

        {/* Create Account Dialog */}
        <Dialog 
          open={createDialogOpen} 
          onClose={() => setCreateDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              backdropFilter: 'blur(20px)',
              background: alpha('#fff', 0.95)
            }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h5" fontWeight={600}>
              Create New Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose an account type to get started
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Account Type</InputLabel>
                  <Select
                    value={newAccount.accountType}
                    label="Account Type"
                    onChange={(e) => setNewAccount({ ...newAccount, accountType: e.target.value })}
                  >
                    <MenuItem value="checking">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <AccountBalanceWallet />
                        <Box>
                          <Typography variant="subtitle1">Checking Account</Typography>
                          <Typography variant="caption" color="text.secondary">
                            For everyday transactions and expenses
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                    <MenuItem value="savings">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Savings />
                        <Box>
                          <Typography variant="subtitle1">Savings Account</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Earn interest on your savings
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                    <MenuItem value="business">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Business />
                        <Box>
                          <Typography variant="subtitle1">Business Account</Typography>
                          <Typography variant="caption" color="text.secondary">
                            For business transactions and operations
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Initial Deposit"
                  type="number"
                  value={newAccount.initialDeposit}
                  onChange={(e) => setNewAccount({ ...newAccount, initialDeposit: e.target.value })}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                  }}
                  helperText="Minimum deposit required to open account"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Account Description (Optional)"
                  value={newAccount.description}
                  onChange={(e) => setNewAccount({ ...newAccount, description: e.target.value })}
                  placeholder="e.g., Emergency Fund, Vacation Savings"
                  helperText="Help you identify this account"
                />
              </Grid>
            </Grid>

            {newAccount.accountType && (
              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {newAccount.accountType === 'checking' ? 'Checking Account Features:' : 
                   newAccount.accountType === 'savings' ? 'Savings Account Features:' : 'Business Account Features:'}
                </Typography>
                <Typography variant="body2">
                  {newAccount.accountType === 'checking' 
                    ? '• Unlimited transactions • Debit card access • Online banking • Mobile payments'
                    : newAccount.accountType === 'savings'
                    ? '• Competitive interest rates • Limited transactions • FDIC insured • Perfect for saving goals'
                    : '• Business banking features • Commercial lending • Merchant services • Cash management'
                  }
                </Typography>
              </Alert>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setCreateDialogOpen(false)} size="large">
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleCreateAccount}
              disabled={!newAccount.accountType || !newAccount.initialDeposit}
              size="large"
              sx={{ borderRadius: 3 }}
            >
              Create Account
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Account Dialog */}
        <Dialog 
          open={editDialogOpen} 
          onClose={() => setEditDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              backdropFilter: 'blur(20px)',
              background: alpha('#fff', 0.95)
            }
          }}
        >
          <DialogTitle>
            <Typography variant="h5" fontWeight={600}>
              Edit Account Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Update your account preferences and limits
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Overdraft Limit"
                  type="number"
                  value={editAccount.overdraftLimit}
                  onChange={(e) => setEditAccount({ ...editAccount, overdraftLimit: e.target.value })}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                  }}
                  helperText="Maximum overdraft amount allowed"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Interest Rate"
                  type="number"
                  value={editAccount.interestRate}
                  onChange={(e) => setEditAccount({ ...editAccount, interestRate: e.target.value })}
                  InputProps={{
                    endAdornment: <Typography sx={{ ml: 1 }}>%</Typography>,
                  }}
                  helperText="Annual interest rate for savings accounts"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editAccount.overdraftProtection}
                      onChange={(e) => setEditAccount({ ...editAccount, overdraftProtection: e.target.checked })}
                    />
                  }
                  label="Overdraft Protection"
                />
                <Typography variant="caption" color="text.secondary" display="block">
                  Automatically transfer funds to cover overdrafts
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Account Description"
                  value={editAccount.description}
                  onChange={(e) => setEditAccount({ ...editAccount, description: e.target.value })}
                  placeholder="e.g., Primary Checking, Emergency Savings"
                  helperText="Custom name for this account"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setEditDialogOpen(false)} size="large">
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleUpdateAccount}
              size="large"
              sx={{ borderRadius: 3 }}
            >
              Update Account
            </Button>
          </DialogActions>
        </Dialog>

        {/* Freeze Account Dialog */}
        <Dialog 
          open={freezeDialogOpen} 
          onClose={() => setFreezeDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              backdropFilter: 'blur(20px)',
              background: alpha('#fff', 0.95)
            }
          }}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'warning.main' }}>
                <Lock />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Freeze Account
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This will temporarily suspend all transactions
                </Typography>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Account Freeze Warning
              </Typography>
              <Typography variant="body2">
                Freezing this account will prevent all incoming and outgoing transactions. 
                You can unfreeze the account at any time.
              </Typography>
            </Alert>
            
            <Typography variant="body1" gutterBottom>
              Account to freeze:
            </Typography>
            <Box sx={{ p: 2, bgcolor: alpha('#000', 0.05), borderRadius: 2, mb: 2 }}>
              <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                {selectedAccount?.accountType} Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatAccountNumber(selectedAccount?.accountNumber)}
              </Typography>
              <Typography variant="h6" color="primary">
                {showBalance ? formatCurrency(selectedAccount?.balance) : '****'}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setFreezeDialogOpen(false)} size="large">
              Cancel
            </Button>
            <Button
              onClick={handleFreezeAccount}
              variant="contained"
              color="error"
              size="large"
              sx={{ borderRadius: 3 }}
            >
              Freeze Account
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AccountsContainer>
  );
};

export default Accounts;
