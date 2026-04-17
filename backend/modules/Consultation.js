const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    type: {
        type: String,
        enum: ['chat', 'voice', 'video'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'ongoing', 'completed', 'cancelled'],
        default: 'pending'
    },
    scheduledDate: {
        type: Date,
        required: true
    },
    slot: {
        start: String,
        end: String
    },
    reason: {
        type: String, // Reason for consultation
        required: true
    },
    prescription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prescription' // We will create this model later if needed
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    paymentId: String,
    roomName: String, // Unique identifier for video/chat room
    notes: String // Doctor's private notes
}, {
    timestamps: true
});

// Indexes for consultation timeline and participant queries
consultationSchema.index({ userId: 1, scheduledDate: -1 });
consultationSchema.index({ doctorId: 1, scheduledDate: -1 });
consultationSchema.index({ status: 1, scheduledDate: -1 });

module.exports = mongoose.model('Consultation', consultationSchema);
