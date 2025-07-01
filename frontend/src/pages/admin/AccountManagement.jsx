import React from 'react';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AccountTree } from '@mui/icons-material';

const AccountManagement = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center">
        <AccountTree sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" fontWeight={600} gutterBottom>
          Account Management
        </Typography>
        <Typography variant="h6" color="text.secondary" maxWidth="md" mx="auto" mb={4}>
          Manage all user accounts, transactions, and financial data. Coming soon!
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button variant="contained" onClick={() => navigate('/admin')}>
            Back to Admin Dashboard
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default AccountManagement;
