import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  TrendingUp,
  Security,
  AccountBalance,
  Speed,
  ArrowForward,
  PlayArrow,
  CheckCircle,
  Verified,
  SupportAgent,
} from '@mui/icons-material';

// Sophisticated styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background: `
    linear-gradient(135deg, 
      ${theme.palette.primary.main} 0%, 
      ${theme.palette.primary.dark} 40%, 
      #001a2e 80%,
      #000c1a 100%
    ),
    radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 60%),
    radial-gradient(circle at 75% 75%, rgba(100,181,246,0.15) 0%, transparent 50%)
  `,
  minHeight: '100vh',
  paddingTop: '80px', // Account for fixed navbar
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3Ccircle cx='50' cy='50' r='1'/%3E%3Ccircle cx='90' cy='90' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
    `,
    animation: 'backgroundMove 30s linear infinite',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    right: '-20%',
    width: '100%',
    height: '200%',
    background: `conic-gradient(
      from 0deg at 50% 50%,
      transparent 0deg,
      ${alpha(theme.palette.primary.light, 0.1)} 60deg,
      transparent 120deg,
      ${alpha('#64b5f6', 0.08)} 180deg,
      transparent 240deg,
      ${alpha(theme.palette.primary.light, 0.06)} 300deg,
      transparent 360deg
    )`,
    animation: 'rotate 60s linear infinite',
  },
  '@keyframes backgroundMove': {
    '0%': { transform: 'translate(0, 0)' },
    '100%': { transform: 'translate(-120px, -120px)' },
  },
  '@keyframes rotate': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  color: theme.palette.primary.contrastText,
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  background: 'linear-gradient(145deg, #ffffff 0%, #fafbfc 100%)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  borderRadius: 16,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    transform: 'scaleX(0)',
    transformOrigin: 'left',
    transition: 'transform 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-12px)',
    boxShadow: `0 24px 48px ${alpha(theme.palette.primary.main, 0.15)}`,
    borderColor: alpha(theme.palette.primary.main, 0.2),
    '&::before': {
      transform: 'scaleX(1)',
    },
    '& .feature-icon': {
      transform: 'scale(1.1) rotate(5deg)',
      background: `linear-gradient(135deg, 
        ${alpha(theme.palette.primary.main, 0.2)} 0%, 
        ${alpha(theme.palette.primary.light, 0.25)} 100%
      )`,
      '& svg': {
        color: theme.palette.primary.main,
      },
    },
  },
}));

const StatsSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(180deg, 
    ${theme.palette.background.secondary} 0%, 
    ${theme.palette.background.paper} 100%
  )`,
  padding: theme.spacing(8, 0),
}));

const StatsCard = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4),
  borderRadius: 16,
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.12)',
  },
}));

const PremiumButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  padding: '16px 32px',
  fontSize: '1.1rem',
  fontWeight: 600,
  borderRadius: 12,
  textTransform: 'none',
  boxShadow: '0 8px 24px rgba(0, 108, 174, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 32px rgba(0, 108, 174, 0.4)',
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, #003A5D 100%)`,
  },
}));

const Home_Professional = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <AccountBalance sx={{ fontSize: 48 }} />,
      title: 'Digital Banking Excellence',
      description: 'Experience next-generation banking with our comprehensive digital platform designed for modern financial needs.',
    },
    {
      icon: <Security sx={{ fontSize: 48 }} />,
      title: 'Bank-Grade Security',
      description: 'Your financial data is protected by enterprise-level encryption and multi-factor authentication protocols.',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 48 }} />,
      title: 'Investment Solutions',
      description: 'Access professional investment tools and market insights to grow your wealth with confidence.',
    },
    {
      icon: <Speed sx={{ fontSize: 48 }} />,
      title: 'Instant Transactions',
      description: 'Transfer funds, pay bills, and manage accounts with lightning-fast processing and real-time updates.',
    },
  ];

  const stats = [
    { number: '$2.4T', label: 'Assets Under Management' },
    { number: '60M+', label: 'Global Customers' },
    { number: '200+', label: 'Countries Served' },
    { number: '150+', label: 'Years of Excellence' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="xl" sx={{ height: '100%' }}>
          <Grid container spacing={0} sx={{ 
            minHeight: 'calc(100vh - 80px)', 
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Left Content */}
            <Grid item xs={12} lg={6} sx={{ 
              display: 'flex', 
              alignItems: 'center',
              minHeight: { xs: 'auto', lg: 'calc(100vh - 80px)' },
              py: { xs: 6, lg: 0 }
            }}>
              <Box sx={{ 
                width: '100%',
                maxWidth: 600,
                mx: { xs: 'auto', lg: 0 },
                textAlign: { xs: 'center', lg: 'left' }
              }}>
                {/* Trust Badge */}
                <Box sx={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  mb: 4,
                  px: 4,
                  py: 1.5,
                  borderRadius: 30,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${alpha('#ffffff', 0.25)}`,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  animation: 'glow 3s ease-in-out infinite alternate',
                  '@keyframes glow': {
                    '0%': { boxShadow: '0 8px 32px rgba(0,0,0,0.15)' },
                    '100%': { boxShadow: '0 8px 32px rgba(76,175,80,0.3)' },
                  }
                }}>
                  <Verified sx={{ fontSize: 22, mr: 1.5, color: '#4caf50' }} />
                  <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 600, fontSize: '0.95rem' }}>
                    FDIC Insured • Award-Winning Security • Trusted by 60M+
                  </Typography>
                </Box>

                {/* Hero Title */}
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4.2rem' },
                    fontWeight: 800,
                    mb: 3,
                    lineHeight: 1.1,
                    color: '#ffffff',
                    textShadow: '0 4px 20px rgba(0,0,0,0.4)',
                    '& .gradient-text': {
                      background: 'linear-gradient(135deg, #64b5f6 0%, #ffffff 30%, #81c784 60%, #ffeb3b 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundSize: '200% 200%',
                      animation: 'gradientShift 4s ease-in-out infinite',
                    },
                    '@keyframes gradientShift': {
                      '0%, 100%': { backgroundPosition: '0% 50%' },
                      '50%': { backgroundPosition: '100% 50%' },
                    }
                  }}
                >
                  Banking that builds{' '}
                  <span className="gradient-text">futures</span>
                </Typography>
                
                {/* Subtitle */}
                <Typography
                  variant="h6"
                  sx={{
                    mb: 5,
                    color: alpha('#ffffff', 0.9),
                    fontWeight: 400,
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                    lineHeight: 1.5,
                    textShadow: '0 2px 15px rgba(0,0,0,0.3)',
                  }}
                >
                  Experience <strong>next-generation banking</strong> with enterprise-grade security, 
                  AI-powered insights, and personalized financial solutions designed for your success.
                </Typography>

                {/* Action Buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 3, 
                  flexWrap: 'wrap', 
                  mb: 6,
                  justifyContent: { xs: 'center', lg: 'flex-start' }
                }}>
                  <PremiumButton
                    size="large"
                    sx={{ 
                      px: 5, 
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
                      color: theme.palette.primary.main,
                      borderRadius: 50,
                      minWidth: 180,
                      boxShadow: '0 8px 25px rgba(255,255,255,0.2)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                        transform: 'translateY(-3px) scale(1.02)',
                        boxShadow: '0 12px 35px rgba(255,255,255,0.3)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      Open Account
                      <ArrowForward sx={{ fontSize: 20 }} />
                    </Box>
                  </PremiumButton>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<PlayArrow sx={{ fontSize: 22 }} />}
                    sx={{
                      px: 4,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 500,
                      color: '#ffffff',
                      borderColor: alpha('#ffffff', 0.4),
                      borderWidth: 2,
                      borderRadius: 50,
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
                      backdropFilter: 'blur(20px)',
                      minWidth: 160,
                      '&:hover': {
                        borderColor: '#ffffff',
                        borderWidth: 2,
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 20px rgba(255,255,255,0.15)',
                      },
                    }}
                  >
                    Watch Demo
                  </Button>
                </Box>

                {/* Trust Indicators */}
                <Grid container spacing={2} sx={{ 
                  maxWidth: 500,
                  mx: { xs: 'auto', lg: 0 }
                }}>
                  {[
                    { icon: <Security />, text: 'Bank-Grade Security', color: '#4caf50' },
                    { icon: <SupportAgent />, text: '24/7 Expert Support', color: '#2196f3' },
                    { icon: <TrendingUp />, text: 'Award-Winning Platform', color: '#ff9800' }
                  ].map((item, index) => (
                    <Grid item xs={12} key={index}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: { xs: 'center', lg: 'flex-start' },
                        p: 1.5,
                        borderRadius: 2,
                        background: alpha('#ffffff', 0.05),
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${alpha('#ffffff', 0.1)}`,
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          background: alpha('#ffffff', 0.1),
                          transform: 'translateX(8px)',
                          '& .trust-icon': {
                            transform: 'scale(1.2)',
                            color: item.color,
                          }
                        }
                      }}>
                        <Box className="trust-icon" sx={{ 
                          mr: 2, 
                          fontSize: 24, 
                          color: alpha('#ffffff', 0.8),
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          {item.icon}
                        </Box>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 500, 
                          color: alpha('#ffffff', 0.9),
                          fontSize: '0.9rem'
                        }}>
                          {item.text}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
            
            {/* Right Content - Dashboard */}
            <Grid item xs={12} lg={6} sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: { xs: 400, lg: 'calc(100vh - 80px)' },
              py: { xs: 4, lg: 0 }
            }}>
              <Box sx={{ 
                position: 'relative', 
                width: '100%',
                maxWidth: 450,
                height: { xs: 350, md: 450 },
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}>
                {/* Main Dashboard Card */}
                <Card sx={{
                  width: { xs: 320, md: 380 },
                  height: { xs: 200, md: 240 },
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)',
                  backdropFilter: 'blur(30px)',
                  border: `2px solid ${alpha('#ffffff', 0.3)}`,
                  borderRadius: 3,
                  position: 'relative',
                  zIndex: 5,
                  animation: 'cardFloat 6s ease-in-out infinite',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1)',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 6,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, #64b5f6, #4caf50)`,
                  },
                  '@keyframes cardFloat': {
                    '0%, 100%': { transform: 'translateY(0px) rotateY(0deg)' },
                    '33%': { transform: 'translateY(-12px) rotateY(2deg)' },
                    '66%': { transform: 'translateY(-6px) rotateY(-1deg)' },
                  },
                }}>
                  <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    {/* Card Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 700, 
                        color: theme.palette.text.primary, 
                        fontSize: '1rem' 
                      }}>
                        Account Overview
                      </Typography>
                      <Box sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
                      }}>
                        <AccountBalance sx={{ color: '#ffffff', fontSize: 20 }} />
                      </Box>
                    </Box>
                    
                    {/* Balance */}
                    <Typography variant="h4" sx={{ 
                      fontWeight: 800, 
                      color: theme.palette.primary.main, 
                      mb: 1,
                      fontSize: { xs: '1.8rem', md: '2.2rem' }
                    }}>
                      $127,459.32
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: theme.palette.success.main, 
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      mb: 2
                    }}>
                      ↗ +$2,431 this month (+1.9%)
                    </Typography>
                    
                    {/* Progress Bars */}
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      {[
                        { width: '85%', color: theme.palette.primary.main },
                        { width: '65%', color: '#4caf50' },
                        { width: '45%', color: '#ff9800' },
                        { width: '25%', color: alpha(theme.palette.primary.main, 0.3) }
                      ].map((bar, i) => (
                        <Box key={i} sx={{ 
                          height: 5, 
                          flex: 1, 
                          background: alpha(theme.palette.primary.main, 0.1),
                          borderRadius: 3,
                          overflow: 'hidden',
                          position: 'relative'
                        }}>
                          <Box sx={{
                            height: '100%',
                            width: bar.width,
                            background: bar.color,
                            borderRadius: 3,
                            animation: `fillBar 2s ease-out ${i * 0.3}s both`
                          }} />
                        </Box>
                      ))}
                    </Box>
                    
                    {/* Stats Footer */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="caption" sx={{ 
                        color: theme.palette.text.secondary, 
                        fontWeight: 500,
                        fontSize: '0.75rem'
                      }}>
                        Savings Goal: 78%
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: theme.palette.text.secondary, 
                        fontWeight: 500,
                        fontSize: '0.75rem'
                      }}>
                        Next Payment: 3 days
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                {/* Floating Elements - Properly Positioned */}
                {[
                  { 
                    top: '10%', 
                    right: '15%', 
                    delay: '0s', 
                    icon: <Security />, 
                    color: '#4caf50',
                    size: 60
                  },
                  { 
                    bottom: '20%', 
                    left: '10%', 
                    delay: '2s', 
                    icon: <TrendingUp />, 
                    color: '#2196f3',
                    size: 70
                  },
                  { 
                    top: '65%', 
                    right: '5%', 
                    delay: '4s', 
                    icon: <Speed />, 
                    color: '#ff9800',
                    size: 55
                  },
                ].map((item, index) => (
                  <Box key={index} sx={{
                    position: 'absolute',
                    [item.top ? 'top' : 'bottom']: item.top || item.bottom,
                    [item.left ? 'left' : 'right']: item.left || item.right,
                    width: item.size,
                    height: item.size,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${item.color}, ${alpha(item.color, 0.8)})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: `floatElement 8s ease-in-out infinite ${item.delay}, pulse 3s ease-in-out infinite ${item.delay}`,
                    boxShadow: `0 10px 25px ${alpha(item.color, 0.4)}`,
                    border: `2px solid ${alpha('#ffffff', 0.3)}`,
                    backdropFilter: 'blur(10px)',
                    zIndex: 3,
                    '@keyframes floatElement': {
                      '0%, 100%': { transform: 'translateY(0px) scale(1)' },
                      '50%': { transform: 'translateY(-20px) scale(1.05)' },
                    },
                    '@keyframes pulse': {
                      '0%, 100%': { boxShadow: `0 10px 25px ${alpha(item.color, 0.4)}` },
                      '50%': { boxShadow: `0 10px 25px ${alpha(item.color, 0.7)}, 0 0 0 6px ${alpha(item.color, 0.2)}` },
                    },
                    '& svg': { color: '#ffffff', fontSize: 24 }
                  }}>
                    {item.icon}
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      {/* Statistics Section */}
      <StatsSection>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            sx={{ mb: 6, fontWeight: 600, color: theme.palette.text.primary }}
          >
            Trusted by millions worldwide
          </Typography>
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <StatsCard>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.primary.main,
                      mb: 1,
                      fontSize: { xs: '2rem', md: '2.5rem' },
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 500, color: theme.palette.text.secondary }}
                  >
                    {stat.label}
                  </Typography>
                </StatsCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </StatsSection>

      {/* Features Section */}
      <Box sx={{ 
        py: 12, 
        background: `linear-gradient(180deg, 
          ${theme.palette.background.paper} 0%, 
          ${alpha(theme.palette.primary.main, 0.02)} 100%
        )` 
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography
              variant="h3"
              sx={{ 
                mb: 4, 
                fontWeight: 700, 
                color: theme.palette.text.primary,
                fontSize: { xs: '2rem', md: '2.5rem' },
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 80,
                  height: 4,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                  borderRadius: 2,
                }
              }}
            >
              Comprehensive Financial Services
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: 700,
                mx: 'auto',
                fontWeight: 400,
                fontSize: '1.125rem',
                lineHeight: 1.6,
              }}
            >
              We provide end-to-end financial solutions designed to meet the diverse needs of individuals, businesses, and institutions.
            </Typography>
          </Box>

          <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <FeatureCard sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ 
                    p: 4, 
                    flexGrow: 1, 
                    display: 'flex', 
                    flexDirection: 'column',
                    textAlign: 'center',
                    position: 'relative'
                  }}>
                    <Box
                      className="feature-icon"
                      sx={{
                        color: theme.palette.primary.main,
                        mb: 3,
                        transition: 'all 0.3s ease',
                        alignSelf: 'center',
                        p: 2,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, 
                          ${alpha(theme.palette.primary.main, 0.1)} 0%, 
                          ${alpha(theme.palette.primary.light, 0.15)} 100%
                        )`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 80,
                        height: 80,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{ 
                        mb: 2, 
                        fontWeight: 600, 
                        color: theme.palette.text.primary,
                        fontSize: '1.25rem',
                        lineHeight: 1.3,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ 
                        color: theme.palette.text.secondary, 
                        lineHeight: 1.7,
                        fontSize: '0.95rem',
                        flexGrow: 1,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, 
            ${alpha(theme.palette.primary.main, 0.05)} 0%, 
            ${alpha(theme.palette.primary.light, 0.08)} 100%
          )`,
          py: 10,
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{ mb: 3, fontWeight: 600, color: theme.palette.text.primary }}
            >
              Ready to get started?
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 6, color: theme.palette.text.secondary, fontWeight: 400 }}
            >
              Join millions of customers who trust us with their financial future. Open your account today and experience banking excellence.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <PremiumButton size="large" endIcon={<ArrowForward />}>
                Open Account Today
              </PremiumButton>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderWidth: 2,
                  '&:hover': { borderWidth: 2 },
                }}
              >
                Contact Our Experts
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home_Professional;
