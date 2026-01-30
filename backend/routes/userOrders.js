const express = require('express');
const router = express.Router();
const orderController = require('../controllers/User/OrderController');
const { userMiddleware } = require('../middleware/tokenVerify');
const invoiceController = require('../controllers/Order/InvoiceController');

// Download Invoice
router.get('/:orderId/invoice', userMiddleware, invoiceController.generateInvoice);

// Get order details
router.get('/:orderId', userMiddleware, orderController.getOrderDetails);

// Filter/search orders
router.get('/', userMiddleware, orderController.filterOrders);

// Cancel order
router.post('/:orderId/cancel', userMiddleware, orderController.cancelOrder);

module.exports = router;
