const Product = require('../modules/Products');
const { invalidateByPrefix, invalidateMany } = require('./cache');

const invalidateProductReadCaches = async (productId) => {
    const keys = productId ? [`products:detail:${productId}:v1`] : [];
    await invalidateMany({
        keys,
        prefixes: [
            'products:list:v1',
            'products:detail:',
            'products:search:',
            'products:top-rated:'
        ]
    });
};

const getAffectedHostIdsFromOrder = async (order) => {
    if (!order || !Array.isArray(order.products) || order.products.length === 0) {
        return [];
    }

    const productIds = order.products
        .map((item) => item?.product)
        .filter(Boolean);

    if (productIds.length === 0) return [];

    const products = await Product.find({ _id: { $in: productIds } })
        .select('hostId')
        .lean();

    return [...new Set(products.map((product) => product.hostId?.toString()).filter(Boolean))];
};

const invalidateAnalyticsForHost = async (hostId) => {
    if (!hostId) return;
    await invalidateByPrefix(`analytics:${hostId}:`);
};

const invalidateAnalyticsForOrder = async (order) => {
    const hostIds = await getAffectedHostIdsFromOrder(order);
    if (hostIds.length === 0) return;

    await Promise.all(hostIds.map((hostId) => invalidateAnalyticsForHost(hostId)));
};

const invalidateUserCartCaches = async (userId) => {
    if (!userId) return;
    await invalidateByPrefix(`user:${userId}:cart:`);
};

const invalidateUserWishlistCaches = async (userId) => {
    if (!userId) return;
    await invalidateByPrefix(`user:${userId}:wishlist:`);
};

const invalidateUserOrderCaches = async (userId, orderId) => {
    if (!userId) return;

    const keys = orderId ? [`user:${userId}:order-detail:${orderId}:v1`] : [];
    await invalidateMany({
        keys,
        prefixes: [
            `user:${userId}:orders:`,
            `user:${userId}:order-detail:`
        ]
    });
};

const invalidateUserCachesForOrder = async (order) => {
    if (!order?.user) return;
    await invalidateUserOrderCaches(order.user.toString(), order._id?.toString());
};

module.exports = {
    invalidateProductReadCaches,
    invalidateAnalyticsForHost,
    invalidateAnalyticsForOrder,
    invalidateUserCartCaches,
    invalidateUserWishlistCaches,
    invalidateUserOrderCaches,
    invalidateUserCachesForOrder
};
