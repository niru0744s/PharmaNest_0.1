const mongoose = require("mongoose");
const newSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
  , status: {
    type: String,
    enum: ["pending", "shipped", "on_the_way", "delivered", "cancelled"],
    default: "pending"
  },
  totalAmount: {
    type: Number,
    default: 0
  }
  , products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      quantity: Number,
    }
  ],
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address"
  },
  paymentId: {
    type: String,
    default: null
  },
  razorpayOrderId: {
    type: String,
    default: null
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    default: 'razorpay'
  },
  refundId: {
    type: String,
    default: null
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ["pending", "shipped", "on_the_way", "delivered", "cancelled"]
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'updatedByModel'
    },
    updatedByModel: {
      type: String,
      enum: ['User', 'Host']
    },
    notes: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  trackingNumber: {
    type: String,
    default: null
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'cancelledByModel'
  },
  cancelledByModel: {
    type: String,
    enum: ['User', 'Host']
  },
  cancellationReason: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for performance optimization
newSchema.index({ user: 1, createdAt: -1 }); // User's orders sorted by newest
newSchema.index({ status: 1, createdAt: -1 }); // Filter by status
newSchema.index({ 'products.product': 1 }); // Query orders containing specific product

const Orders = mongoose.model("Orders", newSchema);
module.exports = Orders;