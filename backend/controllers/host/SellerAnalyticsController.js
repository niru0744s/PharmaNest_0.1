const Order = require('../../modules/orders');
const Product = require('../../modules/Products');
const asyncHandler = require('../../utils/asyncHandler');
const mongoose = require('mongoose');

/**
 * @desc    Get dashboard summary statistics
 * @route   GET /api/v1/host/analytics/dashboard-stats
 * @access  Private (Host)
 */
exports.getDashboardStats = asyncHandler(async (req, res) => {
    const hostId = req.user._id;

    // 1. Calculate Total Revenue & Total Orders
    // We need to look at orders that contain products from this host
    // Since Order model has an array of products, we need to unwind and filter
    const salesStats = await Order.aggregate([
        { $unwind: '$products' },
        {
            $lookup: {
                from: 'products',
                localField: 'products.product',
                foreignField: '_id',
                as: 'productDetails'
            }
        },
        { $unwind: '$productDetails' },
        {
            $match: {
                'productDetails.hostId': hostId,
                'status': { $ne: 'Cancelled' } // Exclude cancelled orders
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: { $multiply: ['$products.quantity', '$productDetails.price'] } },
                totalOrders: { $addToSet: '$_id' }, // Count unique order IDs
                totalUnitsSold: { $sum: '$products.quantity' }
            }
        },
        {
            $project: {
                _id: 0,
                totalRevenue: 1,
                totalOrders: { $size: '$totalOrders' },
                totalUnitsSold: 1
            }
        }
    ]);

    // 2. Count Active Products
    const productStats = await Product.countDocuments({
        hostId: hostId,
        stockStatus: { $ne: 'out_of_stock' }
    });

    // 3. Count Low Stock Alerts
    const lowStockCount = await Product.countDocuments({
        hostId: hostId,
        stockStatus: { $in: ['low_stock', 'out_of_stock'] }
    });

    // 4. Calculate Average Rating
    const ratingStats = await Product.aggregate([
        { $match: { hostId: hostId } },
        {
            $group: {
                _id: null,
                avgRating: { $avg: '$averageRating' },
                totalReviews: { $sum: '$totalReviews' }
            }
        }
    ]);

    res.status(200).json({
        success: 1,
        stats: {
            revenue: salesStats[0]?.totalRevenue || 0,
            orders: salesStats[0]?.totalOrders || 0,
            unitsSold: salesStats[0]?.totalUnitsSold || 0,
            activeProducts: productStats,
            lowStockAlerts: lowStockCount,
            averageRating: parseFloat(ratingStats[0]?.avgRating?.toFixed(1) || 0),
            totalReviews: ratingStats[0]?.totalReviews || 0
        }
    });
});

/**
 * @desc    Get sales trends (last 30 days)
 * @route   GET /api/v1/host/analytics/sales-trends
 * @access  Private (Host)
 */
exports.getSalesTrends = asyncHandler(async (req, res) => {
    const hostId = req.user._id;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trends = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: thirtyDaysAgo },
                status: { $ne: 'Cancelled' }
            }
        },
        { $unwind: '$products' },
        {
            $lookup: {
                from: 'products',
                localField: 'products.product',
                foreignField: '_id',
                as: 'productDetails'
            }
        },
        { $unwind: '$productDetails' },
        {
            $match: {
                'productDetails.hostId': hostId
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                dailyRevenue: { $sum: { $multiply: ['$products.quantity', '$productDetails.price'] } },
                dailyOrders: { $addToSet: '$_id' } // Unique orders per day
            }
        },
        {
            $sort: { _id: 1 }
        },
        {
            $project: {
                date: '$_id',
                revenue: '$dailyRevenue',
                orders: { $size: '$dailyOrders' },
                _id: 0
            }
        }
    ]);

    res.status(200).json({
        success: 1,
        trends
    });
});

/**
 * @desc    Get top selling products
 * @route   GET /api/v1/host/analytics/top-products
 * @access  Private (Host)
 */
exports.getTopProducts = asyncHandler(async (req, res) => {
    const hostId = req.user._id;

    const topProducts = await Product.find({ hostId })
        .sort({ soldQuantity: -1 }) // Sort by soldQuantity descending
        .limit(5)
        .select('name price soldQuantity stockStatus averageRating imageUrl');

    res.status(200).json({
        success: 1,
        products: topProducts
    });
});
