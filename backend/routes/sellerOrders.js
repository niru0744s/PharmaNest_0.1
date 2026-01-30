const express = require('express');
const router = express.Router();
const sellerOrderController = require('../controllers/host/SellerOrderController');
const { hostMiddleware } = require('../middleware/tokenVerify');

// Get seller's orders (with stats and pagination)
router.get('/', hostMiddleware, sellerOrderController.getSellerOrders);

// Get order details
router.get('/:orderId', hostMiddleware, sellerOrderController.getOrderDetails);

// Update order status
router.post('/:orderId/status', hostMiddleware, sellerOrderController.updateOrderStatus);

// Cancel order
router.post('/:orderId/cancel', hostMiddleware, sellerOrderController.cancelOrder);

module.exports = router;
