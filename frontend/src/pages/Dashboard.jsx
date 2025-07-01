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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Divider,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
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
  AttachMoney
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const StatsCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[8],
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  textTransform: 'none',
  fontWeight: 600,
  minHeight: 80,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAccounts([
        {
          id: 1,
          type: 'Checking',
          name: 'Primary Checking',
          balance: 15240.50,
          accountNumber: '****4567',
          status: 'Active'
        },
        {
          id: 2,
          type: 'Savings',
          name: 'High Yield Savings',
          balance: 45890.25,
          accountNumber: '****8901',
          status: 'Active'
        },
        {
          id: 3,
          type: 'Credit',
          name: 'Rewards Credit Card',
          balance: -2450.75,
          accountNumber: '****2345',
          status: 'Active'
        }
      ]);

      setTransactions([
        {
          id: 1,
          description: 'Direct Deposit - Salary',
          amount: 5200.00,
          type: 'Credit',
          date: '2025-01-01',
          category: 'Income'
        },
        {
          id: 2,
          description: 'Grocery Store Purchase',
          amount: -156.78,
          type: 'Debit',
          date: '2024-12-30',
          category: 'Food & Dining'
        },
        {
          id: 3,
          description: 'Electric Bill Payment',
          amount: -89.45,
          type: 'Debit',
          date: '2024-12-29',
          category: 'Utilities'
        },
        {
          id: 4,
          description: 'Transfer to Savings',
          amount: -1000.00,
          type: 'Transfer',
          date: '2024-12-28',
          category: 'Transfer'
        },
        {
          id: 5,
          description: 'Online Shopping',
          amount: -234.56,
          type: 'Debit',
          date: '2024-12-27',
          category: 'Shopping'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const totalBalance = accounts.reduce((sum, account) => {
    return account.type === 'Credit' ? sum : sum + account.balance;
  }, 0);

  const monthlyIncome = transactions
    .filter(t => t.type === 'Credit' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = transactions
    .filter(t => t.type === 'Debit' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const quickActions = [
    {
      label: 'Transfer Money',
      icon: <SwapHoriz fontSize="large" />,
      action: () => navigate('/transfer'),
      color: 'primary'
    },
    {
      label: 'Pay Bills',
      icon: <Receipt fontSize="large" />,
      action: () => navigate('/payments'),
      color: 'secondary'
    },
    {
      label: 'Open Account',
      icon: <Add fontSize="large" />,
      action: () => navigate('/accounts/new'),
      color: 'success'
    },
    {
      label: 'Get Card',
      icon: <CreditCard fontSize="large" />,
      action: () => navigate('/cards'),
      color: 'warning'
    }
  ];

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <LinearProgress />
        <Typography variant="h6" textAlign="center" mt={2}>
          Loading your dashboard...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Welcome Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Welcome back, {user?.firstName}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Here's an overview of your financial activity
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Account Overview Cards */}
        <Grid item xs={12} md={4}>
          <StatsCard>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Total Balance
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h4" fontWeight={700}>
                      {showBalance ? `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••'}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => setShowBalance(!showBalance)}
                      sx={{ color: 'white' }}
                    >
                      {showBalance ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Across {accounts.filter(a => a.type !== 'Credit').length} accounts
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <AccountBalance />
                </Avatar>
              </Box>
            </CardContent>
          </StatsCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <DashboardCard>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Monthly Income
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="success.main">
                    ${monthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    +12% from last month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light' }}>
                  <TrendingUp />
                </Avatar>
              </Box>
            </CardContent>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <DashboardCard>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Monthly Expenses
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="error.main">
                    ${monthlyExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    -5% from last month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.light' }}>
                  <TrendingDown />
                </Avatar>
              </Box>
            </CardContent>
          </DashboardCard>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <DashboardCard>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                {quickActions.map((action, index) => (
                  <Grid item xs={6} sm={3} key={index}>
                    <ActionButton
                      fullWidth
                      variant="outlined"
                      color={action.color}
                      onClick={action.action}
                    >
                      {action.icon}
                      <Typography variant="body2" fontWeight={600}>
                        {action.label}
                      </Typography>
                    </ActionButton>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </DashboardCard>
        </Grid>

        {/* Accounts Overview */}
        <Grid item xs={12} md={8}>
          <DashboardCard>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight={600}>
                  Your Accounts
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/accounts')}
                >
                  View All
                </Button>
              </Box>
              <Stack spacing={2}>
                {accounts.map((account) => (
                  <Paper key={account.id} variant="outlined" sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          {account.type === 'Checking' && <AccountBalance />}
                          {account.type === 'Savings' && <Savings />}
                          {account.type === 'Credit' && <CreditCard />}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {account.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {account.accountNumber}
                          </Typography>
                        </Box>
                      </Box>
                      <Box textAlign="right">
                        <Typography 
                          variant="h6" 
                          fontWeight={600}
                          color={account.type === 'Credit' ? 'error.main' : 'text.primary'}
                        >
                          ${Math.abs(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </Typography>
                        <Chip
                          label={account.status}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </DashboardCard>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12} md={4}>
          <DashboardCard>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight={600}>
                  Recent Transactions
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/transactions')}
                >
                  View All
                </Button>
              </Box>
              <Stack spacing={1}>
                {transactions.slice(0, 5).map((transaction) => (
                  <Box key={transaction.id} display="flex" justifyContent="space-between" alignItems="center" py={1}>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {transaction.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(transaction.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      fontWeight={600}
                      color={transaction.amount > 0 ? 'success.main' : 'error.main'}
                    >
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </DashboardCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
