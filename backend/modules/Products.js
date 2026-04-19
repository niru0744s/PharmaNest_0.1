const mongoose = require("mongoose");
const Review = require("./reviews");
const User = require("./User");


const newSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    form: {
        type: String,
        required: true,
    },
    strength: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ["Medicine", "OTC_Medicine", "First_Aid", "Hygiene", "Baby_product", "Supplements", "Test_kits"],
        required: true,
    },
    mainPrice: {
        type: Number,
        require: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        url: String,
        filename: String,
    },
    quantity: {
        type: Number,
        default: 0,
    },
    sku: {
        type: String,
        unique: true,
        sparse: true // Allow null for existing products initially
    },
    stockStatus: {
        type: String,
        enum: ['in_stock', 'low_stock', 'out_of_stock'],
        default: 'in_stock'
    },
    lowStockThreshold: {
        type: Number,
        default: 10
    },
    soldQuantity: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    hostId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Host"
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    ratingDistribution: {
        5: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        1: { type: Number, default: 0 }
    },
    composition: {
        type: String,
        default: ""
    },
    benefits: [
        {
            type: String
        }
    ],
    usage: {
        type: String,
        default: ""
    },
    sideEffects: {
        type: String,
        default: ""
    },
    precautions: {
        type: String,
        default: ""
    },
    storage: {
        type: String,
        default: ""
    },
    manufacturer: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

// Auto-update stockStatus before saving
newSchema.pre('save', function (next) {
    if (this.isModified('quantity') || this.isModified('lowStockThreshold')) {
        if (this.quantity <= 0) {
            this.stockStatus = 'out_of_stock';
        } else if (this.quantity <= this.lowStockThreshold) {
            this.stockStatus = 'low_stock';
        } else {
            this.stockStatus = 'in_stock';
        }
    }
    next();
});


// Indexes for performance optimization
newSchema.index({
    name: 'text',
    brand: 'text',
    category: 'text',
    description: 'text',
    composition: 'text'
}); // Enhanced Text search
newSchema.index({ category: 1, price: 1 }); // Filter by category and price
newSchema.index({ hostId: 1, category: 1 }); // Seller's products by category
newSchema.index({ quantity: 1 }); // Low stock queries
newSchema.index({ quantity: 1, category: 1 }); // In-stock products grouped by category
newSchema.index({ createdAt: -1 }); // Sort by newest first
newSchema.index({ price: 1 }); // Price range queries
newSchema.index({ averageRating: -1 }); // Sort by rating (top-rated products)

newSchema.post("findOneAndDelete", async (Product) => {
    if (Product) {
        await Review.deleteMany({ reviews: { $in: Product.reviews } });
    }
});

newSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await User.updateMany(
            { purchased: doc._id },
            { $pull: { purchased: doc._id } }
        );
    }
});


const Product = mongoose.model("Product", newSchema);
module.exports = Product;
