import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stack,
  Grid,
  Divider,
  Chip,
  Avatar,
  InputAdornment,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Collapse,
  alpha,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  SwapHoriz,
  ArrowBack,
  AccountBalance,
  Person,
  Send,
  ExpandMore,
  ExpandLess,
  CheckCircle,
  Info
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { accountAPI, transactionAPI } from '../services/api';

const StyledCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  borderRadius: theme.spacing(2),
  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
}));

const AccountSelectCard = styled(Card)(({ theme, selected }) => ({
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  border: selected 
    ? `2px solid ${theme.palette.primary.main}` 
    : `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  backgroundColor: selected 
    ? alpha(theme.palette.primary.main, 0.05) 
    : theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
  },
}));

const Transfer = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [userAccounts, setUserAccounts] = useState([]);
  const [transferableAccounts, setTransferableAccounts] = useState([]);
  const [selectedFromAccount, setSelectedFromAccount] = useState('');
  const [selectedToAccount, setSelectedToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingAccounts, setFetchingAccounts] = useState(true);
  const [showRecipients, setShowRecipients] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setFetchingAccounts(true);
      console.log('Fetching user accounts...');
      
      const [userAccountsResponse, transferableAccountsResponse] = await Promise.all([
        accountAPI.getAccounts(),
        accountAPI.getTransferableAccounts()
      ]);

      console.log('User accounts response:', userAccountsResponse);
      console.log('Transferable accounts response:', transferableAccountsResponse);

      setUserAccounts(userAccountsResponse.data.accounts);
      setTransferableAccounts(transferableAccountsResponse.data.accounts);
      
      console.log('User accounts set:', userAccountsResponse.data.accounts.length);
      console.log('Transferable accounts set:', transferableAccountsResponse.data.accounts.length);
      
    } catch (error) {
      console.error('Error fetching accounts:', error);
      showNotification('Failed to load accounts', 'error');
    } finally {
      setFetchingAccounts(false);
    }
  };

  const handleTransfer = async () => {
    if (!selectedFromAccount || !selectedToAccount || !amount) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    if (parseFloat(amount) <= 0) {
      showNotification('Amount must be greater than 0', 'error');
      return;
    }

    const fromAccount = userAccounts.find(acc => acc._id === selectedFromAccount);
    if (parseFloat(amount) > fromAccount.balance) {
      showNotification('Insufficient funds', 'error');
      return;
    }

    try {
      setLoading(true);
      const toAccount = transferableAccounts.find(acc => acc._id === selectedToAccount);
      
      await transactionAPI.transfer(
        selectedFromAccount,
        toAccount.accountNumber,
        parseFloat(amount),
        description || 'Money Transfer'
      );

      showNotification('Transfer completed successfully!', 'success');
      
      // Reset form
      setSelectedFromAccount('');
      setSelectedToAccount('');
      setAmount('');
      setDescription('');
      
      // Refresh accounts to update balances
      fetchAccounts();
      
    } catch (error) {
      console.error('Transfer error:', error);
      showNotification(
        error.response?.data?.message || 'Transfer failed. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getAccountTypeColor = (type) => {
    switch (type) {
      case 'checking': return 'primary';
      case 'savings': return 'success';
      case 'business': return 'warning';
      default: return 'default';
    }
  };

  if (fetchingAccounts) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h6" textAlign="center">
          Loading accounts...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <SwapHoriz sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight={600}>
            Transfer Money
          </Typography>
        </Box>
        
        <Typography variant="body1" color="text.secondary">
          Transfer funds securely between accounts
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Transfer Form */}
        <Grid item xs={12} md={8}>
          <StyledCard>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Transfer Details
              </Typography>
              
              <Stack spacing={3}>
                {/* From Account Selection */}
                <FormControl fullWidth>
                  <InputLabel>From Account</InputLabel>
                  <Select
                    value={selectedFromAccount}
                    onChange={(e) => setSelectedFromAccount(e.target.value)}
                    label="From Account"
                  >
                    {userAccounts.map((account) => (
                      <MenuItem key={account._id} value={account._id}>
                        <Box display="flex" alignItems="center" gap={2} width="100%">
                          <AccountBalance color="primary" />
                          <Box flex={1}>
                            <Typography variant="body2" fontWeight={500}>
                              {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} Account
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ••••{account.accountNumber.slice(-4)} • {formatCurrency(account.balance)}
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Amount */}
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  inputProps={{
                    min: 0,
                    step: 0.01,
                  }}
                />

                {/* To Account Selection */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Select Recipient
                  </Typography>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setShowRecipients(!showRecipients)}
                    endIcon={showRecipients ? <ExpandLess /> : <ExpandMore />}
                    sx={{ justifyContent: 'space-between', mb: 1 }}
                  >
                    {selectedToAccount 
                      ? `${transferableAccounts.find(acc => acc._id === selectedToAccount)?.userId?.firstName} ${transferableAccounts.find(acc => acc._id === selectedToAccount)?.userId?.lastName} (••••${transferableAccounts.find(acc => acc._id === selectedToAccount)?.accountNumber.slice(-4)})`
                      : 'Choose recipient account'
                    }
                  </Button>
                  
                  <Collapse in={showRecipients}>
                    <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto' }}>
                      <List dense>
                        {transferableAccounts.map((account) => (
                          <ListItem
                            key={account._id}
                            button
                            selected={selectedToAccount === account._id}
                            onClick={() => {
                              setSelectedToAccount(account._id);
                              setShowRecipients(false);
                            }}
                          >
                            <ListItemIcon>
                              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                {account.userId.firstName.charAt(0)}
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText
                              primary={`${account.userId.firstName} ${account.userId.lastName}`}
                              secondary={
                                <Box>
                                  <Typography variant="caption" display="block">
                                    Account: ••••{account.accountNumber.slice(-4)}
                                  </Typography>
                                  <Chip
                                    size="small"
                                    label={account.accountType}
                                    color={getAccountTypeColor(account.accountType)}
                                    variant="outlined"
                                  />
                                </Box>
                              }
                            />
                            {selectedToAccount === account._id && (
                              <CheckCircle color="primary" />
                            )}
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </Collapse>
                </Box>

                {/* Description */}
                <TextField
                  fullWidth
                  label="Description (Optional)"
                  multiline
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this transfer for?"
                />

                {/* Transfer Button */}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<Send />}
                  onClick={handleTransfer}
                  disabled={loading || !selectedFromAccount || !selectedToAccount || !amount}
                  sx={{ mt: 2, py: 1.5 }}
                >
                  {loading ? 'Processing...' : 'Transfer Money'}
                </Button>
              </Stack>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Transfer Summary */}
        <Grid item xs={12} md={4}>
          <StyledCard>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                <Info color="primary" />
                Transfer Summary
              </Typography>
              
              <Stack spacing={2}>
                {selectedFromAccount && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      From Account
                    </Typography>
                    <Typography variant="body2">
                      {userAccounts.find(acc => acc._id === selectedFromAccount)?.accountType} Account
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Available: {formatCurrency(userAccounts.find(acc => acc._id === selectedFromAccount)?.balance || 0)}
                    </Typography>
                  </Box>
                )}

                {selectedToAccount && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      To Account
                    </Typography>
                    <Typography variant="body2">
                      {transferableAccounts.find(acc => acc._id === selectedToAccount)?.userId?.firstName}{' '}
                      {transferableAccounts.find(acc => acc._id === selectedToAccount)?.userId?.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ••••{transferableAccounts.find(acc => acc._id === selectedToAccount)?.accountNumber.slice(-4)}
                    </Typography>
                  </Box>
                )}

                {amount && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Transfer Amount
                    </Typography>
                    <Typography variant="h6" color="primary.main">
                      {formatCurrency(parseFloat(amount) || 0)}
                    </Typography>
                  </Box>
                )}

                <Divider />
                
                <Alert severity="info" sx={{ fontSize: '0.75rem' }}>
                  Transfers are processed instantly and cannot be reversed. Please verify all details before confirming.
                </Alert>
              </Stack>
            </CardContent>
          </StyledCard>

          {/* Available Recipients Info */}
          <StyledCard sx={{ mt: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Available Recipients
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {transferableAccounts.length} accounts available for transfer
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                You can transfer money to any active account in the system.
              </Typography>
              
              {/* Debug Info - Remove this after testing */}
              <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Debug: {userAccounts.length} user accounts, {transferableAccounts.length} transferable accounts
                </Typography>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Transfer;
