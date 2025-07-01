const express = require('express');
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// User profile management
router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.get('/dashboard', userController.getDashboard);

// Transaction history and statements
router.get('/transactions', userController.getTransactionHistory);
router.get('/account-statement/:accountId', userController.getAccountStatement);

// Admin only routes
router.use(restrictTo('admin'));

router.get('/', userController.getAllUsers);
router.get('/:userId', userController.getUserById);
router.patch('/:userId', userController.updateUserStatus);
router.delete('/:userId', userController.deleteUserProfile);
router.patch('/:userId/activate', userController.updateUserStatus);
router.patch('/:userId/deactivate', userController.updateUserStatus);

module.exports = router;
