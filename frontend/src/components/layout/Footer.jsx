import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import {
  AccountBalance,
  LinkedIn,
  Twitter,
  Facebook,
  Instagram,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Banking Services': [
      { title: 'Personal Banking', href: '/services/personal' },
      { title: 'Business Banking', href: '/services/business' },
      { title: 'Investment Services', href: '/services/investment' },
      { title: 'Loans & Mortgages', href: '/services/loans' },
    ],
    'Support': [
      { title: 'Contact Us', href: '/contact' },
      { title: 'Help Center', href: '/help' },
      { title: 'Security Center', href: '/security' },
      { title: 'Branch Locator', href: '/branches' },
    ],
    'About': [
      { title: 'About Us', href: '/about' },
      { title: 'Careers', href: '/careers' },
      { title: 'News & Updates', href: '/news' },
      { title: 'Community Impact', href: '/community' },
    ],
    'Legal': [
      { title: 'Privacy Policy', href: '/privacy' },
      { title: 'Terms of Service', href: '/terms' },
      { title: 'Cookie Policy', href: '/cookies' },
      { title: 'Accessibility', href: '/accessibility' },
    ],
  };

  const socialLinks = [
    { icon: <LinkedIn />, href: 'https://linkedin.com/company/e-banking', label: 'LinkedIn' },
    { icon: <Twitter />, href: 'https://twitter.com/ebanking', label: 'Twitter' },
    { icon: <Facebook />, href: 'https://facebook.com/ebanking', label: 'Facebook' },
    { icon: <Instagram />, href: 'https://instagram.com/ebanking', label: 'Instagram' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#212121',
        color: 'white',
        pt: 6,
        pb: 3,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={3}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalance sx={{ mr: 1, color: '#117A8B' }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  E-Banking System
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 3, color: '#BDBDBD', lineHeight: 1.6 }}>
                Your trusted partner for secure, convenient, and innovative banking solutions. 
                Experience the future of banking with our comprehensive digital platform.
              </Typography>
              
              {/* Contact Info */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Phone sx={{ mr: 1, fontSize: '1rem', color: '#117A8B' }} />
                  <Typography variant="body2" sx={{ color: '#BDBDBD' }}>
                    1-800-EBANKING
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Email sx={{ mr: 1, fontSize: '1rem', color: '#117A8B' }} />
                  <Typography variant="body2" sx={{ color: '#BDBDBD' }}>
                    support@ebanking.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ mr: 1, fontSize: '1rem', color: '#117A8B' }} />
                  <Typography variant="body2" sx={{ color: '#BDBDBD' }}>
                    270 Park Avenue, New York, NY
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <Grid item xs={6} md={2.25} key={category}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#117A8B',
                }}
              >
                {category}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {links.map((link) => (
                  <Link
                    key={link.title}
                    component={RouterLink}
                    to={link.href}
                    sx={{
                      color: '#BDBDBD',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      '&:hover': {
                        color: '#117A8B',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {link.title}
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4, borderColor: '#424242' }} />

        {/* Bottom Footer */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2,
          }}
        >
          {/* Copyright */}
          <Typography variant="body2" sx={{ color: '#BDBDBD' }}>
            © {currentYear} E-Banking System. All rights reserved. 
            <br />
            <Box component="span" sx={{ fontSize: '0.75rem' }}>
              Member FDIC. Equal Housing Lender. JPMorgan Chase Bank, N.A.
            </Box>
          </Typography>

          {/* Social Links */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {socialLinks.map((social) => (
              <IconButton
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                sx={{
                  color: '#BDBDBD',
                  '&:hover': {
                    color: '#117A8B',
                    backgroundColor: 'rgba(17, 122, 139, 0.1)',
                  },
                }}
              >
                {social.icon}
              </IconButton>
            ))}
          </Box>
        </Box>

        {/* Security Notice */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            backgroundColor: 'rgba(17, 122, 139, 0.1)',
            borderRadius: 1,
            border: '1px solid rgba(17, 122, 139, 0.2)',
          }}
        >
          <Typography variant="caption" sx={{ color: '#BDBDBD', fontSize: '0.75rem' }}>
            🔒 <strong>Security Notice:</strong> E-Banking System uses bank-level security with 256-bit SSL encryption 
            to protect your personal and financial information. We will never ask for your login credentials via 
            email or phone. Always log in through our official website or mobile app.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
