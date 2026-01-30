const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/Products/ReviewController');
const { userMiddleware } = require('../middleware/tokenVerify');

// Add review to product
router.post('/products/:productId/reviews', userMiddleware, reviewController.addReview);

// Get product reviews
router.get('/products/:productId/reviews', reviewController.getProductReviews);

// Update review
router.put('/reviews/:reviewId', userMiddleware, reviewController.updateReview);

// Delete review
router.delete('/reviews/:reviewId', userMiddleware, reviewController.deleteReview);

// Mark review helpful
router.post('/reviews/:reviewId/helpful', userMiddleware, reviewController.markHelpful);

// Report review
router.post('/reviews/:reviewId/report', userMiddleware, reviewController.reportReview);

// Get top rated products
router.get('/products/top-rated', reviewController.getTopRatedProducts);

module.exports = router;
