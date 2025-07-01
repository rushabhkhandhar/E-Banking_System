import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  AdminPanelSettings,
  Visibility,
  VisibilityOff,
  Security
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting admin login...', { email: formData.email });
      const response = await login(formData.email, formData.password);
      console.log('Login response:', response);
      
      // Check if user is admin
      if (response.user && response.user.role === 'admin') {
        console.log('Admin login successful, redirecting to dashboard...');
        navigate('/admin/dashboard');
      } else {
        console.log('User role:', response.user?.role);
        setError('Access denied. Admin privileges required.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError(err.response?.data?.message || err.message || 'Invalid admin credentials');
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 6,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <Box textAlign="center" mb={4}>
            <AdminPanelSettings
              sx={{
                fontSize: 64,
                color: '#1e3a8a',
                mb: 2
              }}
            />
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Admin Portal
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Secure access for system administrators
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Admin Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Security color="action" />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              label="Admin Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              sx={{ mb: 4 }}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 8px 32px rgba(30, 58, 138, 0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Access Admin Panel'
              )}
            </Button>

            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/')}
              sx={{ mt: 2, color: 'text.secondary' }}
            >
              ← Back to Main Site
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminLogin;
