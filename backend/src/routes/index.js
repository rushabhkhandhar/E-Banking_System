const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const accountRoutes = require('./accountRoutes');
const transactionRoutes = require('./transactionRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'E-Banking System API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// API version and route mounting
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/accounts', accountRoutes);
router.use('/transactions', transactionRoutes);
router.use('/admin', adminRoutes);

// Catch-all for undefined routes
router.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'error',
        message: `Route ${req.originalUrl} not found on this server`,
        availableRoutes: {
            auth: '/api/v1/auth',
            users: '/api/v1/users',
            accounts: '/api/v1/accounts',
            transactions: '/api/v1/transactions',
            health: '/api/v1/health'
        }
    });
});

module.exports = router;
