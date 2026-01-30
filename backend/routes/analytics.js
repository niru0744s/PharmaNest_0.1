const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/host/SellerAnalyticsController');
const { hostMiddleware } = require('../middleware/tokenVerify');

router.get('/dashboard-stats', hostMiddleware, analyticsController.getDashboardStats);
router.get('/sales-trends', hostMiddleware, analyticsController.getSalesTrends);
router.get('/top-products', hostMiddleware, analyticsController.getTopProducts);

module.exports = router;
