const Product = require("../../modules/Products");
const asyncHandler = require("../../utils/asyncHandler");
const ErrorResponse = require("../../utils/ErrorResponse");
const { getOrSetCacheWithStale } = require("../../utils/cacheStrategy");

const SEARCH_TTL_SECONDS = 90;
const SEARCH_STALE_TTL_SECONDS = 240;

/**
 * @desc    Search products by name, brand, or category
 * @route   GET /api/v1/search
 * @access  Public
 */
module.exports.searchProducts = asyncHandler(async (req, res, next) => {
    const { q } = req.query;

    if (!q) {
        return res.status(200).json({
            success: true,
            data: []
        });
    }

    const normalizedQuery = String(q).trim().toLowerCase();
    const cacheKey = `products:search:${encodeURIComponent(normalizedQuery)}:v1`;
    const response = await getOrSetCacheWithStale({
        key: cacheKey,
        ttlSeconds: SEARCH_TTL_SECONDS,
        staleTtlSeconds: SEARCH_STALE_TTL_SECONDS,
        compute: async () => {
            // Fuzzy search using regex
            const searchQuery = {
                $or: [
                    { name: { $regex: normalizedQuery, $options: 'i' } },
                    { brand: { $regex: normalizedQuery, $options: 'i' } },
                    { category: { $regex: normalizedQuery, $options: 'i' } }
                ]
            };

            const products = await Product.find(searchQuery)
                .select('name brand imageUrl category price')
                .limit(10);

            return {
                success: true,
                count: products.length,
                data: products
            };
        }
    });

    res.status(200).json(response);
});
