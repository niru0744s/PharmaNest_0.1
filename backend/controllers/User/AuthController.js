const User = require("../../modules/User");
const { randomInt } = require('crypto');
const bcrypt = require('bcrypt');
const jwtToken = require('../../middleware/tokenVerify');
const { sendUserEmail } = require('./SendEmail');
const Address = require("../../modules/Locations");
const VerificationToken = require("../../modules/VerificationToken");
const asyncHandler = require('../../utils/asyncHandler');

module.exports.otpSent = asyncHandler(async (req, res) => {
    const { email } = req.body
    const exstUser = await User.findOne({ email: email });
    if (exstUser) {
        return res.json({
            success: 0,
            message: "User is already registered, Try to login!"
        });
    }
    const otp = randomInt(100000, 1000000);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    const newUSr = await new User({
        email: email,
        otp: otp,
        otpExpiresAt: otpExpiresAt
    }).save();

    await sendUserEmail(
        email,
        'Your User AC Login OTP Code -',
        `<h2>Your OTP is: <b>${otp}</b></h2><p>This OTP is valid for 10 minutes.</p>`
    );

    res.json({
        success: 1,
        message: "OTP sent successfully! Valid for 10 minutes.",
        newUSr
    });
});

module.exports.otpVerify = asyncHandler(async (req, res) => {
    const { id } = req.query;
    const { otp } = req.body;
    const exUser = await User.findById(id);
    if (!exUser) {
        return res.json({
            success: 0,
            message: "User not found!"
        });
    }

    if (new Date() > new Date(exUser.otpExpiresAt)) {
        return res.json({
            success: 0,
            message: "OTP has expired! Please request a new one."
        });
    }

    if (otp != exUser.otp) {
        return res.json({
            success: 0,
            message: "Wrong OTP, Try again!"
        });
    }
    res.json({
        success: 1,
        message: "OTP verification successful!"
    });
});

module.exports.createPass = asyncHandler(async (req, res) => {
    const { firstName, lastName, phoneNumber, pass } = req.body;
    const { id } = req.query;
    const empass = await bcrypt.hash(pass, 10);
    const newUser = await User.findByIdAndUpdate(id, {
        firstName,
        lastName,
        phoneNumber,
        password: empass,
    }, { new: true });

    // Generate verification token and send email
    const verificationToken = await VerificationToken.generateToken(newUser._id, 'User', newUser.email);
    const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
    const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;
    console.log(`Generated verification URL: ${verificationUrl}`);

    const verificationEmail = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4CAF50;">Welcome to PharmaNest, ${firstName}!</h2>
            <p>Thank you for registering. Please verify your email address to activate your account.</p>
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

    await sendUserEmail(newUser.email, 'Verify Your PharmaNest Account', verificationEmail);

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await jwtToken.generateTokens(newUser, 'User');

    res.json({
        success: 1,
        message: "Registration successful! Please check your email to verify your account.",
        user: {
            id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
            isVerified: newUser.isVerified
        },
        accessToken,
        refreshToken
    });
});

module.exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const usr = await User.findOne({ email: email });
    if (!usr) {
        return res.json({
            success: 0,
            message: "Wrong Email Address"
        });
    }
    const compare = await bcrypt.compare(password, usr.password);
    if (!compare) {
        return res.json({
            success: 0,
            message: "Wrong Password"
        });
    }

    // Check if email is verified
    if (!usr.isVerified) {
        return res.status(403).json({
            success: 0,
            message: "Please verify your email address before logging in. Check your inbox for the verification link.",
            needsVerification: true,
            email: usr.email
        });
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await jwtToken.generateTokens(usr, 'User');

    res.json({
        success: 1,
        message: "User login successful",
        user: {
            id: usr._id,
            firstName: usr.firstName,
            lastName: usr.lastName,
            email: usr.email,
            phoneNumber: usr.phoneNumber,
            role: usr.role,
            isVerified: usr.isVerified,
            profileImage: usr.profileImage,
            createdAt: usr.createdAt
        },
        accessToken,
        refreshToken
    });
});

module.exports.forgetPass = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const otp = randomInt(100000, 1000000);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const usr = await User.findOneAndUpdate({ email }, {
        $set: {
            otp: otp,
            otpExpiresAt: otpExpiresAt
        }
    }, { new: true });

    if (!usr) {
        return res.json({
            success: 0,
            message: "Wrong email."
        });
    }

    await sendUserEmail(
        email,
        'Your Password Reset OTP - Pharmanest',
        `<h2>Your OTP to reset password is: <b>${otp}</b></h2>
         <p>This OTP is valid for 10 minutes. If you didn't request this, please ignore this email.</p>`
    );

    res.json({
        success: 1,
        message: "OTP sent successfully to your email",
        usr
    });
});

module.exports.changePass = asyncHandler(async (req, res) => {
    const { otp, pass } = req.body;
    const { id } = req.query;
    const usr = await User.findById(id);
    if (!usr) {
        return res.json({
            success: 0,
            message: "Something went wrong!"
        });
    }

    if (new Date() > new Date(usr.otpExpiresAt)) {
        return res.json({
            success: 0,
            message: "OTP has expired! Please request a new one."
        });
    }

    if (otp == usr.otp) {
        const empass = await bcrypt.hash(pass, 10);
        await User.findByIdAndUpdate(id, {
            password: empass,
            $unset: { otp: 1, otpExpiresAt: 1 } // Clear OTP after use
        });
        res.json({
            success: 1,
            message: "Password has updated successfully"
        });
    } else {
        res.json({
            success: 0,
            message: "Wrong OTP!"
        });
    }
});

module.exports.addAddress = asyncHandler(async (req, res) => {
    let existUser = await User.findById(req.user._id);
    let newAddress = new Address(req.body);
    newAddress.userId = req.user._id;
    existUser.locations.push(newAddress);
    await newAddress.save();
    await existUser.save();
    res.json({
        success: 1,
        message: "Address Added Successfully",
        newAddress
    });
});

module.exports.deleteAddress = asyncHandler(async (req, res) => {
    let { id } = req.params;
    await User.findByIdAndUpdate(req.user._id, { $pull: { locations: id } });
    await Address.findByIdAndDelete(id);
    res.json({
        success: 1,
        message: "Address deleted"
    });
});

module.exports.showAddress = asyncHandler(async (req, res) => {
    const allAddress = await Address.find({ userId: req.user._id })
        .select("name mobileNum pincode address")
        .lean();
    if (allAddress.length == 0) {
        return res.json({
            success: 2,
            message: "You haven't set any address Yet!",
            allAddress
        });
    }
    res.json({
        success: 1,
        message: "Your saved Addresses",
        allAddress
    });
});

const { cloudinary } = require('../../cloudConfig');
module.exports.updateProfileImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: 0,
            message: "No image file provided"
        });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({
            success: 0,
            message: "User not found"
        });
    }

    // Delete old image if it exists
    if (user.profileImage && user.profileImage.publicId) {
        await cloudinary.uploader.destroy(user.profileImage.publicId);
    }

    user.profileImage = {
        url: req.file.path,
        publicId: req.file.filename
    };

    await user.save();

    res.json({
        success: 1,
        message: "Profile image updated successfully",
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            profileImage: user.profileImage,
            role: user.role,
            isVerified: user.isVerified
        }
    });
});

module.exports.updateProfile = asyncHandler(async (req, res) => {
    const { firstName, lastName, phoneNumber } = req.body;
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { firstName, lastName, phoneNumber },
        { new: true, runValidators: true }
    ).select('-password -otp');

    if (!user) {
        return res.status(404).json({
            success: 0,
            message: "User not found"
        });
    }

    res.json({
        success: 1,
        message: "Profile updated successfully",
        user
    });
});

module.exports.getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password -otp');
    if (!user) {
        return res.status(404).json({
            success: 0,
            message: "User not found"
        });
    }
    res.json({
        success: 1,
        message: "User profile retrieved",
        user
    });
});

module.exports.register = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phoneNumber, password } = req.body;
    const exstUser = await User.findOne({ email });
    if (exstUser) {
        return res.json({
            success: 0,
            message: "User is already registered, Try to login!"
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        firstName,
        lastName,
        email,
        phoneNumber,
        password: hashedPassword,
        isVerified: false
    });
    await newUser.save();
    const verificationToken = await VerificationToken.generateToken(newUser._id, 'User', newUser.email);
    const baseUrl = (process.env.FRONTEND_URL || '').replace(/\/$/, '');
    const verificationUrl = `${baseUrl}/verify-email?token=${verificationToken}`;
    const verificationEmail = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4CAF50;">Welcome to PharmaNest, ${firstName}!</h2>
            <p>Thank you for registering. Please verify your email address to activate your account.</p>
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
    await sendUserEmail(newUser.email, 'Verify Your PharmaNest Account', verificationEmail);

    res.json({
        success: 1,
        message: "Registration successful! Please check your email to verify your account.",
        user: {
            id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
            isVerified: newUser.isVerified
        }
    });
});

module.exports.deleteAccount = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({
            success: 0,
            message: "User not found"
        });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({
            success: 0,
            message: "Incorrect password. Account deletion aborted."
        });
    }

    // Deleting the user triggers the post-middleware in User.js for cleanup
    await User.findByIdAndDelete(req.user._id);

    res.json({
        success: 1,
        message: "Account and all associated data deleted successfully."
    });
});