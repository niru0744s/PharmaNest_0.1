const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/User/VerificationController');

// Send verification email
router.post('/send-verification', verificationController.sendVerificationEmail);

// Verify email with token
router.get('/verify-email/:token', verificationController.verifyEmail);

// Resend verification email
router.post('/resend-verification', verificationController.resendVerification);

module.exports = router;
