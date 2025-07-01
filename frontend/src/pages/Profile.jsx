import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Divider,
  Stack,
  Paper
} from '@mui/material';
import {
  Edit,
  Email,
  Security,
  Save,
  Cancel,
  Verified
} from '@mui/icons-material';
import { userAPI, authAPI, handleAPIError } from '../services/api';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [changingPassword, setChangingPassword] = useState(false);

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProfile();
      setProfileData(response.data);
      setEditFormData({
        firstName: response.data.user.firstName || '',
        lastName: response.data.user.lastName || '',
        phone: response.data.user.phone || '',
        address: {
          street: response.data.user.address?.street || '',
          city: response.data.user.address?.city || '',
          state: response.data.user.address?.state || '',
          zipCode: response.data.user.address?.zipCode || '',
          country: response.data.user.address?.country || 'United States'
        }
      });
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Reset form data if canceling
      setEditFormData({
        firstName: profileData.user.firstName || '',
        lastName: profileData.user.lastName || '',
        phone: profileData.user.phone || '',
        address: {
          street: profileData.user.address?.street || '',
          city: profileData.user.address?.city || '',
          state: profileData.user.address?.state || '',
          zipCode: profileData.user.address?.zipCode || '',
          country: profileData.user.address?.country || 'United States'
        }
      });
    }
    setEditMode(!editMode);
  };

  const handleInputChange = (field, value) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setEditFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setEditFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await userAPI.updateProfile(editFormData);
      await fetchProfileData(); // Refresh data
      setEditMode(false);
      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getTotalBalance = () => {
    if (!profileData?.accounts) return 0;
    return profileData.accounts.reduce((total, account) => total + account.balance, 0);
  };

  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters long';
    }
    
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  const handlePasswordChange = async () => {
    const errors = validatePasswordForm();
    setPasswordErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setChangingPassword(true);
      await authAPI.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
        passwordForm.confirmPassword
      );
      
      // Reset form and close dialog
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordErrors({});
      setPasswordDialogOpen(false);
      setSuccessMessage('Password changed successfully!');
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setChangingPassword(false);
    }
  };

  const handlePasswordFormChange = (field, value) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePasswordDialogClose = () => {
    setPasswordDialogOpen(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordErrors({});
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchProfileData}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
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
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  fontSize: '2.5rem',
                  fontWeight: 600,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  border: '3px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                {getInitials(profileData?.user?.firstName, profileData?.user?.lastName)}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" fontWeight={600} gutterBottom>
                {`${profileData?.user?.firstName || ''} ${profileData?.user?.lastName || ''}`}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Email sx={{ fontSize: 18 }} />
                <Typography variant="body1">{profileData?.user?.email}</Typography>
                {profileData?.user?.isEmailVerified && (
                  <Chip
                    icon={<Verified />}
                    label="Verified"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(34, 197, 94, 0.2)',
                      color: '#10b981',
                      border: '1px solid rgba(34, 197, 94, 0.3)'
                    }}
                  />
                )}
              </Stack>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Customer since {formatDate(profileData?.user?.createdAt)}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={handleEditToggle}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                {editMode ? 'Cancel' : 'Edit Profile'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Grid container spacing={4}>
        {/* Personal Information Card */}
        <Grid item xs={12} md={8}>
          <Card
            elevation={0}
            sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 3
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Typography variant="h5" fontWeight={600} color="primary">
                  Personal Information
                </Typography>
                {editMode && (
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <Save />}
                      onClick={handleSaveProfile}
                      disabled={saving}
                      sx={{
                        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)'
                        }
                      }}
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleEditToggle}
                    >
                      Cancel
                    </Button>
                  </Stack>
                )}
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    First Name
                  </Typography>
                  {editMode ? (
                    <TextField
                      fullWidth
                      value={editFormData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    <Typography variant="body1" fontWeight={500}>
                      {profileData?.user?.firstName || 'Not provided'}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Last Name
                  </Typography>
                  {editMode ? (
                    <TextField
                      fullWidth
                      value={editFormData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    <Typography variant="body1" fontWeight={500}>
                      {profileData?.user?.lastName || 'Not provided'}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Email Address
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {profileData?.user?.email}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Email cannot be changed
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Phone Number
                  </Typography>
                  {editMode ? (
                    <TextField
                      fullWidth
                      value={editFormData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      variant="outlined"
                      size="small"
                      placeholder="10-digit phone number"
                    />
                  ) : (
                    <Typography variant="body1" fontWeight={500}>
                      {profileData?.user?.phone || 'Not provided'}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Date of Birth
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {profileData?.user?.dateOfBirth ? formatDate(profileData.user.dateOfBirth) : 'Not provided'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Customer Role
                  </Typography>
                  <Chip
                    label={profileData?.user?.role?.toUpperCase() || 'USER'}
                    color={profileData?.user?.role === 'admin' ? 'warning' : 'primary'}
                    size="small"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Address Section */}
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Address Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Street Address
                  </Typography>
                  {editMode ? (
                    <TextField
                      fullWidth
                      value={editFormData.address.street}
                      onChange={(e) => handleInputChange('address.street', e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    <Typography variant="body1" fontWeight={500}>
                      {profileData?.user?.address?.street || 'Not provided'}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    City
                  </Typography>
                  {editMode ? (
                    <TextField
                      fullWidth
                      value={editFormData.address.city}
                      onChange={(e) => handleInputChange('address.city', e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    <Typography variant="body1" fontWeight={500}>
                      {profileData?.user?.address?.city || 'Not provided'}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    State
                  </Typography>
                  {editMode ? (
                    <TextField
                      fullWidth
                      value={editFormData.address.state}
                      onChange={(e) => handleInputChange('address.state', e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    <Typography variant="body1" fontWeight={500}>
                      {profileData?.user?.address?.state || 'Not provided'}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    ZIP Code
                  </Typography>
                  {editMode ? (
                    <TextField
                      fullWidth
                      value={editFormData.address.zipCode}
                      onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    <Typography variant="body1" fontWeight={500}>
                      {profileData?.user?.address?.zipCode || 'Not provided'}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Account Summary */}
          <Card
            elevation={0}
            sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 3,
              mb: 3
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} color="primary" gutterBottom>
                Account Summary
              </Typography>
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                  color: 'white',
                  p: 3,
                  borderRadius: 2,
                  mb: 2
                }}
              >
                <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                  Total Balance
                </Typography>
                <Typography variant="h4" fontWeight={600}>
                  ${getTotalBalance().toLocaleString()}
                </Typography>
              </Box>
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Active Accounts
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {profileData?.accounts?.length || 0}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Last Login
                  </Typography>
                  <Typography variant="body2">
                    {profileData?.user?.lastLogin ? formatDate(profileData.user.lastLogin) : 'Never'}
                  </Typography>
                </Box>
              </Stack>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" fontWeight={600} color="primary" gutterBottom>
                Security
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Security />}
                fullWidth
                onClick={() => setPasswordDialogOpen(true)}
                sx={{
                  borderColor: '#1e3a8a',
                  color: '#1e3a8a',
                  '&:hover': {
                    borderColor: '#1e40af',
                    bgcolor: 'rgba(30, 58, 138, 0.05)'
                  }
                }}
              >
                Change Password
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={handlePasswordDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Security color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Change Password
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            Please enter your current password and choose a new secure password.
          </Alert>
          
          <Stack spacing={3}>
            <TextField
              fullWidth
              type="password"
              label="Current Password"
              value={passwordForm.currentPassword}
              onChange={(e) => handlePasswordFormChange('currentPassword', e.target.value)}
              error={!!passwordErrors.currentPassword}
              helperText={passwordErrors.currentPassword}
              variant="outlined"
            />
            
            <TextField
              fullWidth
              type="password"
              label="New Password"
              value={passwordForm.newPassword}
              onChange={(e) => handlePasswordFormChange('newPassword', e.target.value)}
              error={!!passwordErrors.newPassword}
              helperText={passwordErrors.newPassword || 'Minimum 6 characters required'}
              variant="outlined"
            />
            
            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              value={passwordForm.confirmPassword}
              onChange={(e) => handlePasswordFormChange('confirmPassword', e.target.value)}
              error={!!passwordErrors.confirmPassword}
              helperText={passwordErrors.confirmPassword}
              variant="outlined"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handlePasswordDialogClose}
            variant="outlined"
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePasswordChange}
            variant="contained"
            disabled={changingPassword}
            startIcon={changingPassword ? <CircularProgress size={16} color="inherit" /> : <Save />}
            sx={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)'
              }
            }}
          >
            {changingPassword ? 'Changing...' : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSuccessMessage('')}
          severity="success"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setError('')}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
