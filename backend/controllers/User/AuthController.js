const User = require("../../modules/User");
const { randomInt } = require('crypto');
const bcrypt = require('bcrypt');
const jwtToken = require('../../middleware/tokenVerify');
const { sendUserEmail } = require('./SendEmail');
const Address = require("../../modules/Locations");
const VerificationToken = require("../../modules/VerificationToken");

module.exports.otpSent = async (req, res) => {
    try {
        const { email } = req.body
        const exstUser = await User.findOne({ email: email });
        if (exstUser) {
            return res.send({
                success: 0,
                message: "User is already registered , Try to login !"
            })
        }
        const otp = randomInt(100000, 1000000);
        const newUSr = await new User({
            email: email,
            otp: otp
        }).save();
        await sendUserEmail(
            email,
            'Your User AC Login OTP Code -',
            `<h2>Your OTP is: <b>${otp}</b></h2><p>This OTP is valid for 10 minutes.</p>`
        );
        setTimeout(async () => {
            const newOtp = randomInt(100000, 1000000);
            const exUser = await User.findByIdAndUpdate(newUSr._id, {
                otp: newOtp
            });
            if (!exUser.firstName) {
                await User.findByIdAndDelete(exUser._id);
            }
        }, 10 * 60 * 1000)
        res.send({
            success: 1,
            message: "OTP sent successfully ! , will valid for 10 min",
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
        const exUser = await User.findById(id);
        if (otp != exUser.otp) {
            return res.send({
                success: 0,
                message: "Wrong OTP , Try again !"
            })
        }
        res.send({
            success: 1,
            message: "OTP verification Successfull !"
        });
    } catch (error) {
        console.log(error);
        res.send({
            success: 0,
            message: error
        })
    }
}

module.exports.createPass = async (req, res) => {
    try {
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
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

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

        res.send({
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
        const usr = await User.findOne({ email: email });
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

        // Generate access and refresh tokens
        const { accessToken, refreshToken } = await jwtToken.generateTokens(usr, 'User');

        res.send({
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
        })
    } catch (error) {
        res.send({
            success: 0,
            message: error.message || error
        })
    }
}

module.exports.forgetPass = async (req, res) => {
    try {
        const { email } = req.body;
        const otp = randomInt(100000, 1000000);
        const usr = await User.findOneAndUpdate({ email }, {
            $set: {
                otp: otp
            }
        })
        if (!usr) {
            return res.send({
                success: 0,
                message: "Wrong email."
            })
        }

        await sendUserEmail(
            email,
            'Your Password Reset OTP - Pharmanest',
            `<h2>Your OTP to reset password is: <b>${otp}</b></h2>
             <p>This OTP is valid for 10 minutes. If you didn't request this, please ignore this email.</p>`
        );

        res.send({
            success: 1,
            message: "OTP sent successfully to your email ",
            usr
        })
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
        const usr = await User.findById(id);
        if (!usr) {
            return res.send({
                success: 0,
                message: "Something went wrong !"
            })
        }
        if (otp === usr.otp) {
            const empass = await bcrypt.hash(pass, 10);
            await User.findByIdAndUpdate(id, {
                password: empass
            });
        }
        res.send({
            success: 1,
            message: "Password has updated successfully "
        })
    } catch (error) {
        res.send({
            success: 0,
            message: error.message || error
        })
    }
}

module.exports.addAddress = async (req, res) => {
    try {
        let existUser = await User.findById(req.user._id);
        let newAddress = new Address(req.body);
        newAddress.userId = req.user._id;
        existUser.locations.push(newAddress);
        await newAddress.save();
        await existUser.save();
        res.send({
            success: 1,
            message: "Address Added Successfully",
            newAddress
        })

    } catch (error) {
        res.send({
            success: 0,
            message: error.message || error
        })
    }
};

module.exports.deleteAddress = async (req, res) => {
    try {
        let { id } = req.params;
        await User.findByIdAndUpdate(req.user._id, { $pull: { locations: id } });
        await Address.findByIdAndDelete(id);
        res.send({
            success: 1,
            message: "Address deleted"
        })
    } catch (error) {
        res.send({
            success: 0,
            message: error.message || error
        })
    }
}

module.exports.showAddress = async (req, res) => {
    try {
        const allAddress = await Address.find({ userId: req.user._id })
            .select("name mobileNum pincode address")
            .lean();
        if (allAddress.length == 0) {
            return res.send({
                success: 2,
                message: "You haven't set any address Yet!",
                allAddress
            })
        }
        res.send({
            success: 1,
            message: "Your saved Addresses",
            allAddress
        })
    } catch (error) {
        res.send({
            success: 0,
            message: error.message || error
        })
    }
}

const { cloudinary } = require('../../cloudConfig');
module.exports.updateProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({
                success: 0,
                message: "No image file provided"
            });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).send({
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

        res.send({
            success: 1,
            message: "Profile image updated successfully",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        res.status(500).send({
            success: 0,
            message: error.message || "Failed to update profile image"
        });
    }
};

module.exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { firstName, lastName, phoneNumber },
            { new: true, runValidators: true }
        ).select('-password -otp');

        if (!user) {
            return res.status(404).send({
                success: 0,
                message: "User not found"
            });
        }

        res.send({
            success: 1,
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        res.status(500).send({
            success: 0,
            message: error.message || "Failed to update profile"
        });
    }
};

module.exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -otp');
        if (!user) {
            return res.status(404).send({
                success: 0,
                message: "User not found"
            });
        }
        res.send({
            success: 1,
            message: "User profile retrieved",
            user
        });
    } catch (error) {
        res.status(500).send({
            success: 0,
            message: error.message || "Failed to fetch profile"
        });
    }
};

module.exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, password } = req.body;
        const exstUser = await User.findOne({ email });
        if (exstUser) {
            return res.send({
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
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
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
        const { accessToken, refreshToken } = await jwtToken.generateTokens(newUser, 'User');
        res.send({
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
    } catch (error) {
        console.error('Registration error:', error);
        res.send({
            success: 0,
            message: error.message || 'Registration failed'
        });
    }
};