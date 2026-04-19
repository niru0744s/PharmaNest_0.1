const Order = require('../../modules/orders');
const Product = require('../../modules/Products');
const asyncHandler = require('../../utils/asyncHandler');
const mongoose = require('mongoose');
const { getCache, setCache } = require('../../utils/cache');

const DASHBOARD_TTL_SECONDS = 120;
const SALES_TRENDS_TTL_SECONDS = 120;
const TOP_PRODUCTS_TTL_SECONDS = 120;

/**
 * @desc    Get dashboard summary statistics
 * @route   GET /api/v1/host/analytics/dashboard-stats
 * @access  Private (Host)
 */
exports.getDashboardStats = asyncHandler(async (req, res) => {
    const hostId = req.user._id;
    const cacheKey = `analytics:${hostId}:dashboard-stats:v1`;
    const cachedResponse = await getCache(cacheKey);
    if (cachedResponse) {
        return res.status(200).json(cachedResponse);
    }

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

    const response = {
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
    };

    await setCache(cacheKey, response, DASHBOARD_TTL_SECONDS);
    res.status(200).json(response);
});

/**
 * @desc    Get sales trends (last 30 days)
 * @route   GET /api/v1/host/analytics/sales-trends
 * @access  Private (Host)
 */
exports.getSalesTrends = asyncHandler(async (req, res) => {
    const hostId = req.user._id;
    const cacheKey = `analytics:${hostId}:sales-trends:v1`;
    const cachedResponse = await getCache(cacheKey);
    if (cachedResponse) {
        return res.status(200).json(cachedResponse);
    }

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

    const response = {
        success: 1,
        trends
    };

    await setCache(cacheKey, response, SALES_TRENDS_TTL_SECONDS);
    res.status(200).json(response);
});

/**
 * @desc    Get top selling products
 * @route   GET /api/v1/host/analytics/top-products
 * @access  Private (Host)
 */
exports.getTopProducts = asyncHandler(async (req, res) => {
    const hostId = req.user._id;
    const cacheKey = `analytics:${hostId}:top-products:v1`;
    const cachedResponse = await getCache(cacheKey);
    if (cachedResponse) {
        return res.status(200).json(cachedResponse);
    }

    const topProducts = await Product.find({ hostId })
        .sort({ soldQuantity: -1 }) // Sort by soldQuantity descending
        .limit(5)
        .select('name price soldQuantity stockStatus averageRating imageUrl');

    const response = {
        success: 1,
        products: topProducts
    };

    await setCache(cacheKey, response, TOP_PRODUCTS_TTL_SECONDS);
    res.status(200).json(response);
});
