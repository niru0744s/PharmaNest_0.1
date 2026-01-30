const Product = require("../../modules/Products");
const asyncHandler = require("../../utils/asyncHandler");
const ErrorResponse = require("../../utils/ErrorResponse");

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

    // Fuzzy search using regex
    const searchQuery = {
        $or: [
            { name: { $regex: q, $options: 'i' } },
            { brand: { $regex: q, $options: 'i' } },
            { category: { $regex: q, $options: 'i' } }
        ]
    };

    const products = await Product.find(searchQuery)
        .select('name brand imageUrl category price')
        .limit(10);

    res.status(200).json({
        success: true,
        count: products.length,
        data: products
    });
});
