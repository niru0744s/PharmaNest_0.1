const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
    day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
    },
    slots: [{
        start: String, // HH:mm format
        end: String,
        isBooked: { type: Boolean, default: false }
    }]
});

const doctorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    specialization: {
        type: String,
        required: true,
        trim: true
    },
    experience: {
        type: Number, // in years
        required: true
    },
    qualifications: [String],
    licenseNumber: {
        type: String,
        required: true,
        unique: true
    },
    clinicName: String,
    bio: {
        type: String,
        maxLength: 1000
    },
    consultationFees: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    availability: [availabilitySchema],
    isVerified: {
        type: Boolean,
        default: false
    },
    profileImage: {
        url: String,
        public_id: String
    },
    isOnline: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Indexes for doctor discovery and user-to-doctor mapping
doctorSchema.index({ userId: 1 });
doctorSchema.index({ isVerified: 1 });

module.exports = mongoose.model('Doctor', doctorSchema);
