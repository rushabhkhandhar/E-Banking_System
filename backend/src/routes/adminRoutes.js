const express = require('express');
const adminController = require('../controllers/adminController');
const transactionController = require('../controllers/transactionController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(restrictTo('admin'));

// Dashboard and statistics
router.get('/dashboard/stats', adminController.getDashboardStats);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/:userId', adminController.getUserDetails);
router.patch('/users/:userId/status', adminController.toggleUserStatus);
router.patch('/users/:userId/activate', (req, res, next) => {
    req.body.isActive = true;
    adminController.toggleUserStatus(req, res, next);
});
router.patch('/users/:userId/deactivate', (req, res, next) => {
    req.body.isActive = false;
    adminController.toggleUserStatus(req, res, next);
});
router.delete('/users/:userId', adminController.deleteUserProfile);

// Account management
router.get('/accounts', adminController.getAllAccounts);
router.patch('/accounts/:accountId/freeze', adminController.toggleAccountFreeze);
router.patch('/accounts/:accountId/update', adminController.updateAccount);
router.delete('/accounts/:accountId/force-close', adminController.forceCloseAccount);

// Manual transactions
router.post('/accounts/:accountId/deposit', adminController.manualDeposit);
router.post('/accounts/:accountId/withdraw', adminController.manualWithdrawal);

// Transaction management
router.get('/transactions', transactionController.getAllTransactions);
router.get('/transactions/filter', transactionController.getAllTransactions);
router.patch('/transactions/:transactionId/reverse', transactionController.reverseTransaction);

module.exports = router;
