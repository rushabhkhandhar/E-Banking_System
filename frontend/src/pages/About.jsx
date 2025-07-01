import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  Paper,
  Stack 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  AccountBalance, 
  Security, 
  Speed, 
  Support,
  TrendingUp,
  Shield
} from '@mui/icons-material';

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Security sx={{ fontSize: 48, color: '#1e3a8a' }} />,
      title: 'Bank-Grade Security',
      description: 'Your financial data is protected with enterprise-level encryption and multi-factor authentication.'
    },
    {
      icon: <Speed sx={{ fontSize: 48, color: '#1e3a8a' }} />,
      title: 'Lightning Fast',
      description: 'Experience instant transfers, real-time notifications, and seamless account management.'
    },
    {
      icon: <Support sx={{ fontSize: 48, color: '#1e3a8a' }} />,
      title: '24/7 Support',
      description: 'Our dedicated support team is available around the clock to assist with your banking needs.'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 48, color: '#1e3a8a' }} />,
      title: 'Smart Analytics',
      description: 'Track your spending patterns and financial goals with intelligent insights and reporting.'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Container maxWidth="lg" sx={{ py: 6, mt: 2 }}>
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          color: 'white',
          p: 6,
          borderRadius: 3,
          mb: 6,
          textAlign: 'center',
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
          <AccountBalance sx={{ fontSize: { xs: 60, md: 80 }, mb: 3 }} />
          <Typography variant="h2" fontWeight={700} gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '3.75rem' } }}>
            JPMorgan E-Banking
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9, mb: 4, maxWidth: 'md', mx: 'auto', fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
            Experience the future of banking with our secure, fast, and intelligent digital platform
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              bgcolor: 'white',
              color: '#1e3a8a',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            Get Started Today
          </Button>
        </Box>
      </Paper>

      {/* Features Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" fontWeight={600} textAlign="center" gutterBottom>
          Why Choose Our Platform?
        </Typography>
        <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 4, maxWidth: 'md', mx: 'auto' }}>
          Built with cutting-edge technology and designed for the modern banking experience
        </Typography>

        <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} lg={6} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  minHeight: 280,
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 30px rgba(30, 58, 138, 0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Box sx={{ mb: 3 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Mission Section */}
      <Paper
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 3,
          p: 6
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6} sx={{ textAlign: 'center', order: { xs: 2, md: 1 } }}>
            <Shield sx={{ fontSize: { xs: 80, md: 120 }, color: '#1e3a8a', mb: 2 }} />
          </Grid>
          <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 2 } }}>
            <Typography variant="h4" fontWeight={600} gutterBottom sx={{ fontSize: { xs: '2rem', md: '2.125rem' } }}>
              Our Mission
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              To democratize banking by providing secure, accessible, and innovative financial services 
              that empower individuals and businesses to achieve their financial goals. We believe that 
              banking should be simple, transparent, and available to everyone, anywhere, anytime.
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
              With state-of-the-art security measures and user-centric design, we're committed to 
              delivering a banking experience that exceeds expectations and builds lasting trust.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                onClick={() => navigate('/login')}
                sx={{
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)'
                  }
                }}
              >
                Sign In
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/register')}
                sx={{
                  borderColor: '#1e3a8a',
                  color: '#1e3a8a',
                  '&:hover': {
                    borderColor: '#1e40af',
                    bgcolor: 'rgba(30, 58, 138, 0.05)'
                  }
                }}
              >
                Create Account
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
      </Container>
    </Box>
  );
};

export default About;
