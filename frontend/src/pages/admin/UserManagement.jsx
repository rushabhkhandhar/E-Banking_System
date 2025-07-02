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
  Snackbar
} from '@mui/material';
import {
  Group,
  Visibility,
  Block,
  CheckCircle,
  Delete,
  Edit,
  Person,
  Email,
  Phone,
  CalendarToday,
  Refresh
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/adminAPI';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ open: false, action: null, userId: null });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers();
      setUsers(response.data.data.users);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const getUserDetails = async (userId) => {
    try {
      setLoading(true);
      const response = await adminAPI.getUserDetails(userId);
      setSelectedUser(response.data.data);
      setOpenUserDialog(true);
    } catch (err) {
      setError('Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      setLoading(true);
      const reason = prompt(
        `Please provide a reason for ${currentStatus ? 'deactivating' : 'activating'} this user:`
      );
      if (reason !== null) {
        await adminAPI.toggleUserStatus(userId, !currentStatus, reason);
        setSuccess('User status updated successfully');
        await fetchUsers();
      }
    } catch (err) {
      setError('Failed to update user status');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      setLoading(true);
      const reason = prompt('Please provide a reason for deleting this user:');
      if (reason !== null) {
        await adminAPI.deleteUser(userId, reason);
        setSuccess('User deleted successfully');
        await fetchUsers();
      }
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAction = () => {
    const { action, userId } = confirmAction;
    if (action === 'delete') {
      deleteUser(userId);
    } else if (action === 'toggle') {
      const user = users.find(u => u._id === userId);
      toggleUserStatus(userId, user.isActive);
    }
    setConfirmAction({ open: false, action: null, userId: null });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            User Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage user accounts, permissions, and access controls
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchUsers}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button variant="contained" onClick={() => navigate('/admin')}>
            Back to Dashboard
          </Button>
        </Stack>
      </Box>

      {/* Users Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            All Users ({users.length})
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
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Verified</TableCell>
                    <TableCell>Joined</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {user.firstName?.[0] || 'U'}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {user.firstName} {user.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {user._id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.isActive ? 'Active' : 'Inactive'}
                          color={user.isActive ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.isEmailVerified ? 'Verified' : 'Unverified'}
                          color={user.isEmailVerified ? 'success' : 'warning'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
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
                          <Tooltip title={user.isActive ? 'Deactivate' : 'Activate'}>
                            <IconButton
                              size="small"
                              onClick={() => setConfirmAction({
                                open: true,
                                action: 'toggle',
                                userId: user._id
                              })}
                              color={user.isActive ? 'error' : 'success'}
                            >
                              {user.isActive ? <Block /> : <CheckCircle />}
                            </IconButton>
                          </Tooltip>
                          {user.role !== 'admin' && (
                            <Tooltip title="Delete User">
                              <IconButton
                                size="small"
                                onClick={() => setConfirmAction({
                                  open: true,
                                  action: 'delete',
                                  userId: user._id
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

      {/* User Details Dialog */}
      <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {selectedUser?.user?.firstName?.[0] || 'U'}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {selectedUser?.user?.firstName} {selectedUser?.user?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedUser?.user?.email}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Personal Information
                    </Typography>
                    <Stack spacing={2}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Person fontSize="small" />
                        <Typography variant="body2">
                          {selectedUser.user.firstName} {selectedUser.user.lastName}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Email fontSize="small" />
                        <Typography variant="body2">{selectedUser.user.email}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Phone fontSize="small" />
                        <Typography variant="body2">{selectedUser.user.phone || 'N/A'}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <CalendarToday fontSize="small" />
                        <Typography variant="body2">
                          Joined: {new Date(selectedUser.user.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Account Statistics
                    </Typography>
                    <Stack spacing={2}>
                      <Typography variant="body2">
                        Total Accounts: {selectedUser.accounts?.length || 0}
                      </Typography>
                      <Typography variant="body2">
                        Total Transactions: {selectedUser.stats?.totalTransactions || 0}
                      </Typography>
                      <Typography variant="body2">
                        Transaction Volume: ${selectedUser.stats?.totalVolume?.toFixed(2) || '0.00'}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUserDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmAction.open} onClose={() => setConfirmAction({ open: false, action: null, userId: null })}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {confirmAction.action === 'delete' ? 'delete' : 'toggle status of'} this user? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmAction({ open: false, action: null, userId: null })}>
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

export default UserManagement;
