import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  IconButton,
  Divider,
  Stack,
  Alert,
  Skeleton,
  useTheme,
  alpha,
  Tooltip,
  Paper,
  LinearProgress,
  Fab
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  AccountBalance,
  TrendingUp,
  TrendingDown,
  SwapHoriz,
  Visibility,
  VisibilityOff,
  Add,
  Send,
  Receipt,
  CreditCard,
  Savings,
  AttachMoney,
  AccountBalanceWallet,
  Timeline,
  PieChart,
  Refresh,
  ArrowForward,
  MoreVert,
  ShowChart,
  AccountCircle,
  BarChart,
  MonetizationOn,
  Wallet,
  TrendingFlat,
  Analytics,
  Star,
  Notifications,
  Settings
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { accountAPI, userAPI, transactionAPI } from '../services/api';

// Keyframes for animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Main Container with beautiful gradient background
const DashboardContainer = styled(Box)(({ theme }) => ({
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

// Welcome Header with beautiful gradient and floating animation
const WelcomeCard = styled(Card)(({ theme }) => ({
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
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-30%',
    left: '-10%',
    width: '200px',
    height: '200px',
    background: `radial-gradient(circle, ${alpha('#f093fb', 0.2)} 0%, transparent 60%)`,
    borderRadius: '50%',
    animation: `${float} 4s ease-in-out infinite reverse`,
  },
}));

// Modern Metric Cards with glassmorphism
const MetricCard = styled(Card)(({ theme, variant = 'default' }) => {
  const getGradient = () => {
    switch (variant) {
      case 'primary':
        return 'linear-gradient(135deg, #006CAE 0%, #005A8A 100%)';
      case 'success':
        return 'linear-gradient(135deg, #2985D6 0%, #0E7BB8 100%)';
      case 'warning':
        return 'linear-gradient(135deg, #004A7D 0%, #003A5D 100%)';
      case 'info':
        return 'linear-gradient(135deg, #338FFF 0%, #66ABFF 100%)';
      case 'purple':
        return 'linear-gradient(135deg, #005A8A 0%, #004866 100%)';
      case 'orange':
        return 'linear-gradient(135deg, #0E7BB8 0%, #2985D6 100%)';
      default:
        return `
          rgba(255, 255, 255, 0.25)
        `;
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

// Action Cards with hover effects
const ActionCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2.5),
  border: 'none',
  background: `rgba(255, 255, 255, 0.15)`,
  backdropFilter: 'blur(20px)',
  boxShadow: `0 8px 32px ${alpha('#000', 0.1)}, 0 0 0 1px ${alpha('#fff', 0.2)} inset`,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px) scale(1.05)',
    background: `rgba(255, 255, 255, 0.25)`,
    boxShadow: `0 20px 60px ${alpha('#006CAE', 0.2)}, 0 0 0 1px ${alpha('#fff', 0.3)} inset`,
    '& .action-icon': {
      transform: 'scale(1.2) rotate(5deg)',
      color: '#006CAE',
    },
    '& .action-text': {
      color: '#006CAE',
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    right: '-50%',
    width: '100px',
    height: '100px',
    background: `radial-gradient(circle, ${alpha('#006CAE', 0.1)} 0%, transparent 70%)`,
    borderRadius: '50%',
    transition: 'all 0.4s ease',
  },
}));

// Account Balance Cards with beautiful gradients
const BalanceCard = styled(Card)(({ theme, accountType }) => {
  const getGradient = () => {
    switch (accountType?.toLowerCase()) {
      case 'checking':
        return 'linear-gradient(135deg, #006CAE 0%, #005A8A 100%)';
      case 'savings':
        return 'linear-gradient(135deg, #2985D6 0%, #0E7BB8 100%)';
      case 'credit':
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
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '-20%',
      left: '-10%',
      width: '100px',
      height: '100px',
      background: `radial-gradient(circle, ${alpha('#fff', 0.05)} 0%, transparent 70%)`,
      borderRadius: '50%',
      animation: `${float} 4s ease-in-out infinite reverse`,
    },
  };
});

// Section Cards with glassmorphism
const SectionCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  border: 'none',
  background: `rgba(255, 255, 255, 0.15)`,
  backdropFilter: 'blur(20px)',
  boxShadow: `0 8px 32px ${alpha('#000', 0.1)}, 0 0 0 1px ${alpha('#fff', 0.2)} inset`,
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: `rgba(255, 255, 255, 0.2)`,
    boxShadow: `0 12px 40px ${alpha('#000', 0.15)}, 0 0 0 1px ${alpha('#fff', 0.3)} inset`,
  },
}));

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

const Dashboard = () => {
  const { user } = useAuth();
  const { showError, showSuccess } = useNotification();
  const navigate = useNavigate();
  const theme = useTheme();

  const [showBalance, setShowBalance] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load accounts
      const accountsResponse = await accountAPI.getAccounts();
      const userAccounts = accountsResponse.data?.accounts || accountsResponse.accounts || [];
      setAccounts(userAccounts);

      // Load dashboard stats
      try {
        const dashboardResponse = await userAPI.getDashboard();
        setDashboardStats(dashboardResponse.data || dashboardResponse);
      } catch (error) {
        const totalBalance = userAccounts.reduce((sum, account) => sum + (account.balance || 0), 0);
        setDashboardStats({
          totalBalance,
          totalAccounts: userAccounts.length,
          activeAccounts: userAccounts.filter(acc => acc.status === 'active').length,
          recentTransactions: 0,
          totalEarnings: totalBalance * 0.12,
          totalSpending: totalBalance * 0.08,
          savingsGoal: totalBalance * 1.5
        });
      }

      // Load recent transactions
      try {
        const transactionsResponse = await transactionAPI.getAllUserTransactions({ 
          page: 1, 
          limit: 5 
        });
        setTransactions(transactionsResponse.data?.transactions || transactionsResponse.transactions || []);
      } catch (error) {
        setTransactions([]);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      showError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
    showSuccess('Dashboard refreshed successfully');
  };

  useEffect(() => {
    loadDashboardData();
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
        return <Savings sx={{ fontSize: 28, color: 'inherit' }} />;
      case 'checking':
        return <AccountBalanceWallet sx={{ fontSize: 28, color: 'inherit' }} />;
      case 'credit':
        return <CreditCard sx={{ fontSize: 28, color: 'inherit' }} />;
      default:
        return <AccountBalance sx={{ fontSize: 28, color: 'inherit' }} />;
    }
  };

  if (loading) {
    return (
      <DashboardContainer>
        <Container maxWidth="xl">
          <Skeleton 
            variant="rounded" 
            width="100%" 
            height={220} 
            sx={{ mb: 5, borderRadius: 4, bgcolor: alpha('#fff', 0.1) }} 
          />
          <Grid container spacing={4} sx={{ mb: 5 }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid item xs={12} sm={6} md={4} lg={2} key={i}>
                <Skeleton 
                  variant="rounded" 
                  width="100%" 
                  height={180} 
                  sx={{ borderRadius: 3, bgcolor: alpha('#fff', 0.1) }} 
                />
              </Grid>
            ))}
          </Grid>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={8}>
              <Skeleton 
                variant="rounded" 
                width="100%" 
                height={500} 
                sx={{ borderRadius: 3, bgcolor: alpha('#fff', 0.1) }} 
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <Skeleton 
                variant="rounded" 
                width="100%" 
                height={500} 
                sx={{ borderRadius: 3, bgcolor: alpha('#fff', 0.1) }} 
              />
            </Grid>
          </Grid>
        </Container>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Container maxWidth="xl">
        {/* Welcome Header */}
        <WelcomeCard>
          <CardContent sx={{ p: 5 }}>
            <Grid container alignItems="center" spacing={4}>
              <Grid item>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: alpha('#fff', 0.2),
                    color: 'white',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    border: `3px solid ${alpha('#fff', 0.3)}`,
                    boxShadow: `0 8px 32px ${alpha('#000', 0.2)}`,
                  }}
                >
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography 
                  variant="h3" 
                  fontWeight={700} 
                  gutterBottom
                  sx={{ 
                    background: 'linear-gradient(45deg, #fff 30%, #f0f8ff 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Welcome back, {user?.firstName}!
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                  Your financial journey continues here
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Typography>
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={2}>
                  <Tooltip title="Notifications">
                    <IconButton
                      sx={{ 
                        bgcolor: alpha('#fff', 0.15), 
                        color: 'white',
                        '&:hover': { bgcolor: alpha('#fff', 0.25), transform: 'scale(1.1)' }
                      }}
                    >
                      <Notifications />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Refresh Dashboard">
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
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </WelcomeCard>

        {/* Financial Metrics Grid */}
        <Grid container spacing={4} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <MetricCard variant="primary">
              <CardContent sx={{ p: 3, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <MonetizationOn sx={{ fontSize: 50, mb: 2, opacity: 0.9 }} />
                <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 1 }}>
                  Total Balance
                </Typography>
                <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                  {showBalance ? formatCurrency(dashboardStats?.totalBalance) : '••••••'}
                </Typography>
                <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={2}>
                  <TrendingUp sx={{ fontSize: 16 }} />
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    +2.4%
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => setShowBalance(!showBalance)}
                  sx={{ color: 'white', bgcolor: alpha('#fff', 0.2) }}
                >
                  {showBalance ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </CardContent>
            </MetricCard>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <MetricCard variant="success">
              <CardContent sx={{ p: 3, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <TrendingUp sx={{ fontSize: 50, mb: 2, opacity: 0.9 }} />
                <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 1 }}>
                  Total Earnings
                </Typography>
                <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                  {formatCurrency(dashboardStats?.totalEarnings)}
                </Typography>
                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                  <TrendingUp sx={{ fontSize: 16 }} />
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    +5.2%
                  </Typography>
                </Box>
              </CardContent>
            </MetricCard>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <MetricCard variant="info">
              <CardContent sx={{ p: 3, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <ShowChart sx={{ fontSize: 50, mb: 2, opacity: 0.9 }} />
                <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 1 }}>
                  Total Spending
                </Typography>
                <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                  {formatCurrency(dashboardStats?.totalSpending)}
                </Typography>
                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                  <TrendingDown sx={{ fontSize: 16 }} />
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    -1.8%
                  </Typography>
                </Box>
              </CardContent>
            </MetricCard>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <MetricCard variant="warning">
              <CardContent sx={{ p: 3, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <Star sx={{ fontSize: 50, mb: 2, opacity: 0.9 }} />
                <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 1 }}>
                  Savings Goal
                </Typography>
                <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                  {formatCurrency(dashboardStats?.savingsGoal)}
                </Typography>
                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                  <TrendingUp sx={{ fontSize: 16 }} />
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    On track
                  </Typography>
                </Box>
              </CardContent>
            </MetricCard>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <MetricCard>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <AccountBalance sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Active Accounts
                </Typography>
                <Typography variant="h4" fontWeight={700} color="primary.main" sx={{ mb: 1 }}>
                  {accounts.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All Active
                </Typography>
              </CardContent>
            </MetricCard>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <MetricCard>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Timeline sx={{ fontSize: 50, color: 'success.main', mb: 2 }} />
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  This Month
                </Typography>
                <Typography variant="h4" fontWeight={700} color="success.main" sx={{ mb: 1 }}>
                  {transactions.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Transactions
                </Typography>
              </CardContent>
            </MetricCard>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Typography variant="h4" fontWeight={700} sx={{ mb: 4, textAlign: 'center' }}>
          Quick Actions
        </Typography>
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={6} md={3}>
            <ActionCard onClick={() => navigate('/transfer')}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Send 
                  className="action-icon" 
                  sx={{ 
                    fontSize: 50, 
                    color: 'text.primary', 
                    mb: 2, 
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' 
                  }} 
                />
                <Typography 
                  variant="h6" 
                  fontWeight={600} 
                  className="action-text"
                  sx={{ transition: 'all 0.4s ease' }}
                  gutterBottom
                >
                  Transfer
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Send money instantly
                </Typography>
              </CardContent>
            </ActionCard>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <ActionCard onClick={() => navigate('/accounts')}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Add 
                  className="action-icon" 
                  sx={{ 
                    fontSize: 50, 
                    color: 'text.primary', 
                    mb: 2, 
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' 
                  }} 
                />
                <Typography 
                  variant="h6" 
                  fontWeight={600} 
                  className="action-text"
                  sx={{ transition: 'all 0.4s ease' }}
                  gutterBottom
                >
                  New Account
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Open a new account
                </Typography>
              </CardContent>
            </ActionCard>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <ActionCard onClick={() => navigate('/transactions')}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Receipt 
                  className="action-icon" 
                  sx={{ 
                    fontSize: 50, 
                    color: 'text.primary', 
                    mb: 2, 
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' 
                  }} 
                />
                <Typography 
                  variant="h6" 
                  fontWeight={600} 
                  className="action-text"
                  sx={{ transition: 'all 0.4s ease' }}
                  gutterBottom
                >
                  History
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View all transactions
                </Typography>
              </CardContent>
            </ActionCard>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <ActionCard onClick={() => navigate('/profile')}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <AccountCircle 
                  className="action-icon" 
                  sx={{ 
                    fontSize: 50, 
                    color: 'text.primary', 
                    mb: 2, 
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' 
                  }} 
                />
                <Typography 
                  variant="h6" 
                  fontWeight={600} 
                  className="action-text"
                  sx={{ transition: 'all 0.4s ease' }}
                  gutterBottom
                >
                  Profile
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your profile
                </Typography>
              </CardContent>
            </ActionCard>
          </Grid>
        </Grid>

        {/* Main Content Grid */}
        <Grid container spacing={4}>
          {/* Account Balances Section */}
          <Grid item xs={12} lg={8}>
            <SectionCard>
              <CardContent sx={{ p: 5 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                  <Typography variant="h4" fontWeight={700}>
                    My Balance
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Add />}
                    onClick={() => navigate('/accounts')}
                    sx={{ 
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #006CAE 0%, #005A8A 100%)',
                      boxShadow: `0 8px 32px ${alpha('#006CAE', 0.4)}`,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #005A8A 0%, #006CAE 100%)',
                        transform: 'scale(1.05)',
                      }
                    }}
                  >
                    Add Account
                  </Button>
                </Box>

                {accounts.length === 0 ? (
                  <Box textAlign="center" py={8}>
                    <Wallet sx={{ fontSize: 120, color: 'text.secondary', mb: 3, opacity: 0.3 }} />
                    <Typography variant="h4" color="text.secondary" gutterBottom>
                      No accounts found
                    </Typography>
                    <Typography variant="h6" color="text.secondary" mb={4}>
                      Get started by creating your first bank account
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<Add />}
                      onClick={() => navigate('/accounts')}
                      sx={{
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #006CAE 0%, #005A8A 100%)',
                        px: 4, py: 2, fontSize: '1.1rem'
                      }}
                    >
                      Create Your First Account
                    </Button>
                  </Box>
                ) : (
                  <Grid container spacing={4}>
                    {accounts.map((account) => (
                      <Grid item xs={12} sm={6} key={account._id || account.id}>
                        <BalanceCard accountType={account.accountType}>
                          <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                              <Box display="flex" alignItems="center" gap={2}>
                                {getAccountIcon(account.accountType)}
                                <Box>
                                  <Typography variant="h5" fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                                    {account.accountType || 'Account'}
                                  </Typography>
                                  <Typography variant="body1" sx={{ opacity: 0.8 }}>
                                    ••••{formatAccountNumber(account.accountNumber).slice(-4)}
                                  </Typography>
                                </Box>
                              </Box>
                              <Chip
                                label={`${account.status || 'Active'}`}
                                size="medium"
                                sx={{ 
                                  bgcolor: alpha('#fff', 0.2), 
                                  color: 'white',
                                  fontWeight: 600
                                }}
                              />
                            </Box>
                            <Divider sx={{ my: 3, bgcolor: alpha('#fff', 0.2) }} />
                            <Box>
                              <Typography variant="body1" sx={{ opacity: 0.8 }} gutterBottom>
                                Available Balance
                              </Typography>
                              <Typography variant="h3" fontWeight={700} sx={{ mb: 3 }}>
                                {showBalance ? formatCurrency(account.balance) : '••••••'}
                              </Typography>
                              <Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    Spending Limit
                                  </Typography>
                                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    75%
                                  </Typography>
                                </Box>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={75} 
                                  sx={{ 
                                    height: 8, 
                                    borderRadius: 4, 
                                    bgcolor: alpha('#fff', 0.2),
                                    '& .MuiLinearProgress-bar': {
                                      bgcolor: alpha('#fff', 0.8),
                                      borderRadius: 4
                                    }
                                  }} 
                                />
                              </Box>
                            </Box>
                          </CardContent>
                        </BalanceCard>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </SectionCard>
          </Grid>

          {/* Recent Activity & Stats */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={4} sx={{ height: '100%' }}>
              {/* Recent Activity */}
              <SectionCard>
                <CardContent sx={{ p: 4 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h5" fontWeight={700}>
                      Recent Activity
                    </Typography>
                    <Button
                      size="small"
                      endIcon={<ArrowForward />}
                      onClick={() => navigate('/transactions')}
                      sx={{ borderRadius: 2 }}
                    >
                      View All
                    </Button>
                  </Box>

                  {transactions.length === 0 ? (
                    <Box textAlign="center" py={6}>
                      <Analytics sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.3 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No recent transactions
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Your activity will appear here
                      </Typography>
                    </Box>
                  ) : (
                    <Stack spacing={3}>
                      {transactions.slice(0, 5).map((transaction, index) => (
                        <Box key={transaction._id || index}>
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box display="flex" alignItems="center" gap={3}>
                              <Avatar 
                                sx={{ 
                                  bgcolor: 'linear-gradient(135deg, #006CAE 0%, #005A8A 100%)', 
                                  width: 50, 
                                  height: 50,
                                  boxShadow: `0 4px 16px ${alpha('#006CAE', 0.3)}`
                                }}
                              >
                                <TrendingUp sx={{ fontSize: 24 }} />
                              </Avatar>
                              <Box>
                                <Typography variant="body1" fontWeight={600}>
                                  {transaction.description || 'Initial deposit - Account opening'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {new Date(transaction.createdAt || Date.now()).toLocaleDateString()}
                                </Typography>
                              </Box>
                            </Box>
                            <Typography variant="h6" fontWeight={700} color="success.main">
                              +{formatCurrency(transaction.amount || 1000)}
                            </Typography>
                          </Box>
                          {index < transactions.length - 1 && <Divider sx={{ mt: 3 }} />}
                        </Box>
                      ))}
                    </Stack>
                  )}
                </CardContent>
              </SectionCard>

              {/* Quick Stats */}
              <Box display="flex" justifyContent="center" width="100%">
                <Box display="flex" gap={3} justifyContent="center" alignItems="center">
                  <Box sx={{ width: 180 }}>
                    <MetricCard variant="purple">
                      <CardContent sx={{ p: 3, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                        <Timeline sx={{ fontSize: 40, mb: 2, opacity: 0.9 }} />
                        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                          {transactions.length}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          This Month
                        </Typography>
                      </CardContent>
                    </MetricCard>
                  </Box>
                  <Box sx={{ width: 180 }}>
                    <MetricCard variant="orange">
                      <CardContent sx={{ p: 3, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                        <AccountBalance sx={{ fontSize: 40, mb: 2, opacity: 0.9 }} />
                        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                          {accounts.length}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          Active Accounts
                        </Typography>
                      </CardContent>
                    </MetricCard>
                  </Box>
                </Box>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        {/* Floating Action Button */}
        <StyledFab
          color="primary"
          onClick={() => navigate('/transfer')}
          aria-label="Quick Transfer"
        >
          <Send />
        </StyledFab>
      </Container>
    </DashboardContainer>
  );
};

export default Dashboard;
