import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  alpha,
  Avatar,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  AccountBalance,
  Person,
  KeyboardArrowDown,
  Phone,
  LocationOn,
  ExitToApp,
  AdminPanelSettings,
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  boxShadow: '0 1px 20px rgba(0, 0, 0, 0.05)',
  color: theme.palette.text.primary,
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1200,
  margin: 0,
  padding: 0,
}));

const Logo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  textDecoration: 'none',
  color: 'inherit',
  '&:hover': {
    opacity: 0.8,
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 500,
  fontSize: '0.95rem',
  textTransform: 'none',
  padding: theme.spacing(1, 2),
  borderRadius: 8,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    color: theme.palette.primary.main,
  },
  '&.active': {
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));

const PremiumButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: 8,
  padding: theme.spacing(1.2, 3),
  boxShadow: '0 4px 12px rgba(0, 108, 174, 0.25)',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 16px rgba(0, 108, 174, 0.35)',
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, #003A5D 100%)`,
  },
}));

const UserMenuButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  textTransform: 'none',
  borderRadius: 12,
  padding: theme.spacing(1, 2),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    borderColor: alpha(theme.palette.primary.main, 0.3),
  },
}));

const MobileDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 280,
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  },
}));

const Navbar_Sophisticated = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Accounts', path: '/dashboard' },
    { name: 'Transactions', path: '/transactions' },
    // { name: 'Transfer', path: '/transfer' },
    { name: 'About', path: '/about' },
  ];

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      handleUserMenuClose();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <StyledAppBar position="sticky" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar sx={{ py: 1, minHeight: { xs: 64, md: 72 } }}>
          {/* Logo */}
          <Logo component={Link} to="/" sx={{ mr: 4 }}>
            <AccountBalance 
              sx={{ 
                fontSize: 32, 
                color: theme.palette.primary.main 
              }} 
            />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                fontSize: '1.5rem',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              E-Banking
            </Typography>
          </Logo>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', gap: 1, ml: 4 }}>
              {navigation.map((item) => (
                <NavButton
                  key={item.name}
                  component={Link}
                  to={item.path}
                  className={isActivePath(item.path) ? 'active' : ''}
                >
                  {item.name}
                </NavButton>
              ))}
            </Box>
          )}

          {/* Desktop Actions */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {user ? (
                <>
                  {/* Show Admin Dashboard button if user is admin */}
                  {user.role === 'admin' && (
                    <Button
                      component={Link}
                      to="/admin/dashboard"
                      variant="outlined"
                      sx={{ 
                        color: theme.palette.warning.main,
                        borderColor: theme.palette.warning.main,
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.warning.main, 0.08),
                          borderColor: theme.palette.warning.main,
                        },
                      }}
                    >
                      Admin Panel
                    </Button>
                  )}
                  
                  <UserMenuButton
                    onClick={handleUserMenuOpen}
                    endIcon={<KeyboardArrowDown />}
                    startIcon={
                      <Avatar 
                        sx={{ 
                          width: 28, 
                          height: 28,
                          backgroundColor: user.role === 'admin' ? theme.palette.warning.main : theme.palette.primary.main,
                          fontSize: '0.875rem',
                        }}
                      >
                        {user.firstName?.[0] || user.email?.[0] || 'U'}
                      </Avatar>
                    }
                  >
                    {user.firstName || 'Account'} {user.role === 'admin' && '(Admin)'}
                  </UserMenuButton>
                  <Menu
                    anchorEl={userMenuAnchor}
                    open={Boolean(userMenuAnchor)}
                    onClose={handleUserMenuClose}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        borderRadius: 2,
                        minWidth: 220,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      },
                    }}
                  >
                    {user.role === 'admin' ? (
                      <>
                        <MenuItem onClick={() => { navigate('/admin/dashboard'); handleUserMenuClose(); }}>
                          <Person sx={{ mr: 2 }} />
                          Admin Dashboard
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout} sx={{ color: theme.palette.error.main }}>
                          <ExitToApp sx={{ mr: 2 }} />
                          Sign Out
                        </MenuItem>
                      </>
                    ) : (
                      <>
                        <MenuItem onClick={() => { navigate('/dashboard'); handleUserMenuClose(); }}>
                          <Person sx={{ mr: 2 }} />
                          Dashboard
                        </MenuItem>
                        <MenuItem onClick={() => { navigate('/profile'); handleUserMenuClose(); }}>
                          <Person sx={{ mr: 2 }} />
                          Profile
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout} sx={{ color: theme.palette.error.main }}>
                          <ExitToApp sx={{ mr: 2 }} />
                          Sign Out
                        </MenuItem>
                      </>
                    )}
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/login"
                    sx={{ 
                      color: theme.palette.text.primary,
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      },
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    component={Link}
                    to="/admin/login"
                    sx={{ 
                      color: theme.palette.text.primary,
                      fontWeight: 500,
                      fontSize: '0.8rem',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      },
                    }}
                  >
                    Admin
                  </Button>
                  <PremiumButton component={Link} to="/register">
                    Open Account
                  </PremiumButton>
                </>
              )}
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Box sx={{ ml: 'auto' }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleMobileMenuToggle}
                sx={{ 
                  color: theme.palette.text.primary,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <MobileDrawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
      >
        <Box sx={{ p: 3 }}>
          <Logo component={Link} to="/" onClick={handleMobileMenuToggle}>
            <AccountBalance sx={{ fontSize: 28, color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              E-Banking
            </Typography>
          </Logo>
        </Box>
        <Divider />
        <List>
          {navigation.map((item) => (
            <ListItem key={item.name} disablePadding>
              <NavButton
                component={Link}
                to={item.path}
                onClick={handleMobileMenuToggle}
                sx={{ 
                  width: '100%', 
                  justifyContent: 'flex-start',
                  px: 3,
                  py: 1.5,
                  borderRadius: 0,
                }}
                className={isActivePath(item.path) ? 'active' : ''}
              >
                {item.name}
              </NavButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box sx={{ p: 3 }}>
          {user ? (
            <Box>
              <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.secondary }}>
                Welcome, {user.firstName || 'User'} {user.role === 'admin' && '(Admin)'}
              </Typography>
              
              {/* Show Admin Dashboard button for admin users */}
              {user.role === 'admin' && (
                <Button
                  component={Link}
                  to="/admin/dashboard"
                  variant="contained"
                  fullWidth
                  onClick={handleMobileMenuToggle}
                  sx={{ 
                    mb: 2,
                    backgroundColor: theme.palette.warning.main,
                    '&:hover': {
                      backgroundColor: theme.palette.warning.dark,
                    },
                  }}
                >
                  Admin Dashboard
                </Button>
              )}
              
              <Button
                fullWidth
                variant="outlined"
                onClick={handleLogout}
                startIcon={<ExitToApp />}
                sx={{ mb: 1 }}
              >
                Sign Out
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                fullWidth
                onClick={handleMobileMenuToggle}
              >
                Sign In
              </Button>
              <Button
                component={Link}
                to="/admin/login"
                variant="outlined"
                fullWidth
                onClick={handleMobileMenuToggle}
                size="small"
              >
                Admin Login
              </Button>
              <PremiumButton
                component={Link}
                to="/register"
                fullWidth
                onClick={handleMobileMenuToggle}
              >
                Open Account
              </PremiumButton>
            </Box>
          )}
        </Box>
      </MobileDrawer>
    </StyledAppBar>
  );
};

export default Navbar_Sophisticated;
