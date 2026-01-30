const mongoose = require('mongoose');
const crypto = require('crypto');

const verificationTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'userModel',
        required: true
    },
    userModel: {
        type: String,
        required: true,
        enum: ['User', 'Host']
    },
    email: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    isUsed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Auto-delete expired tokens
verificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Generate verification token
verificationTokenSchema.statics.generateToken = async function (userId, userModel, email) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours validity

    const verificationToken = new this({
        token,
        user: userId,
        userModel,
        email,
        expiresAt
    });

    await verificationToken.save();
    return token;
};

const VerificationToken = mongoose.model('VerificationToken', verificationTokenSchema);
module.exports = VerificationToken;
