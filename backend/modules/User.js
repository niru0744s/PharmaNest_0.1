const mongoose = require('mongoose');
const newSchema = mongoose.Schema({
    firstName: {
        type: String,
        require: true,
    },
    lastName: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    phoneNumber: {
        type: String,
        require: true
    },
    password: {
        type: String,
    },
    otp: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'doctor'],
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    locations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address"
        }
    ],
    profileImage: {
        url: String,
        publicId: String
    }
}, {
    timestamps: true
})

// Indexes for performance optimization
newSchema.index({ email: 1 }, { unique: true }); // Unique index for email (fast lookups)
newSchema.index({ phoneNumber: 1 }); // Phone number lookups
newSchema.index({ role: 1, isVerified: 1 }); // Role and verification queries

const User = mongoose.model("User", newSchema);
module.exports = User;