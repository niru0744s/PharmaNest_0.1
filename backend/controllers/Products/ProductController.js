const Product = require("../../modules/Products");
const asyncHandler = require("../../utils/asyncHandler");
const ErrorResponse = require("../../utils/ErrorResponse");
const { getOrSetCacheWithStale } = require("../../utils/cacheStrategy");
const { invalidateProductReadCaches } = require("../../utils/cacheInvalidation");

const PRODUCT_LIST_TTL_SECONDS = 120;
const PRODUCT_DETAIL_TTL_SECONDS = 300;
const PRODUCT_LIST_STALE_TTL_SECONDS = 420;
const PRODUCT_DETAIL_STALE_TTL_SECONDS = 900;

module.exports.fetchData = asyncHandler(async (req, res, next) => {
    const cacheKey = 'products:list:v1';
    const response = await getOrSetCacheWithStale({
        key: cacheKey,
        ttlSeconds: PRODUCT_LIST_TTL_SECONDS,
        staleTtlSeconds: PRODUCT_LIST_STALE_TTL_SECONDS,
        compute: async () => {
            const listFieldsProjection = {
                _id: 1,
                name: 1,
                brand: 1,
                form: 1,
                strength: 1,
                category: 1,
                price: 1,
                imageUrl: 1,
                description: 1,
                quantity: 1,
                mainPrice: 1,
                composition: 1,
                benefits: 1,
                usage: 1,
                sideEffects: 1,
                precautions: 1,
                storage: 1,
                manufacturer: 1
            };

            const categoryWise = await Product.aggregate([
                {
                    $match: { quantity: { $gt: 0 } } // Filter out-of-stock products early
                },
                {
                    $project: listFieldsProjection
                },
                {
                    $group: {
                        _id: "$category",
                        products: {
                            $push: {
                                _id: "$_id",
                                name: "$name",
                                brand: "$brand",
                                form: "$form",
                                strength: "$strength",
                                price: "$price",
                                imageUrl: "$imageUrl",
                                description: "$description",
                                quantity: "$quantity",
                                mainPrice: "$mainPrice",
                                composition: "$composition",
                                benefits: "$benefits",
                                usage: "$usage",
                                sideEffects: "$sideEffects",
                                precautions: "$precautions",
                                storage: "$storage",
                                manufacturer: "$manufacturer"
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        category: "$_id",
                        products: 1
                    }
                }
            ]);

            if (!categoryWise || categoryWise.length === 0) {
                throw new ErrorResponse('No products found', 404);
            }

            return {
                success: 1,
                message: "Product data fetched..!",
                categoryWise
            };
        }
    });

    res.send(response);
});

module.exports.showProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const cacheKey = `products:detail:${id}:v1`;
    const response = await getOrSetCacheWithStale({
        key: cacheKey,
        ttlSeconds: PRODUCT_DETAIL_TTL_SECONDS,
        staleTtlSeconds: PRODUCT_DETAIL_STALE_TTL_SECONDS,
        compute: async () => {
            const product = await Product.findById(id).populate('reviews');

            if (!product) {
                throw new ErrorResponse(`Product not found with id of ${id}`, 404);
            }

            return {
                success: 1,
                product
            };
        }
    });

    res.status(200).json(response);
});


module.exports.addProduct = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next(new ErrorResponse('Please upload an image', 400));
    }

    const url = req.file.path;
    const filename = req.file.filename;
    const { name, brand, form, strength, category, price, mainPrice, description, quantity, composition, benefits, usage, sideEffects, precautions, storage, manufacturer } = req.body;

    const initProducts = new Product({
        name, brand, form, strength, category, mainPrice, price, description, quantity, hostId: req.user._id,
        composition, benefits, usage, sideEffects, precautions, storage, manufacturer
    });
    initProducts.imageUrl = { url, filename };

    await initProducts.save();
    await invalidateProductReadCaches(initProducts._id.toString());

    res.send({
        success: 1,
        message: "Product added successfully ",
        initProducts
    })
});

module.exports.updateproduct = asyncHandler(async (req, res, next) => {
    const { id } = req.query;
    const { name, brand, form, strength, category, mainPrice, price, description, quantity, composition, benefits, usage, sideEffects, precautions, storage, manufacturer } = req.body;

    let updatedProduct = await Product.findById(id);

    if (!updatedProduct) {
        return next(new ErrorResponse(`Product not found with id of ${id}`, 404));
    }

    // Check ownership
    // if (updatedProduct.hostId.toString() !== req.user._id.toString()) {
    //     return next(new ErrorResponse('Not authorized to update this product', 401));
    // }

    updatedProduct = await Product.findByIdAndUpdate(id, {
        name,
        brand,
        form,
        strength,
        category,
        price,
        mainPrice,
        description,
        quantity,
        composition,
        benefits,
        usage,
        sideEffects,
        precautions,
        storage,
        manufacturer
    }, {
        new: true,
        runValidators: true
    });

    if (typeof req.file !== "undefined") {
        const url = req.file.path;
        const filename = req.file.filename;
        updatedProduct.imageUrl = { url, filename };
        await updatedProduct.save();
    }
    await invalidateProductReadCaches(id);

    res.send({
        success: 1,
        message: "product has been updated successfully "
    })
});

module.exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.query;

    const product = await Product.findById(id);

    if (!product) {
        return next(new ErrorResponse(`Product not found with id of ${id}`, 404));
    }

    // Check ownership
    // if (product.hostId.toString() !== req.user._id.toString()) {
    //     return next(new ErrorResponse('Not authorized to delete this product', 401));
    // }

    await Product.findByIdAndDelete(id);
    await invalidateProductReadCaches(id);

    res.send({
        success: 1,
        message: "Deleted Successfully"
    });
});

module.exports.updateBulkPrices = asyncHandler(async (req, res, next) => {
    const { updates } = req.body; // Array of { id, price, mainPrice }

    if (!updates || !Array.isArray(updates)) {
        return next(new ErrorResponse('Invalid updates data', 400));
    }

    const bulkOps = updates.map(update => ({
        updateOne: {
            filter: { _id: update.id, hostId: req.user._id },
            update: {
                $set: {
                    price: update.price,
                    mainPrice: update.mainPrice
                }
            }
        }
    }));

    await Product.bulkWrite(bulkOps);
    await invalidateProductReadCaches();

    res.status(200).json({
        success: 1,
        message: 'Prices updated successfully'
    });
});
