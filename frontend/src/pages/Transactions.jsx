import React from 'react';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Receipt } from '@mui/icons-material';

const Transactions = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center">
        <Receipt sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" fontWeight={600} gutterBottom>
          Transaction History
        </Typography>
        <Typography variant="h6" color="text.secondary" maxWidth="md" mx="auto" mb={4}>
          View and manage all your transactions. Coming soon!
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button variant="contained" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default Transactions;
