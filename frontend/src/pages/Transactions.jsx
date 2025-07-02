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
  useTheme,
  Tooltip,
  Avatar,
  InputAdornment,
  Fab,
  Badge
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Receipt,
  Add,
  TrendingUp,
  TrendingDown,
  SwapHoriz,
  ArrowBack,
  Search,
  FilterList,
  Download,
  Visibility,
  Send,
  AccountBalance,
  DateRange,
  CheckCircle,
  Cancel,
  Pending,
  Refresh,
  PlayArrow
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { transactionAPI, accountAPI } from '../services/api';

// Keyframes for animations
const slideIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

// Main Container with consistent background
const TransactionsContainer = styled(Box)(({ theme }) => ({
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

// Transaction Card with glassmorphism
const TransactionCard = styled(Card)(({ theme, transactionType }) => {
  const getBorderColor = () => {
    switch (transactionType?.toLowerCase()) {
      case 'deposit':
        return '#2985D6';
      case 'withdrawal':
        return '#0E7BB8';
      case 'transfer':
        return '#006CAE';
      default:
        return '#338FFF';
    }
  };

  return {
    borderRadius: theme.spacing(2),
    background: `rgba(255, 255, 255, 0.15)`,
    backdropFilter: 'blur(20px)',
    boxShadow: `0 8px 32px ${alpha('#000', 0.1)}, 0 0 0 1px ${alpha('#fff', 0.2)} inset`,
    borderLeft: `4px solid ${getBorderColor()}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    animation: `${slideIn} 0.6s ease-out`,
    '&:hover': {
      transform: 'translateY(-2px) scale(1.01)',
      background: `rgba(255, 255, 255, 0.25)`,
      boxShadow: `0 12px 40px ${alpha('#000', 0.15)}, 0 0 0 1px ${alpha('#fff', 0.3)} inset`,
    },
  };
});

// Stats Cards
const StatsCard = styled(Card)(({ theme, variant = 'default' }) => {
  const getGradient = () => {
    switch (variant) {
      case 'income':
        return 'linear-gradient(135deg, #2985D6 0%, #0E7BB8 100%)';
      case 'expense':
        return 'linear-gradient(135deg, #0E7BB8 0%, #2985D6 100%)';
      case 'transfer':
        return 'linear-gradient(135deg, #006CAE 0%, #005A8A 100%)';
      case 'pending':
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
    '&::before': variant !== 'default' ? {
      content: '""',
      position: 'absolute',
      top: '-50%',
      right: '-30%',
      width: '100px',
      height: '100px',
      background: `radial-gradient(circle, ${alpha('#fff', 0.15)} 0%, transparent 70%)`,
      borderRadius: '50%',
      animation: `${float} 5s ease-in-out infinite`,
    } : {},
  };
});

// Action Button
const ActionButton = styled(Button)(({ theme, variant: buttonVariant }) => {
  const getGradient = () => {
    switch (buttonVariant) {
      case 'deposit':
        return 'linear-gradient(135deg, #2985D6 0%, #0E7BB8 100%)';
      case 'withdraw':
        return 'linear-gradient(135deg, #0E7BB8 0%, #2985D6 100%)';
      case 'transfer':
        return 'linear-gradient(135deg, #006CAE 0%, #005A8A 100%)';
      default:
        return 'linear-gradient(135deg, #338FFF 0%, #66ABFF 100%)';
    }
  };

  return {
    borderRadius: theme.spacing(2),
    background: getGradient(),
    color: 'white',
    padding: theme.spacing(2, 4),
    fontSize: '1rem',
    fontWeight: 600,
    boxShadow: `0 8px 32px ${alpha('#000', 0.2)}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-2px) scale(1.05)',
      boxShadow: `0 12px 40px ${alpha('#000', 0.3)}`,
    },
  };
});

// Floating Action Button
const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  background: 'linear-gradient(135deg, #006CAE 0%, #005A8A 100%)',
  boxShadow: `0 8px 32px ${alpha('#006CAE', 0.4)}`,
  '&:hover': {
    background: 'linear-gradient(135deg, #005A8A 0%, #006CAE 100%)',
    transform: 'scale(1.1)',
    boxShadow: `0 12px 40px ${alpha('#006CAE', 0.6)}`,
  },
  animation: `${pulse} 2s ease-in-out infinite`,
}));

const Transactions = () => {
  const { user } = useAuth();
  const { showError, showSuccess } = useNotification();
  const navigate = useNavigate();
  const theme = useTheme();

  // State management
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [allBankAccounts, setAllBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Transaction form state
  const [transactionForm, setTransactionForm] = useState({
    amount: '',
    description: '',
    toAccountNumber: '',
    selectedRecipient: '', // For dropdown selection
    accountId: ''
  });

  // Filter state
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: ''
  });

  // Load data
  const loadTransactions = async () => {
    try {
      setLoading(true);
      
      // Prepare filter parameters for API
      const filterParams = {
        page: 1,
        limit: 50
      };

      // Add non-empty filters to the params
      if (filters.type) filterParams.type = filters.type;
      if (filters.status) filterParams.status = filters.status;
      if (filters.dateFrom) filterParams.dateFrom = filters.dateFrom;
      if (filters.dateTo) filterParams.dateTo = filters.dateTo;
      if (filters.minAmount) filterParams.minAmount = parseFloat(filters.minAmount);
      if (filters.maxAmount) filterParams.maxAmount = parseFloat(filters.maxAmount);
      
      const [transactionsResponse, accountsResponse, transferableAccountsResponse] = await Promise.all([
        transactionAPI.getAllUserTransactions(filterParams),
        accountAPI.getAccounts(),
        accountAPI.getTransferableAccounts()
      ]);
      
      setTransactions(transactionsResponse.data?.transactions || transactionsResponse.transactions || []);
      setAccounts(accountsResponse.data?.accounts || accountsResponse.accounts || []);
      // Use all transferable accounts from the database
      const transferableAccounts = transferableAccountsResponse.data?.accounts || transferableAccountsResponse.accounts || [];
      console.log('Transferable accounts loaded:', transferableAccounts.length);
      console.log('Transferable accounts:', transferableAccounts);
      setAllBankAccounts(transferableAccounts);
    } catch (error) {
      console.error('Error loading transactions:', error);
      showError('Failed to load transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
    showSuccess('Transactions refreshed successfully');
  };

  useEffect(() => {
    loadTransactions();
  }, [filters]);

  // Filter and Export Functions
  const applyFilters = () => {
    setFilterDialogOpen(false);
    loadTransactions(); // This will use the current filters state
    showSuccess('Filters applied successfully');
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      minAmount: '',
      maxAmount: ''
    });
    showSuccess('Filters cleared');
  };

  const handleExport = () => {
    try {
      // Get the currently displayed transactions (filtered + searched)
      const dataToExport = filteredTransactions;
      
      if (dataToExport.length === 0) {
        showError('No transactions to export');
        return;
      }

      // Create CSV content
      const headers = ['Date', 'Type', 'Amount', 'Status', 'Description', 'Account', 'Reference'];
      const csvContent = [
        headers.join(','),
        ...dataToExport.map(transaction => [
          new Date(transaction.createdAt).toLocaleDateString(),
          transaction.type,
          transaction.amount,
          transaction.status,
          `"${transaction.description || 'N/A'}"`,
          transaction.accountId?.accountNumber || 'N/A',
          transaction._id
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showSuccess(`Exported ${dataToExport.length} transactions successfully`);
    } catch (error) {
      console.error('Export error:', error);
      showError('Failed to export transactions. Please try again.');
    }
  };

  // Utility functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const getTransactionIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'deposit':
        return <TrendingUp sx={{ color: '#2985D6' }} />;
      case 'withdrawal':
        return <TrendingDown sx={{ color: '#0E7BB8' }} />;
      case 'transfer':
        return <SwapHoriz sx={{ color: '#006CAE' }} />;
      default:
        return <Receipt sx={{ color: '#338FFF' }} />;
    }
  };

  const getStatusChip = (status) => {
    const config = {
      completed: { 
        color: 'success', 
        label: 'Completed', 
        icon: <CheckCircle sx={{ fontSize: 16 }} />,
        bgcolor: alpha('#2985D6', 0.1),
        textColor: '#2985D6'
      },
      pending: { 
        color: 'warning', 
        label: 'Pending', 
        icon: <Pending sx={{ fontSize: 16 }} />,
        bgcolor: alpha('#FF9800', 0.1),
        textColor: '#FF9800'
      },
      failed: { 
        color: 'error', 
        label: 'Failed', 
        icon: <Cancel sx={{ fontSize: 16 }} />,
        bgcolor: alpha('#f44336', 0.1),
        textColor: '#f44336'
      },
      processing: { 
        color: 'info', 
        label: 'Processing', 
        icon: <PlayArrow sx={{ fontSize: 16 }} />,
        bgcolor: alpha('#006CAE', 0.1),
        textColor: '#006CAE'
      }
    };

    const statusConfig = config[status?.toLowerCase()] || config.pending;

    return (
      <Chip
        icon={statusConfig.icon}
        label={statusConfig.label}
        size="small"
        sx={{
          bgcolor: statusConfig.bgcolor,
          color: statusConfig.textColor,
          border: `1px solid ${alpha(statusConfig.textColor, 0.3)}`,
          fontWeight: 600,
          '& .MuiChip-icon': {
            color: statusConfig.textColor
          }
        }}
      />
    );
  };

  const handleTransaction = async () => {
    try {
      if (!transactionForm.amount || !transactionForm.accountId) {
        showError('Please fill in all required fields');
        return;
      }

      const amount = parseFloat(transactionForm.amount);
      if (amount <= 0) {
        showError('Amount must be greater than 0');
        return;
      }

      let response;
      switch (actionType) {
        case 'deposit':
          response = await transactionAPI.deposit(
            transactionForm.accountId,
            amount,
            transactionForm.description || 'Deposit transaction'
          );
          break;
        case 'withdraw':
          response = await transactionAPI.withdraw(
            transactionForm.accountId,
            amount,
            transactionForm.description || 'Withdrawal transaction'
          );
          break;
        case 'transfer':
          if (!transactionForm.toAccountNumber) {
            showError('Please enter the recipient account number');
            return;
          }
          response = await transactionAPI.transfer(
            transactionForm.accountId,
            transactionForm.toAccountNumber,
            amount,
            transactionForm.description || 'Transfer transaction'
          );
          break;
        default:
          showError('Invalid transaction type');
          return;
      }

      showSuccess(`${actionType.charAt(0).toUpperCase() + actionType.slice(1)} completed successfully!`);
      setActionDialogOpen(false);
      setTransactionForm({ 
        amount: '', 
        description: '', 
        toAccountNumber: '', 
        selectedRecipient: '',
        accountId: '' 
      });
      loadTransactions();
    } catch (error) {
      console.error(`Error performing ${actionType}:`, error);
      showError(error.response?.data?.message || `Failed to complete ${actionType}`);
    }
  };

  const openActionDialog = (type) => {
    setActionType(type);
    setActionDialogOpen(true);
  };

  const openTransactionDetails = (transaction) => {
    setTransactionDetails(transaction);
    setDetailsDialogOpen(true);
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTransactionStats = () => {
    const income = transactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const expenses = transactions
      .filter(t => t.type === 'withdrawal')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const transfers = transactions
      .filter(t => t.type === 'transfer')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const pending = transactions.filter(t => t.status === 'pending').length;

    return { income, expenses, transfers, pending };
  };

  const stats = getTransactionStats();

  if (loading) {
    return (
      <TransactionsContainer>
        <Container maxWidth="xl">
          <Skeleton 
            variant="rounded" 
            width="100%" 
            height={200} 
            sx={{ mb: 4, borderRadius: 4, bgcolor: alpha('#fff', 0.1) }} 
          />
          <Grid container spacing={4} sx={{ mb: 4 }}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Skeleton 
                  variant="rounded" 
                  width="100%" 
                  height={120} 
                  sx={{ borderRadius: 3, bgcolor: alpha('#fff', 0.1) }} 
                />
              </Grid>
            ))}
          </Grid>
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid item xs={12} key={i}>
                <Skeleton 
                  variant="rounded" 
                  width="100%" 
                  height={80} 
                  sx={{ borderRadius: 2, bgcolor: alpha('#fff', 0.1) }} 
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </TransactionsContainer>
    );
  }

  return (
    <TransactionsContainer>
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
                  Transaction History
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Track all your financial activities and manage transactions
                </Typography>
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={2}>
                  <Tooltip title="Refresh Transactions">
                    <IconButton
                      onClick={handleRefresh}
                      disabled={refreshing}
                      sx={{ 
                        bgcolor: alpha('#fff', 0.15), 
                        color: 'white',
                        '&:hover': { bgcolor: alpha('#fff', 0.25), transform: 'scale(1.1)' }
                      }}
                    >
                      <Refresh sx={{ 
                        animation: refreshing ? 'spin 1s linear infinite' : 'none',
                        '@keyframes spin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' }
                        }
                      }} />
                    </IconButton>
                  </Tooltip>
                  <ActionButton 
                    variant="deposit"
                    startIcon={<Add />}
                    onClick={() => openActionDialog('deposit')}
                  >
                    New Transaction
                  </ActionButton>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </HeaderCard>

        {/* Stats Section */}
        <Grid container spacing={4} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard variant="income">
              <CardContent sx={{ p: 4, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <Avatar sx={{ bgcolor: alpha('#fff', 0.2), mx: 'auto', mb: 2, width: 56, height: 56 }}>
                  <TrendingUp sx={{ fontSize: 28 }} />
                </Avatar>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {formatCurrency(stats.income)}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Total Income
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard variant="expense">
              <CardContent sx={{ p: 4, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <Avatar sx={{ bgcolor: alpha('#fff', 0.2), mx: 'auto', mb: 2, width: 56, height: 56 }}>
                  <TrendingDown sx={{ fontSize: 28 }} />
                </Avatar>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {formatCurrency(stats.expenses)}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Total Expenses
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard variant="transfer">
              <CardContent sx={{ p: 4, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <Avatar sx={{ bgcolor: alpha('#fff', 0.2), mx: 'auto', mb: 2, width: 56, height: 56 }}>
                  <SwapHoriz sx={{ fontSize: 28 }} />
                </Avatar>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {formatCurrency(stats.transfers)}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Total Transfers
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard variant="pending">
              <CardContent sx={{ p: 4, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <Avatar sx={{ bgcolor: alpha('#fff', 0.2), mx: 'auto', mb: 2, width: 56, height: 56 }}>
                  <Badge badgeContent={stats.pending} color="error">
                    <Pending sx={{ fontSize: 28 }} />
                  </Badge>
                </Avatar>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {stats.pending}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Pending
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <ActionButton 
              variant="deposit"
              fullWidth
              startIcon={<TrendingUp />}
              onClick={() => openActionDialog('deposit')}
            >
              Deposit Money
            </ActionButton>
          </Grid>
          <Grid item xs={12} md={4}>
            <ActionButton 
              variant="withdraw"
              fullWidth
              startIcon={<TrendingDown />}
              onClick={() => openActionDialog('withdraw')}
            >
              Withdraw Money
            </ActionButton>
          </Grid>
          <Grid item xs={12} md={4}>
            <ActionButton 
              variant="transfer"
              fullWidth
              startIcon={<SwapHoriz />}
              onClick={() => openActionDialog('transfer')}
            >
              Transfer Money
            </ActionButton>
          </Grid>
        </Grid>

        {/* Search and Filter Bar */}
        <Card sx={{ 
          mb: 4, 
          background: alpha('#fff', 0.15), 
          backdropFilter: 'blur(20px)',
          borderRadius: 3
        }}>
          <CardContent sx={{ p: 3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <TextField
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ flexGrow: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                startIcon={<FilterList />}
                onClick={() => setFilterDialogOpen(true)}
                variant="outlined"
              >
                Filters
              </Button>
              <Button
                startIcon={<Download />}
                variant="outlined"
                onClick={handleExport}
              >
                Export
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Grid container spacing={3}>
          {filteredTransactions.length === 0 ? (
            <Grid item xs={12}>
              <Card sx={{ 
                background: alpha('#fff', 0.15), 
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                textAlign: 'center',
                py: 8
              }}>
                <CardContent>
                  <Receipt sx={{ fontSize: 120, color: 'text.secondary', mb: 3, opacity: 0.3 }} />
                  <Typography variant="h4" color="text.secondary" gutterBottom>
                    No transactions found
                  </Typography>
                  <Typography variant="h6" color="text.secondary" mb={4}>
                    Start by making your first transaction
                  </Typography>
                  <ActionButton 
                    variant="deposit"
                    startIcon={<Add />}
                    onClick={() => openActionDialog('deposit')}
                  >
                    Make First Transaction
                  </ActionButton>
                </CardContent>
              </Card>
            </Grid>
          ) : (
            filteredTransactions.map((transaction, index) => (
              <Grid item xs={12} key={transaction._id || index}>
                <TransactionCard 
                  transactionType={transaction.type}
                  onClick={() => openTransactionDetails(transaction)}
                  sx={{ cursor: 'pointer' }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Grid container alignItems="center" spacing={3}>
                      <Grid item>
                        <Avatar sx={{ 
                          bgcolor: alpha('#006CAE', 0.15), 
                          width: 64, 
                          height: 64,
                          border: `3px solid ${alpha('#006CAE', 0.2)}`,
                          color: '#006CAE'
                        }}>
                          {getTransactionIcon(transaction.type)}
                        </Avatar>
                      </Grid>
                      
                      <Grid item xs>
                        <Stack spacing={1}>
                          <Typography variant="h6" fontWeight={700} color="text.primary">
                            {transaction.description || `${transaction.type?.charAt(0).toUpperCase() + transaction.type?.slice(1)} Transaction`}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DateRange sx={{ fontSize: 16 }} />
                            {new Date(transaction.createdAt || Date.now()).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Typography>
                          {transaction.type === 'transfer' && transaction.toAccountNumber && (
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Send sx={{ fontSize: 16 }} />
                              {transaction.toAccountId?.userId?.firstName && transaction.toAccountId?.userId?.lastName ? (
                                <span>
                                  To: {transaction.toAccountId.userId.firstName} {transaction.toAccountId.userId.lastName} (••••{transaction.toAccountNumber?.slice(-4)})
                                </span>
                              ) : (
                                <span>To: ••••{transaction.toAccountNumber?.slice(-4)}</span>
                              )}
                            </Typography>
                          )}
                          {transaction.type === 'transfer' && transaction.fromAccountId?.userId?.firstName && transaction.fromAccountId?.userId?.lastName && (
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <TrendingUp sx={{ fontSize: 16 }} />
                              From: {transaction.fromAccountId.userId.firstName} {transaction.fromAccountId.userId.lastName} (••••{transaction.fromAccountId.accountNumber?.slice(-4)})
                            </Typography>
                          )}
                        </Stack>
                      </Grid>
                      
                      <Grid item>
                        <Stack alignItems="flex-end" spacing={2}>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography 
                              variant="h5" 
                              fontWeight={800}
                              sx={{
                                color: transaction.type === 'deposit' ? '#2985D6' :
                                       transaction.type === 'withdrawal' ? '#0E7BB8' :
                                       '#006CAE',
                                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                              }}
                            >
                              {transaction.type === 'withdrawal' ? '-' : '+'}
                              {formatCurrency(transaction.amount)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {transaction.type?.toUpperCase()}
                            </Typography>
                          </Box>
                          {getStatusChip(transaction.status)}
                        </Stack>
                      </Grid>
                      
                      <Grid item>
                        <IconButton 
                          onClick={(e) => {
                            e.stopPropagation();
                            openTransactionDetails(transaction);
                          }}
                          sx={{ 
                            bgcolor: alpha('#006CAE', 0.1),
                            color: '#006CAE',
                            '&:hover': {
                              bgcolor: alpha('#006CAE', 0.2),
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <Visibility />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </CardContent>
                </TransactionCard>
              </Grid>
            ))
          )}
        </Grid>

        {/* Transaction Action Dialog */}
        <Dialog 
          open={actionDialogOpen} 
          onClose={() => setActionDialogOpen(false)}
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
            <Typography variant="h5" fontWeight={600} sx={{ textTransform: 'capitalize' }}>
              {actionType} Money
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {actionType === 'deposit' ? 'Add money to your account' :
               actionType === 'withdraw' ? 'Withdraw money from your account' :
               'Transfer money to another account'}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Select Account</InputLabel>
                  <Select
                    value={transactionForm.accountId}
                    label="Select Account"
                    onChange={(e) => setTransactionForm({ ...transactionForm, accountId: e.target.value })}
                  >
                    {accounts.map((account) => (
                      <MenuItem key={account._id} value={account._id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <AccountBalance />
                          <Box>
                            <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                              {account.accountType} Account
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ••••{account.accountNumber?.slice(-4)} - {formatCurrency(account.balance)}
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={transactionForm.amount}
                  onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  required
                />
              </Grid>

              {actionType === 'transfer' && (
                <>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Quick Select Recipient</InputLabel>
                      <Select
                        value={transactionForm.selectedRecipient}
                        label="Quick Select Recipient"
                        onChange={(e) => {
                          const selectedAccount = allBankAccounts.find(acc => acc._id === e.target.value);
                          setTransactionForm({ 
                            ...transactionForm, 
                            selectedRecipient: e.target.value,
                            toAccountNumber: selectedAccount?.accountNumber || ''
                          });
                        }}
                      >
                        <MenuItem value="">Select from your accounts</MenuItem>
                        {allBankAccounts
                          .filter(account => account._id !== transactionForm.accountId) // Don't show selected source account
                          .map((account) => (
                          <MenuItem key={account._id} value={account._id}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ 
                                bgcolor: alpha('#006CAE', 0.1), 
                                width: 40, 
                                height: 40,
                                color: '#006CAE',
                                fontSize: '14px',
                                fontWeight: 600
                              }}>
                                {account.userId?.firstName ? 
                                  `${account.userId.firstName.charAt(0)}${account.userId.lastName?.charAt(0) || ''}` : 
                                  <AccountBalance />
                                }
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle1" sx={{ textTransform: 'capitalize', fontWeight: 600 }}>
                                  {account.userId?.firstName && account.userId?.lastName ? 
                                    `${account.userId.firstName} ${account.userId.lastName}` : 
                                    'Account Holder'
                                  }
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                  {account.accountType} Account
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Account: {account.accountNumber} • Balance: {formatCurrency(account.balance)}
                                </Typography>
                              </Box>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 1 }}>
                      <Divider sx={{ flex: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        OR
                      </Typography>
                      <Divider sx={{ flex: 1 }} />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Enter Account Number Manually"
                      value={transactionForm.toAccountNumber}
                      onChange={(e) => setTransactionForm({ 
                        ...transactionForm, 
                        toAccountNumber: e.target.value,
                        selectedRecipient: '' // Clear dropdown selection when manually entering
                      })}
                      placeholder="Enter the recipient's account number"
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountBalance sx={{ color: '#006CAE' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description (Optional)"
                  value={transactionForm.description}
                  onChange={(e) => setTransactionForm({ ...transactionForm, description: e.target.value })}
                  placeholder={`${actionType.charAt(0).toUpperCase() + actionType.slice(1)} description`}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Transaction Details:
              </Typography>
              <Typography variant="body2">
                {actionType === 'deposit' 
                  ? 'Money will be added to your selected account immediately after processing.'
                  : actionType === 'withdraw'
                  ? 'Money will be deducted from your selected account. Ensure sufficient balance.'
                  : 'Money will be transferred from your account to the specified recipient account.'
                }
              </Typography>
            </Alert>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => {
                setActionDialogOpen(false);
                setTransactionForm({ 
                  amount: '', 
                  description: '', 
                  toAccountNumber: '', 
                  selectedRecipient: '',
                  accountId: '' 
                });
              }} 
              size="large"
            >
              Cancel
            </Button>
            <ActionButton 
              variant={actionType}
              onClick={handleTransaction}
              disabled={!transactionForm.amount || !transactionForm.accountId || 
                       (actionType === 'transfer' && !transactionForm.toAccountNumber)}
              size="large"
            >
              {actionType.charAt(0).toUpperCase() + actionType.slice(1)} Money
            </ActionButton>
          </DialogActions>
        </Dialog>

        {/* Transaction Details Dialog */}
        <Dialog 
          open={detailsDialogOpen} 
          onClose={() => setDetailsDialogOpen(false)}
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
              Transaction Details
            </Typography>
          </DialogTitle>
          <DialogContent>
            {transactionDetails && (
              <Stack spacing={3} sx={{ mt: 1 }}>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Avatar sx={{ 
                    bgcolor: alpha('#006CAE', 0.1), 
                    mx: 'auto', 
                    mb: 2, 
                    width: 80, 
                    height: 80 
                  }}>
                    {getTransactionIcon(transactionDetails.type)}
                  </Avatar>
                  <Typography variant="h4" fontWeight={700} gutterBottom>
                    {formatCurrency(transactionDetails.amount)}
                  </Typography>
                  {getStatusChip(transactionDetails.status)}
                </Box>
                
                <Divider />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Transaction ID
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {transactionDetails._id?.slice(-8) || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Type
                    </Typography>
                    <Typography variant="body1" fontWeight={600} sx={{ textTransform: 'capitalize' }}>
                      {transactionDetails.type}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Date & Time
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {new Date(transactionDetails.createdAt).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <Typography variant="body1" fontWeight={600} sx={{ textTransform: 'capitalize' }}>
                      {transactionDetails.status}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Description
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {transactionDetails.description || 'No description provided'}
                    </Typography>
                  </Grid>
                  
                  {/* Show recipient info for transfers */}
                  {transactionDetails.type === 'transfer' && transactionDetails.toAccountId?.userId && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Recipient
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                        <Avatar sx={{ 
                          bgcolor: alpha('#006CAE', 0.1), 
                          width: 32, 
                          height: 32,
                          color: '#006CAE',
                          fontSize: '12px',
                          fontWeight: 600
                        }}>
                          {transactionDetails.toAccountId.userId.firstName?.charAt(0)}{transactionDetails.toAccountId.userId.lastName?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight={600}>
                            {transactionDetails.toAccountId.userId.firstName} {transactionDetails.toAccountId.userId.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Account: ••••{transactionDetails.toAccountNumber?.slice(-4)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                  
                  {/* Show sender info for incoming transfers */}
                  {transactionDetails.type === 'transfer' && transactionDetails.fromAccountId?.userId && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Sender
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                        <Avatar sx={{ 
                          bgcolor: alpha('#006CAE', 0.1), 
                          width: 32, 
                          height: 32,
                          color: '#006CAE',
                          fontSize: '12px',
                          fontWeight: 600
                        }}>
                          {transactionDetails.fromAccountId.userId.firstName?.charAt(0)}{transactionDetails.fromAccountId.userId.lastName?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight={600}>
                            {transactionDetails.fromAccountId.userId.firstName} {transactionDetails.fromAccountId.userId.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Account: ••••{transactionDetails.fromAccountId.accountNumber?.slice(-4)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Stack>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setDetailsDialogOpen(false)} size="large">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Filter Dialog */}
        <Dialog 
          open={filterDialogOpen} 
          onClose={() => setFilterDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              backdropFilter: 'blur(20px)',
              background: alpha('#fff', 0.9),
            }
          }}
        >
          <DialogTitle sx={{ pb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <FilterList />
              <Typography variant="h6" fontWeight={600}>
                Filter Transactions
              </Typography>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Transaction Type</InputLabel>
                  <Select
                    value={filters.type}
                    label="Transaction Type"
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="deposit">Deposit</MenuItem>
                    <MenuItem value="withdrawal">Withdrawal</MenuItem>
                    <MenuItem value="transfer">Transfer</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    label="Status"
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="failed">Failed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="From Date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="To Date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Minimum Amount"
                  value={filters.minAmount}
                  onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Maximum Amount"
                  value={filters.maxAmount}
                  onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={clearFilters}
              variant="outlined"
              size="large"
            >
              Clear Filters
            </Button>
            <Button 
              onClick={applyFilters}
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #006CAE 0%, #005A8A 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #005A8A 0%, #004A7D 100%)',
                }
              }}
            >
              Apply Filters
            </Button>
          </DialogActions>
        </Dialog>

        {/* Floating Action Button */}
        <StyledFab
          onClick={() => openActionDialog('transfer')}
          aria-label="Quick Transfer"
        >
          <Send />
        </StyledFab>
      </Container>
    </TransactionsContainer>
  );
};

export default Transactions;
