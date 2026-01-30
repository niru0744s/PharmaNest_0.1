const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/Payment/PaymentController');
const refundController = require('../controllers/Payment/RefundController');
const { userMiddleware } = require('../middleware/tokenVerify');

// Create Razorpay order
router.post('/create-order', userMiddleware, paymentController.createOrder);

// Verify payment signature
router.post('/verify-payment', userMiddleware, paymentController.verifyPayment);

// Get payment status
router.get('/status/:orderId', userMiddleware, paymentController.getPaymentStatus);

// Refund endpoints
router.post('/refund', userMiddleware, refundController.initiateRefund);
router.get('/refund-status/:orderId', userMiddleware, refundController.getRefundStatus);

// Webhook endpoint (no auth middleware - Razorpay calls this)
router.post('/webhook', paymentController.webhook);

module.exports = router;
