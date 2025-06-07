const joi = require('joi');

module.exports.emailSent = joi.object({
        email: joi.string().required(),
});

module.exports.otpVerify = joi.object({
        otp: joi.string().required(),
        id: joi.string().required()
});

module.exports.userCredentials = joi.object({
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        phoneNumber: joi.number().required(),
        pass: joi.string().required()
});

module.exports.hostCredentials = joi.object({
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        pass: joi.string().required()
});

module.exports.loginSchema = joi.object({
        email: joi.string().required(),
        password: joi.string().required()
});

module.exports.products = joi.object({
        name: joi.string().required(),
        brand: joi.string().required(),
        form: joi.string().required(),
        strength: joi.string().required(),
        category: joi.string().valid(
        "Medicine",
        "OTC_Medicine",
        "First_Aid",
        "Hygiene",
        "Baby_product",
        "Supplements",
        "Test_kits"
        ).required(),
        mainPrice: joi.number().required(),
        price: joi.number().required(),
        description: joi.string().required(),
        imageUrl: joi.string().allow("",null),
        quantity: joi.number().required(),
});

module.exports.location = joi.object({
        name: joi.string().required(),
        mobileNum: joi.number().required(),
        pincode: joi.number().required(),
        address: joi.string().required(),
});