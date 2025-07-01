import React from 'react';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AdminPanelSettings } from '@mui/icons-material';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center">
        <AdminPanelSettings sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" fontWeight={600} gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary" maxWidth="md" mx="auto" mb={4}>
          Manage users, accounts, and system settings. Coming soon!
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button variant="contained" onClick={() => navigate('/admin/users')}>
            Manage Users
          </Button>
          <Button variant="outlined" onClick={() => navigate('/admin/accounts')}>
            Manage Accounts
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
