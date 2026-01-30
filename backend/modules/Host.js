const mongoose = require("mongoose");

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
    otp: {
        type: Number
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: ['host', 'admin'],
        default: 'host'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    operator: {
        type: "String",
        default: "host",
    }
}, {
    timestamps: true
});

// Indexes for performance optimization
newSchema.index({ email: 1 }, { unique: true }); // Unique index for email
newSchema.index({ role: 1, isVerified: 1, isApproved: 1 }); // Role, verification, and approval queries

const Host = mongoose.model('Host', newSchema);
module.exports = Host;