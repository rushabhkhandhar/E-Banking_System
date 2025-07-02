const express = require('express');
const accountController = require('../controllers/accountController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// User account management
router.post('/', accountController.createAccount);
router.get('/', accountController.getMyAccounts);
router.get('/transfer/available', accountController.getTransferableAccounts);
router.get('/:accountId', accountController.getAccount);
router.patch('/:accountId', accountController.updateAccount);

// Account status management
router.patch('/:accountId/freeze', accountController.freezeAccount);
router.patch('/:accountId/unfreeze', accountController.unfreezeAccount);
router.delete('/:accountId', accountController.closeAccount);

// Account statements
router.get('/:accountId/statement', accountController.getAccountStatement);

// Admin only routes
router.get('/admin/all', restrictTo('admin'), accountController.getAllAccounts);
router.patch('/admin/:accountId', restrictTo('admin'), accountController.adminUpdateAccount);
router.delete('/admin/:accountId/force-close', restrictTo('admin'), accountController.forceCloseAccount);

module.exports = router;
