const Host = require("../../modules/Host");
const Products = require("../../modules/Products");
const { randomInt } = require('crypto');
const bcrypt = require('bcrypt');
const jwtToken = require('../../middleware/tokenVerify');
const sendHostEmail = require("./HostEmail");
const mongoose = require('mongoose');

module.exports.otpSent = async (req, res) => {
    try {
        const { email } = req.body;
        const exstUser = await Host.findOne({ email: email });
        if (exstUser) {
            res.send({
                success: 0,
                message: "Host is already registered , Try to login !"
            })
        }
        const otp = randomInt(1000, 10000);
        const newUSr = await new Host({
            email: email,
            otp: otp
        }).save();
        await sendHostEmail(
            email,
            'Your Seller AC Login OTP Code - ',
            `<h2>Your OTP is: <b>${otp}</b></h2><p>This OTP is valid for 10 minutes.</p>`
        )
        setTimeout(async () => {
            const newOtp = randomInt(1000, 10000);
            await Host.findByIdAndUpdate(newUSr._id, {
                otp: newOtp
            });
        }, 10 * 60 * 1000)
        res.send({
            success: 1,
            message: "OTP sent successfully ! , valid for 10 min",
            newUSr
        });
    } catch (error) {
        res.send({
            success: 0,
            message: error
        })
    }
}


module.exports.otpVerify = async (req, res) => {
    try {
        const { id } = req.query;
        const { otp } = req.body;
        const exUser = await Host.findById(id);
        if (otp != exUser.otp) {
            res.send({
                success: 0,
                message: "Wrong OTP , Try again !"
            })
        }
        res.send({
            success: 1,
            message: "OTP verification Successfull !"
        });
    } catch (error) {
        res.send({
            success: 0,
            message: error
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
            password: empass
        });
        res.send({
            success: 1,
            message: "Password has updated !",
            newUser
        })
    } catch (error) {
        res.send({
            success: 0,
            message: error
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
        const token = jwtToken.generateToken(usr);
        const updatedUsr = await Host.findByIdAndUpdate(usr._id, {
            token: token
        });
        res.send({
            success: 1,
            message: "User login Successfull",
            updatedUsr,
            token
        })
    } catch (error) {
        res.send({
            success: 0,
            message: error
        })
    }
}

module.exports.showProducts = async (req, res) => {
    try {
        const hostId = new mongoose.Types.ObjectId(req.user._id); 
        const products = await Products.aggregate([
            {
                $match: { hostId } 
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
        if (!products) {
            res.send({
                success: 2,
                message: "Add some Products first"
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
            message: error
        })
    }
}
