const User = require('../../modules/User');
const Host = require('../../modules/Host');
const VerificationToken = require('../../modules/VerificationToken');
const { sendUserEmail } = require('./SendEmail');

// Send verification email
module.exports.sendVerificationEmail = async (req, res) => {
    try {
        const { email, userModel } = req.body; // userModel: 'User' or 'Host'

        // Find user
        const Model = userModel === 'User' ? User : Host;
        const user = await Model.findOne({ email });

        if (!user) {
            return res.status(404).send({
                success: 0,
                message: 'User not found'
            });
        }

        if (user.isVerified) {
            return res.send({
                success: 0,
                message: 'Email already verified'
            });
        }

        // Generate verification token
        const token = await VerificationToken.generateToken(user._id, userModel, email);

        // Create verification URL
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

        // Send email
        const emailBody = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4CAF50;">Welcome to PharmaNest!</h2>
                <p>Thank you for registering. Please verify your email address to activate your account.</p>
                <div style="margin: 30px 0;">
                    <a href="${verificationUrl}" 
                       style="background-color: #4CAF50; color: white; padding: 12px 30px; 
                              text-decoration: none; border-radius: 5px; display: inline-block;">
                        Verify Email Address
                    </a>
                </div>
                <p style="color: #666; font-size: 14px;">
                    Or copy and paste this link in your browser:<br>
                    <a href="${verificationUrl}">${verificationUrl}</a>
                </p>
                <p style="color: #666; font-size: 12px;">
                    This link will expire in 24 hours.
                </p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="color: #999; font-size: 12px;">
                    If you didn't create this account, please ignore this email.
                </p>
            </div>
        `;

        await sendUserEmail(email, 'Verify Your PharmaNest Account', emailBody);

        res.send({
            success: 1,
            message: 'Verification email sent successfully',
            userId: user._id
        });
    } catch (error) {
        console.error('Send verification error:', error);
        res.status(500).send({
            success: 0,
            message: error.message || 'Failed to send verification email'
        });
    }
};

// Verify email with token
module.exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        // Find verification token (without isUsed filter first)
        const verificationToken = await VerificationToken.findOne({ token });

        if (!verificationToken) {
            return res.status(400).send({
                success: 0,
                message: 'Invalid verification token'
            });
        }

        // Check expiry
        if (verificationToken.expiresAt < new Date()) {
            return res.status(400).send({
                success: 0,
                message: 'Token has expired. Please request a new one.'
            });
        }

        // If already used, checks if user is actually verified
        if (verificationToken.isUsed) {
            return res.send({
                success: 1,
                message: 'Email already verified! You can log in.'
            });
        }

        // Find and update user
        const Model = verificationToken.userModel === 'User' ? User : Host;
        const user = await Model.findById(verificationToken.user);

        if (!user) {
            return res.status(404).send({
                success: 0,
                message: 'User for this token not found'
            });
        }

        // Mark as verified
        user.isVerified = true;
        await user.save();

        // Mark token as used
        verificationToken.isUsed = true;
        await verificationToken.save();

        res.send({
            success: 1,
            message: 'Email verified successfully! You can now log in.'
        });
    } catch (error) {
        console.error('Verify email error:', error);
        res.status(500).send({
            success: 0,
            message: error.message || 'Email verification failed'
        });
    }
};

// Resend verification email
module.exports.resendVerification = async (req, res) => {
    try {
        const { email, userModel } = req.body;

        const Model = userModel === 'User' ? User : Host;
        const user = await Model.findOne({ email });

        if (!user) {
            return res.status(404).send({
                success: 0,
                message: 'User not found'
            });
        }

        if (user.isVerified) {
            return res.send({
                success: 0,
                message: 'Email already verified'
            });
        }

        // Delete old tokens for this user
        await VerificationToken.deleteMany({
            user: user._id,
            userModel
        });

        // Generate new token
        const token = await VerificationToken.generateToken(user._id, userModel, email);

        // Create verification URL
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

        // Send email
        const emailBody = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4CAF50;">Verify Your Email</h2>
                <p>You requested a new verification email. Click the button below to verify your account:</p>
                <div style="margin: 30px 0;">
                    <a href="${verificationUrl}" 
                       style="background-color: #4CAF50; color: white; padding: 12px 30px; 
                              text-decoration: none; border-radius: 5px; display: inline-block;">
                        Verify Email Address
                    </a>
                </div>
                <p style="color: #666; font-size: 14px;">
                    Or copy and paste this link in your browser:<br>
                    <a href="${verificationUrl}">${verificationUrl}</a>
                </p>
                <p style="color: #666; font-size: 12px;">
                    This link will expire in 24 hours.
                </p>
            </div>
        `;

        await sendUserEmail(email, 'Verify Your PharmaNest Account', emailBody);

        res.send({
            success: 1,
            message: 'Verification email resent successfully'
        });
    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).send({
            success: 0,
            message: error.message || 'Failed to resend verification email'
        });
    }
};
