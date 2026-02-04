const User = require('../../modules/User');
const Host = require('../../modules/Host');
const VerificationToken = require('../../modules/VerificationToken');
const { sendEmail } = require('../../utils/emailService');

// Send verification email
module.exports.sendVerificationEmail = async (req, res) => {
    try {
        console.log('--- Send Verification Email Request ---');
        const { email, userModel } = req.body; // userModel: 'User' or 'Host'
        console.log(`Email: ${email}, Model: ${userModel}`);

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

        const baseUrl = (process.env.FRONTEND_URL || '').replace(/\/$/, '');
        const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

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

        await sendEmail({
            to: email,
            subject: 'Verify Your PharmaNest Account',
            html: emailBody
        });

        res.send({
            success: 1,
            message: 'Verification email sent successfully',
            userId: user._id
        });
    } catch (error) {
        console.error('--- Send Verification Error ---');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
        res.status(500).send({
            success: 0,
            message: error.message || 'Failed to send verification email'
        });
    }
};

// Verify email with token
module.exports.verifyEmail = async (req, res) => {
    try {
        console.log('--- Verify Email Request ---');
        const { token } = req.params;
        console.log(`Token received: ${token}`);

        // Find verification token (without isUsed filter first)
        const verificationToken = await VerificationToken.findOne({ token });

        if (!verificationToken) {
            console.log(`[Verification] Invalid token attempted: ${token}`);
            return res.status(400).send({
                success: 0,
                message: 'Invalid verification token'
            });
        }

        // Check expiry
        if (verificationToken.expiresAt < new Date()) {
            console.log(`[Verification] Token expired: ${token}. Expired at: ${verificationToken.expiresAt}`);
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
            console.log(`User not found for token: ${token}`);
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

        // Generate tokens for auto-login after verification
        const jwtToken = require('../../middleware/tokenVerify');
        const { accessToken, refreshToken } = await jwtToken.generateTokens(user, verificationToken.userModel);

        res.send({
            success: 1,
            message: 'Email verified successfully! You are now logged in.',
            accessToken,
            refreshToken,
            user: verificationToken.userModel === 'User' ? {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                isVerified: user.isVerified
            } : undefined,
            seller: verificationToken.userModel === 'Host' ? {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                isApproved: user.isApproved
            } : undefined
        });
        console.log(`User ${user.email} verified successfully and logged in`);
    } catch (error) {
        console.error('--- Verify Email Process Error ---');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
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

        const baseUrl = (process.env.FRONTEND_URL || '').replace(/\/$/, '');
        const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

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

        await sendEmail({
            to: email,
            subject: 'Verify Your PharmaNest Account',
            html: emailBody
        });

        res.send({
            success: 1,
            message: 'Verification email resent successfully'
        });
    } catch (error) {
        console.error('--- Resend Verification Error ---');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
        res.status(500).send({
            success: 0,
            message: error.message || 'Failed to resend verification email'
        });
    }
};
