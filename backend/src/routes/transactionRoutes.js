const express = require('express');
const transactionController = require('../controllers/transactionController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Transaction operations
router.post('/deposit/:accountId', transactionController.deposit);
router.post('/withdraw/:accountId', transactionController.withdraw);
router.post('/transfer/:fromAccountId', transactionController.transfer);

// Transaction history and details
router.get('/account/:accountId', transactionController.getTransactionHistory);
router.get('/user/all', transactionController.getAllUserTransactions);
router.get('/:transactionId', transactionController.getTransaction);

// Admin only routes
router.use(restrictTo('admin'));

router.get('/admin/all', transactionController.getAllTransactions);
router.patch('/admin/:transactionId/reverse', transactionController.reverseTransaction);

module.exports = router;
