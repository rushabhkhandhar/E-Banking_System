import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
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
  Grid,
  Card,
  CardContent,
  Divider,
  Avatar,
  Tooltip,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import {
  AccountTree,
  Visibility,
  Block,
  CheckCircle,
  Delete,
  Edit,
  Person,
  AccountBalance,
  AttachMoney,
  Security,
  CalendarToday,
  Refresh,
  Add,
  Remove
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/adminAPI';

const AccountManagement = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openAccountDialog, setOpenAccountDialog] = useState(false);
  const [openTransactionDialog, setOpenTransactionDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ open: false, action: null, accountId: null });
  const [transactionData, setTransactionData] = useState({
    type: 'deposit',
    amount: '',
    description: '',
    reason: ''
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllAccounts();
      setAccounts(response.data.data.accounts);
    } catch (err) {
      setError('Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  const toggleAccountFreeze = async (accountId, currentStatus) => {
    try {
      setLoading(true);
      const reason = prompt(
        `Please provide a reason for ${currentStatus ? 'unfreezing' : 'freezing'} this account:`
      );
      if (reason !== null) {
        await adminAPI.toggleAccountFreeze(accountId, !currentStatus, reason);
        setSuccess('Account status updated successfully');
        await fetchAccounts();
      }
    } catch (err) {
      setError('Failed to update account status');
    } finally {
      setLoading(false);
    }
  };

  const forceCloseAccount = async (accountId) => {
    try {
      setLoading(true);
      const reason = prompt('Please provide a reason for closing this account:');
      if (reason !== null) {
        await adminAPI.forceCloseAccount(accountId, reason, false);
        setSuccess('Account closed successfully');
        await fetchAccounts();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to close account';
      
      // If account has positive balance, ask if admin wants to force close
      if (errorMessage.includes('positive balance')) {
        const forceClose = window.confirm(
          `${errorMessage}\n\nDo you want to force close this account anyway? The remaining balance will be noted in the closure.`
        );
        
        if (forceClose) {
          try {
            await adminAPI.forceCloseAccount(accountId, reason, true);
            setSuccess('Account force closed successfully');
            await fetchAccounts();
          } catch (forceErr) {
            setError('Failed to force close account');
          }
        }
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManualTransaction = async () => {
    try {
      setLoading(true);
      const { type, amount, description, reason } = transactionData;
      
      if (!amount || parseFloat(amount) <= 0) {
        setError('Please enter a valid amount');
        return;
      }

      if (type === 'deposit') {
        await adminAPI.manualDeposit(selectedAccount._id, parseFloat(amount), description, reason);
      } else {
        await adminAPI.manualWithdraw(selectedAccount._id, parseFloat(amount), description, reason);
      }

      setSuccess(`Manual ${type} completed successfully`);
      setOpenTransactionDialog(false);
      setTransactionData({ type: 'deposit', amount: '', description: '', reason: '' });
      await fetchAccounts();
    } catch (err) {
      setError(`Failed to process manual ${transactionData.type}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAction = () => {
    const { action, accountId } = confirmAction;
    if (action === 'close') {
      forceCloseAccount(accountId);
    } else if (action === 'freeze') {
      const account = accounts.find(a => a._id === accountId);
      toggleAccountFreeze(accountId, account.isFrozen);
    }
    setConfirmAction({ open: false, action: null, accountId: null });
  };

  const openTransactionModal = (account) => {
    setSelectedAccount(account);
    setOpenTransactionDialog(true);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Account Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all user accounts, transactions, and financial data
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchAccounts}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button variant="contained" onClick={() => navigate('/admin')}>
            Back to Dashboard
          </Button>
        </Stack>
      </Box>

      {/* Accounts Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            All Accounts ({accounts.length})
          </Typography>
          
          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Account</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Balance</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account._id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <AccountBalance />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {account.accountNumber}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {account._id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={account.accountType}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color="primary">
                          ${account.balance.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Chip
                            label={!account.isActive ? 'Closed' : account.isFrozen ? 'Frozen' : 'Active'}
                            color={!account.isActive ? 'default' : account.isFrozen ? 'warning' : 'success'}
                            size="small"
                          />
                          {!account.isActive && account.closedAt && (
                            <Typography variant="caption" color="text.secondary">
                              Closed {new Date(account.closedAt).toLocaleDateString()}
                            </Typography>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {account.userId?.firstName} {account.userId?.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {account.userId?.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(account.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title={account.isFrozen ? 'Unfreeze Account' : 'Freeze Account'}>
                            <IconButton
                              size="small"
                              onClick={() => setConfirmAction({
                                open: true,
                                action: 'freeze',
                                accountId: account._id
                              })}
                              color={account.isFrozen ? 'success' : 'warning'}
                              disabled={!account.isActive}
                            >
                              {account.isFrozen ? <CheckCircle /> : <Block />}
                            </IconButton>
                          </Tooltip>
                          {account.isActive && !account.isFrozen && (
                            <Tooltip title="Manual Transaction">
                              <IconButton
                                size="small"
                                onClick={() => openTransactionModal(account)}
                                color="primary"
                              >
                                <AttachMoney />
                              </IconButton>
                            </Tooltip>
                          )}
                          {account.isActive && (
                            <Tooltip title="Force Close Account">
                              <IconButton
                                size="small"
                                onClick={() => setConfirmAction({
                                  open: true,
                                  action: 'close',
                                  accountId: account._id
                                })}
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
        </CardContent>
      </Card>

      {/* Manual Transaction Dialog */}
      <Dialog open={openTransactionDialog} onClose={() => setOpenTransactionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Manual Transaction - {selectedAccount?.accountNumber}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Transaction Type</InputLabel>
              <Select
                value={transactionData.type}
                label="Transaction Type"
                onChange={(e) => setTransactionData({ ...transactionData, type: e.target.value })}
              >
                <MenuItem value="deposit">Deposit</MenuItem>
                <MenuItem value="withdrawal">Withdrawal</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={transactionData.amount}
              onChange={(e) => setTransactionData({ ...transactionData, amount: e.target.value })}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              inputProps={{ min: 0, step: 0.01 }}
            />
            
            <TextField
              fullWidth
              label="Description"
              value={transactionData.description}
              onChange={(e) => setTransactionData({ ...transactionData, description: e.target.value })}
              placeholder="Optional description"
            />
            
            <TextField
              fullWidth
              label="Reason"
              value={transactionData.reason}
              onChange={(e) => setTransactionData({ ...transactionData, reason: e.target.value })}
              placeholder="Administrative reason for this transaction"
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTransactionDialog(false)}>Cancel</Button>
          <Button onClick={handleManualTransaction} variant="contained" disabled={!transactionData.amount || !transactionData.reason}>
            Process Transaction
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmAction.open} onClose={() => setConfirmAction({ open: false, action: null, accountId: null })}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {confirmAction.action === 'close' ? 'force close' : confirmAction.action} this account? 
            This action may not be reversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmAction({ open: false, action: null, accountId: null })}>
            Cancel
          </Button>
          <Button onClick={handleConfirmAction} color="error" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbars */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={4000} onClose={() => setSuccess('')}>
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AccountManagement;
