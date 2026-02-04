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
    otpExpiresAt: {
        type: Date
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

// Cleanup middleware after user deletion
newSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        const userId = doc._id;
        try {
            // Use mongoose.model to avoid circular dependencies
            const Address = mongoose.model('Address');
            const Cart = mongoose.model('Cart');
            const Chat = mongoose.model('Chat');
            const Consultation = mongoose.model('Consultation');
            const Doctor = mongoose.model('Doctor');
            const Prescription = mongoose.model('Prescription');
            const RefreshToken = mongoose.model('RefreshToken');
            const VerificationToken = mongoose.model('VerificationToken');
            const Review = mongoose.model('Review');

            await Promise.all([
                Address.deleteMany({ userId: userId }),
                Cart.deleteMany({ UserId: userId }),
                Chat.deleteMany({ userId: userId }),
                Consultation.deleteMany({ userId: userId }),
                Doctor.deleteOne({ userId: userId }),
                Prescription.deleteMany({ patientId: userId }),
                RefreshToken.deleteMany({ user: userId }),
                VerificationToken.deleteMany({ userId: userId }),
                Review.deleteMany({ author: userId })
            ]);
            console.log(`Successfully cleaned up data for deleted user: ${userId}`);
        } catch (error) {
            console.error(`Error during user data cleanup: ${error.message}`);
        }
    }
});

const User = mongoose.model("User", newSchema);
module.exports = User;