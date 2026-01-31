const csv = require('csvtojson');
const Product = require('../../modules/Products');
const asyncHandler = require('../../utils/asyncHandler');
const ErrorResponse = require('../../utils/ErrorResponse');

/**
 * @desc    Upload bulk products from CSV
 * @route   POST /api/v1/host/bulk-upload
 * @access  Private (Seller only)
 */
module.exports.uploadBulkProducts = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next(new ErrorResponse('Please upload a CSV file', 400));
    }

    try {
        const jsonArray = await csv().fromFile(req.file.path);

        if (jsonArray.length === 0) {
            return next(new ErrorResponse('The CSV file is empty', 400));
        }

        // Prepare products for insertion
        const productsToInsert = jsonArray.map(item => ({
            name: item.name,
            brand: item.brand,
            form: item.form,
            strength: item.strength,
            category: item.category,
            mainPrice: Number(item.mainPrice || item.price),
            price: Number(item.price),
            description: item.description || `High quality ${item.name} from ${item.brand}`,
            quantity: Number(item.quantity || 0),
            sku: item.sku || `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            lowStockThreshold: Number(item.lowStockThreshold || 10),
            hostId: req.user._id,
            imageUrl: {
                url: item.imageUrl || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
                filename: 'bulk_import'
            }
        }));

        // Validate unique SKUs within the file
        const skus = productsToInsert.map(p => p.sku);
        if (new Set(skus).size !== skus.length) {
            return next(new ErrorResponse('Duplicate SKUs found within the CSV file', 400));
        }

        // Use BulkWrite for performance
        const result = await Product.insertMany(productsToInsert, { ordered: false });

        res.status(201).json({
            success: 1,
            message: `Successfully imported ${result.length} products`,
            count: result.length
        });
    } catch (error) {
        console.error('Bulk upload error:', error);
        if (error.code === 11000) {
            return next(new ErrorResponse('One or more SKUs already exist in the database', 400));
        }
        return next(new ErrorResponse(`Parsing error: ${error.message}`, 400));
    }
});

/**
 * @desc    Bulk update prices for products
 * @route   PATCH /api/v1/host/bulk-update-price
 * @access  Private (Seller only)
 */
module.exports.bulkUpdatePrice = asyncHandler(async (req, res, next) => {
    const { updates } = req.body; // Array of { id, price }

    if (!Array.isArray(updates) || updates.length === 0) {
        return next(new ErrorResponse('Please provide an array of updates', 400));
    }

    const bulkOps = updates.map(update => {
        const updateFields = { price: update.price };
        if (update.mainPrice !== undefined) {
            updateFields.mainPrice = update.mainPrice;
        }

        return {
            updateOne: {
                filter: { _id: update.id, hostId: req.user._id },
                update: { $set: updateFields }
            }
        };
    });

    const result = await Product.bulkWrite(bulkOps);

    res.status(200).json({
        success: 1,
        message: `Updated ${result.modifiedCount} products`,
        modifiedCount: result.modifiedCount
    });
});
