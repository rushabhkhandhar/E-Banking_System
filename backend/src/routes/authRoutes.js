const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes - No authentication required
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.post('/verify-email/:token', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerificationEmail);

// Protected routes - Authentication required
router.use(protect); // All routes after this middleware are protected

router.post('/logout', authController.logout);
router.get('/me', authController.getMe);
router.patch('/update-password', authController.updatePassword);

module.exports = router;
