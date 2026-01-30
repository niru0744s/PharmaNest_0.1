const Review = require('../../modules/reviews');
const Product = require('../../modules/Products');
const Orders = require('../../modules/orders');

// Helper function to update product rating
async function updateProductRating(productId) {
    try {
        const reviews = await Review.find({ productId, isHidden: false });

        if (reviews.length === 0) {
            await Product.findByIdAndUpdate(productId, {
                averageRating: 0,
                totalReviews: 0,
                ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
            });
            return;
        }

        const totalReviews = reviews.length;
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(r => distribution[r.rating]++);

        await Product.findByIdAndUpdate(productId, {
            averageRating: Number(avgRating.toFixed(1)),
            totalReviews,
            ratingDistribution: distribution
        });
    } catch (error) {
        console.error('Update product rating error:', error);
    }
}

// Add Review
module.exports.addReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).send({
                success: 0,
                message: 'Rating must be between 1 and 5'
            });
        }

        if (!comment || comment.trim().length === 0) {
            return res.status(400).send({
                success: 0,
                message: 'Comment is required'
            });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({
                success: 0,
                message: 'Product not found'
            });
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({
            author: req.user._id,
            productId
        });

        if (existingReview) {
            return res.status(400).send({
                success: 0,
                message: 'You have already reviewed this product. Use update instead.'
            });
        }

        // Check if user purchased this product
        const order = await Orders.findOne({
            user: req.user._id,
            'products.product': productId,
            status: 'delivered',
            paymentStatus: 'completed'
        });

        const verifiedPurchase = !!order;

        // Create review
        const review = new Review({
            author: req.user._id,
            productId,
            rating,
            comment: comment.trim(),
            verifiedPurchase,
            orderId: order ? order._id : null
        });

        await review.save();

        // Update product rating
        await updateProductRating(productId);

        const populatedReview = await Review.findById(review._id)
            .populate('author', 'firstName lastName')
            .lean();

        res.send({
            success: 1,
            message: 'Review added successfully',
            review: populatedReview
        });
    } catch (error) {
        console.error('Add review error:', error);
        res.status(500).send({
            success: 0,
            message: error.message || 'Failed to add review'
        });
    }
};

// Get Product Reviews
module.exports.getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const { sort = '-createdAt', page = 1, limit = 10 } = req.query;

        const skip = (page - 1) * limit;

        const [reviews, product] = await Promise.all([
            Review.find({ productId, isHidden: false })
                .populate('author', 'firstName lastName')
                .populate('sellerResponse.respondedBy', 'firstName lastName')
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            Product.findById(productId).select('averageRating totalReviews ratingDistribution')
        ]);

        if (!product) {
            return res.status(404).send({
                success: 0,
                message: 'Product not found'
            });
        }

        const total = await Review.countDocuments({ productId, isHidden: false });

        res.send({
            success: 1,
            message: 'Reviews retrieved',
            reviews,
            stats: {
                totalReviews: product.totalReviews,
                averageRating: product.averageRating,
                ratingDistribution: product.ratingDistribution
            },
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).send({
            success: 0,
            message: error.message || 'Failed to get reviews'
        });
    }
};

// Update Review
module.exports.updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;

        const review = await Review.findOne({ _id: reviewId, author: req.user._id });

        if (!review) {
            return res.status(404).send({
                success: 0,
                message: 'Review not found or not authorized'
            });
        }

        if (rating) {
            if (rating < 1 || rating > 5) {
                return res.status(400).send({
                    success: 0,
                    message: 'Rating must be between 1 and 5'
                });
            }
            review.rating = rating;
        }

        if (comment) {
            review.comment = comment.trim();
        }

        await review.save();

        // Update product rating
        await updateProductRating(review.productId);

        const updatedReview = await Review.findById(reviewId)
            .populate('author', 'firstName lastName')
            .lean();

        res.send({
            success: 1,
            message: 'Review updated successfully',
            review: updatedReview
        });
    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).send({
            success: 0,
            message: error.message || 'Failed to update review'
        });
    }
};

// Delete Review
module.exports.deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findOne({ _id: reviewId, author: req.user._id });

        if (!review) {
            return res.status(404).send({
                success: 0,
                message: 'Review not found or not authorized'
            });
        }

        const productId = review.productId;

        await Review.findByIdAndDelete(reviewId);

        // Update product rating
        await updateProductRating(productId);

        res.send({
            success: 1,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).send({
            success: 0,
            message: error.message || 'Failed to delete review'
        });
    }
};

// Mark Review Helpful
module.exports.markHelpful = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).send({
                success: 0,
                message: 'Review not found'
            });
        }

        const userIndex = review.helpful.users.indexOf(req.user._id);

        if (userIndex > -1) {
            // User already marked helpful, remove it
            review.helpful.users.splice(userIndex, 1);
            review.helpful.count = review.helpful.users.length;
            await review.save();

            res.send({
                success: 1,
                message: 'Removed from helpful',
                helpful: review.helpful.count
            });
        } else {
            // Add user to helpful
            review.helpful.users.push(req.user._id);
            review.helpful.count = review.helpful.users.length;
            await review.save();

            res.send({
                success: 1,
                message: 'Marked as helpful',
                helpful: review.helpful.count
            });
        }
    } catch (error) {
        console.error('Mark helpful error:', error);
        res.status(500).send({
            success: 0,
            message: error.message || 'Failed to mark helpful'
        });
    }
};

// Report Review
module.exports.reportReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { reason } = req.body;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).send({
                success: 0,
                message: 'Review not found'
            });
        }

        // Check if user already reported
        if (review.reported.users.includes(req.user._id)) {
            return res.send({
                success: 0,
                message: 'You have already reported this review'
            });
        }

        // Add user to reported
        review.reported.users.push(req.user._id);
        review.reported.count = review.reported.users.length;

        // Auto-hide after 5 reports
        if (review.reported.count >= 5) {
            review.isHidden = true;
        }

        await review.save();

        res.send({
            success: 1,
            message: 'Review reported successfully',
            reported: review.reported.count
        });
    } catch (error) {
        console.error('Report review error:', error);
        res.status(500).send({
            success: 0,
            message: error.message || 'Failed to report review'
        });
    }
};

// Get Top Rated Products
module.exports.getTopRatedProducts = async (req, res) => {
    try {
        const { minReviews = 5, limit = 20, category } = req.query;

        const filter = {
            totalReviews: { $gte: parseInt(minReviews) },
            averageRating: { $gt: 0 }
        };

        if (category) filter.category = category;

        const products = await Product.find(filter)
            .select('name brand price imageUrl averageRating totalReviews category')
            .sort('-averageRating -totalReviews')
            .limit(parseInt(limit))
            .lean();

        res.send({
            success: 1,
            message: 'Top rated products retrieved',
            count: products.length,
            products
        });
    } catch (error) {
        console.error('Get top rated products error:', error);
        res.status(500).send({
            success: 0,
            message: error.message || 'Failed to get top rated products'
        });
    }
};
