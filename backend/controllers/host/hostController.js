const Host = require("../../modules/Host");
const Products = require("../../modules/Products");
const { randomInt } = require('crypto');
const bcrypt = require('bcrypt');
const jwtToken = require('../../middleware/tokenVerify');
const { sendEmail } = require("../../utils/emailService");
const mongoose = require('mongoose');
const VerificationToken = require("../../modules/VerificationToken");

module.exports.otpSent = async (req, res) => {
    try {
        const { email } = req.body;
        const exstUser = await Host.findOne({ email: email });
        if (exstUser) {
            return res.send({
                success: 0,
                message: "Host is already registered , Try to login !"
            })
        }
        const otp = randomInt(100000, 1000000);
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        const newUSr = await new Host({
            email: email,
            otp: otp,
            otpExpiresAt: otpExpiresAt
        }).save();

        await sendEmail({
            to: email,
            subject: 'Your Seller AC Login OTP Code',
            html: `<h2>Your OTP is: <b>${otp}</b></h2><p>This OTP is valid for 10 minutes.</p>`
        });

        res.send({
            success: 1,
            message: "OTP sent successfully! Valid for 10 minutes",
            newUSr
        });
    } catch (error) {
        res.send({
            success: 0,
            message: error.message || error
        })
    }
}


module.exports.otpVerify = async (req, res) => {
    try {
        const { id } = req.query;
        const { otp } = req.body;
        const exUser = await Host.findById(id);
        if (!exUser) {
            return res.send({
                success: 0,
                message: "Host not found!"
            });
        }

        if (new Date() > new Date(exUser.otpExpiresAt)) {
            return res.send({
                success: 0,
                message: "OTP has expired! Please request a new one."
            });
        }

        if (otp != exUser.otp) {
            return res.send({
                success: 0,
                message: "Wrong OTP, Try again!"
            });
        }
        res.send({
            success: 1,
            message: "OTP verification successful!"
        });
    } catch (error) {
        res.send({
            success: 0,
            message: error.message || error
        })
    }
}


module.exports.createPass = async (req, res) => {
    try {
        const { firstName, lastName, pass } = req.body;
        const { id } = req.query;
        const empass = await bcrypt.hash(pass, 10);
        const newUser = await Host.findByIdAndUpdate(id, {
            firstName,
            lastName,
            password: empass,
            isVerified: true // Auto-verify after successful OTP setup
        }, { new: true });

        // Generate verification token and send email
        const verificationToken = await VerificationToken.generateToken(newUser._id, 'Host', newUser.email);
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

        const verificationEmail = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4CAF50;">Welcome to PharmaNest, ${firstName}!</h2>
                <p>Thank you for registering as a seller. Please verify your email address to activate your account.</p>
                <div style="margin: 30px 0;">
                    <a href="${verificationUrl}" 
                       style="background-color: #4CAF50; color: white; padding: 12px 30px; 
                              text-decoration: none; border-radius: 5px; display: inline-block;">
                        Verify Email Address
                    </a>
                </div>
                <p style="color: #666; font-size: 12px;">This link will expire in 24 hours.</p>
                <p style="color: #999; font-size: 12px;">Note: Your seller account will be reviewed after email verification.</p>
            </div>
        `;

        await sendEmail({
            to: newUser.email,
            subject: 'Verify Your PharmaNest Seller Account',
            html: verificationEmail
        });

        // Generate tokens for immediate access to onboarding
        const { accessToken, refreshToken } = await jwtToken.generateTokens(newUser, 'Host');

        res.send({
            success: 1,
            message: "Setup successful! You can now access your dashboard. Please also verify your email.",
            seller: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role,
                isVerified: newUser.isVerified,
                isApproved: newUser.isApproved
            },
            accessToken,
            refreshToken
        })
    } catch (error) {
        res.send({
            success: 0,
            message: error.message || error
        })
    }
}


module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usr = await Host.findOne({ email: email });
        if (!usr) {
            return res.send({
                success: 0,
                message: "Wrong Email Address"
            })
        }
        const compare = await bcrypt.compare(password, usr.password);
        if (!compare) {
            return res.send({
                success: 0,
                message: "Wrong Password"
            })
        }

        // Check if email is verified
        if (!usr.isVerified) {
            return res.status(403).send({
                success: 0,
                message: "Please verify your email address before logging in. Check your inbox for the verification link.",
                needsVerification: true,
                email: usr.email
            })
        }

        // Note: Seller approval check can be added here if needed
        // For now, sellers can login after email verification

        // Generate access and refresh tokens
        const { accessToken, refreshToken } = await jwtToken.generateTokens(usr, 'Host');

        res.send({
            success: 1,
            message: "Seller login successful",
            seller: {
                id: usr._id,
                firstName: usr.firstName,
                lastName: usr.lastName,
                email: usr.email,
                role: usr.role,
                isVerified: usr.isVerified,
                isApproved: usr.isApproved,
                profileImage: usr.profileImage,
                createdAt: usr.createdAt
            },
            accessToken,
            refreshToken
        })
    } catch (error) {
        res.send({
            success: 0,
            message: error.message || error
        })
    }
}

module.exports.showProducts = async (req, res) => {
    try {
        const hostId = new mongoose.Types.ObjectId(req.user._id);
        const products = await Products.aggregate([
            {
                $match: { hostId } // Filter by seller first
            },
            {
                $group: {
                    _id: "$category",
                    products: { $push: "$$ROOT" }
                }
            },
            {
                $project: {
                    category: "$_id",
                    products: 1,
                    _id: 0
                }
            }
        ]);
        if (!products || products.length === 0) {
            return res.send({
                success: 2,
                message: "Add some Products first",
                products: []
            })
        }
        res.send({
            success: 1,
            message: "Seller Products fetched !",
            products: products
        })
    } catch (error) {
        res.send({
            success: 0,
            message: error.message || error
        })
    }
}

module.exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, password } = req.body;
        const exstUser = await Host.findOne({ email });
        if (exstUser) {
            return res.send({
                success: 0,
                message: "Seller is already registered, Try to login!"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Host({
            firstName,
            lastName,
            email,
            phoneNumber,
            password: hashedPassword,
            isVerified: false
        });
        await newUser.save();
        const verificationToken = await VerificationToken.generateToken(newUser._id, 'Host', newUser.email);
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        const verificationEmail = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4CAF50;">Welcome to PharmaNest, ${firstName}!</h2>
                <p>Thank you for registering as a seller. Please verify your email address to activate your account.</p>
                <div style="margin: 30px 0;">
                    <a href="${verificationUrl}" 
                       style="background-color: #4CAF50; color: white; padding: 12px 30px; 
                              text-decoration: none; border-radius: 5px; display: inline-block;">
                        Verify Email Address
                    </a>
                </div>
                <p style="color: #666; font-size: 12px;">This link will expire in 24 hours.</p>
            </div>
        `;
        await sendEmail({
            to: newUser.email,
            subject: 'Verify Your PharmaNest Seller Account',
            html: verificationEmail
        });

        // Generate tokens for immediate access
        const { accessToken, refreshToken } = await jwtToken.generateTokens(newUser, 'Host');

        res.send({
            success: 1,
            message: "Registration successful! Welcome to the merchant dashboard.",
            seller: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role,
                isVerified: newUser.isVerified,
                isApproved: newUser.isApproved
            },
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error('Host registration error:', error);
        res.send({
            success: 0,
            message: error.message || 'Registration failed'
        });
    }
};

module.exports.forgetPass = async (req, res) => {
    try {
        const { email } = req.body;
        const otp = randomInt(100000, 1000000);
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

        const usr = await Host.findOneAndUpdate({ email }, {
            $set: {
                otp: otp,
                otpExpiresAt: otpExpiresAt
            }
        }, { new: true });

        if (!usr) {
            return res.send({
                success: 0,
                message: "Wrong email."
            });
        }

        await sendEmail({
            to: email,
            subject: 'Your Seller Password Reset OTP - Pharmanest',
            html: `<h2>Your OTP to reset password is: <b>${otp}</b></h2>
             <p>This OTP is valid for 10 minutes. If you didn't request this, please ignore this email.</p>`
        });

        res.send({
            success: 1,
            message: "OTP sent successfully to your merchant email",
            usr
        });
    } catch (error) {
        res.send({
            success: 0,
            message: error.message || error
        })
    }
}

module.exports.changePass = async (req, res) => {
    try {
        const { otp, pass } = req.body;
        const { id } = req.query;
        const usr = await Host.findById(id);
        if (!usr) {
            return res.send({
                success: 0,
                message: "Merchant account not found!"
            });
        }

        if (new Date() > new Date(usr.otpExpiresAt)) {
            return res.send({
                success: 0,
                message: "OTP has expired! Please request a new one."
            });
        }

        if (Number(otp) === usr.otp) {
            const empass = await bcrypt.hash(pass, 10);
            await Host.findByIdAndUpdate(id, {
                password: empass,
                $unset: { otp: 1, otpExpiresAt: 1 } // Clear OTP after use
            });
            res.send({
                success: 1,
                message: "Merchant password has updated successfully"
            });
        } else {
            res.send({
                success: 0,
                message: "Invalid OTP"
            });
        }
    } catch (error) {
        res.send({
            success: 0,
            message: error.message || error
        })
    }
}

module.exports.getProfile = async (req, res) => {
    try {
        const host = await Host.findById(req.user._id).select('-password -otp');
        if (!host) {
            return res.status(404).send({
                success: 0,
                message: "Seller not found"
            });
        }
        res.send({
            success: 1,
            message: "Seller profile retrieved",
            seller: host
        });
    } catch (error) {
        res.status(500).send({
            success: 0,
            message: error.message || "Failed to fetch profile"
        });
    }
};
