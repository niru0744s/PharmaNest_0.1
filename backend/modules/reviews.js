const mongoose = require("mongoose");
const newSchema = mongoose.Schema({
    comment: {
        type: String,
        require: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    verifiedPurchase: {
        type: Boolean,
        default: false
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Orders"
    },
    helpful: {
        count: {
            type: Number,
            default: 0
        },
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }]
    },
    reported: {
        count: {
            type: Number,
            default: 0
        },
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }]
    },
    sellerResponse: {
        comment: String,
        respondedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Host"
        },
        respondedAt: Date
    },
    isHidden: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Indexes for performance optimization
newSchema.index({ productId: 1, createdAt: -1 }); // Product reviews sorted by newest
newSchema.index({ author: 1 }); // User's reviews
newSchema.index({ author: 1, productId: 1 }, { unique: true }); // Prevent duplicate reviews

module.exports = mongoose.model("Review", newSchema);
