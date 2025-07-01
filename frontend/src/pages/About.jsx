import React from 'react';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Info } from '@mui/icons-material';

const About = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center">
        <Info sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" fontWeight={600} gutterBottom>
          About E-Banking System
        </Typography>
        <Typography variant="h6" color="text.secondary" maxWidth="md" mx="auto" mb={4}>
          Your trusted partner in digital banking, providing secure and innovative financial solutions.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button variant="contained" onClick={() => navigate('/register')}>
            Get Started
          </Button>
          <Button variant="outlined" onClick={() => navigate('/contact')}>
            Contact Us
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default About;
